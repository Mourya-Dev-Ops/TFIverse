const db = require('../db/schema');
const express = require('express');
const router = express.Router();

// GET /api/movies  (with optional search, genre, year filters)
router.get('/', (req, res) => {
  const { q, genre, year, page = 1, limit = 12 } = req.query;
  const offset = (Number(page) - 1) * Number(limit);

  let whereClauses = [];
  let params = [];

  if (q) {
    whereClauses.push('m.title LIKE ?');
    params.push(`%${q}%`);
  }
  if (year) {
    whereClauses.push('m.release_year = ?');
    params.push(Number(year));
  }
  if (genre) {
    whereClauses.push('EXISTS (SELECT 1 FROM movie_genres mg JOIN genres g ON mg.genre_id=g.id WHERE mg.movie_id=m.id AND g.name=?)');
    params.push(genre);
  }

  const where = whereClauses.length ? 'WHERE ' + whereClauses.join(' AND ') : '';

  const total = db.prepare(`SELECT COUNT(*) as c FROM movies m ${where}`).get(...params).c;

  const movies = db.prepare(`
    SELECT m.id, m.title, m.release_year, m.duration_min, m.language,
           m.poster, m.imdb_rating, m.box_office,
           p.name AS director_name,
           GROUP_CONCAT(DISTINCT g.name) AS genres
    FROM movies m
    LEFT JOIN persons p ON m.director_id = p.id
    LEFT JOIN movie_genres mg ON mg.movie_id = m.id
    LEFT JOIN genres g ON g.id = mg.genre_id
    ${where}
    GROUP BY m.id
    ORDER BY m.release_year DESC, m.imdb_rating DESC
    LIMIT ? OFFSET ?
  `).all(...params, Number(limit), offset);

  res.json({
    movies: movies.map(m => ({ ...m, genres: m.genres ? m.genres.split(',') : [] })),
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
  });
});

// GET /api/movies/featured
router.get('/featured', (req, res) => {
  const movies = db.prepare(`
    SELECT m.id, m.title, m.release_year, m.poster, m.banner, m.imdb_rating,
           m.synopsis, p.name AS director_name,
           GROUP_CONCAT(DISTINCT g.name) AS genres
    FROM movies m
    LEFT JOIN persons p ON m.director_id = p.id
    LEFT JOIN movie_genres mg ON mg.movie_id = m.id
    LEFT JOIN genres g ON g.id = mg.genre_id
    GROUP BY m.id
    ORDER BY m.imdb_rating DESC
    LIMIT 6
  `).all();

  res.json(movies.map(m => ({ ...m, genres: m.genres ? m.genres.split(',') : [] })));
});

// GET /api/movies/:id
router.get('/:id', (req, res) => {
  const movie = db.prepare(`
    SELECT m.*, p.name AS director_name, p.id AS director_id_ref
    FROM movies m
    LEFT JOIN persons p ON m.director_id = p.id
    WHERE m.id = ?
  `).get(req.params.id);

  if (!movie) return res.status(404).json({ error: 'Movie not found' });

  const genres = db.prepare(`
    SELECT g.name FROM genres g
    JOIN movie_genres mg ON mg.genre_id = g.id
    WHERE mg.movie_id = ?
  `).all(req.params.id).map(g => g.name);

  const cast = db.prepare(`
    SELECT p.id, p.name, p.photo, mc.role, mc.role_type
    FROM movie_cast mc
    JOIN persons p ON mc.person_id = p.id
    WHERE mc.movie_id = ?
    ORDER BY mc.role_type
  `).all(req.params.id);

  res.json({ ...movie, genres, cast });
});

module.exports = router;
