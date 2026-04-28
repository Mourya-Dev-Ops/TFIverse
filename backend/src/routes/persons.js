const db = require('../db/schema');
const express = require('express');
const router = express.Router();

// GET /api/persons
router.get('/', (req, res) => {
  const { q, role, page = 1, limit = 12 } = req.query;
  const offset = (Number(page) - 1) * Number(limit);

  let whereClauses = [];
  let params = [];

  if (q) {
    whereClauses.push('p.name LIKE ?');
    params.push(`%${q}%`);
  }
  if (role) {
    whereClauses.push('EXISTS (SELECT 1 FROM movie_cast mc WHERE mc.person_id=p.id AND mc.role_type=?)');
    params.push(role);
  }

  const where = whereClauses.length ? 'WHERE ' + whereClauses.join(' AND ') : '';

  const total = db.prepare(`SELECT COUNT(*) as c FROM persons p ${where}`).get(...params).c;

  const persons = db.prepare(`
    SELECT p.id, p.name, p.born, p.photo,
           COUNT(DISTINCT mc.movie_id) AS movie_count,
           GROUP_CONCAT(DISTINCT mc.role_type) AS role_types
    FROM persons p
    LEFT JOIN movie_cast mc ON mc.person_id = p.id
    ${where}
    GROUP BY p.id
    ORDER BY movie_count DESC, p.name ASC
    LIMIT ? OFFSET ?
  `).all(...params, Number(limit), offset);

  res.json({
    persons: persons.map(p => ({ ...p, role_types: p.role_types ? p.role_types.split(',') : [] })),
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
  });
});

// GET /api/persons/:id
router.get('/:id', (req, res) => {
  const person = db.prepare('SELECT * FROM persons WHERE id = ?').get(req.params.id);
  if (!person) return res.status(404).json({ error: 'Person not found' });

  const filmography = db.prepare(`
    SELECT m.id, m.title, m.release_year, m.poster, m.imdb_rating,
           mc.role, mc.role_type
    FROM movie_cast mc
    JOIN movies m ON mc.movie_id = m.id
    WHERE mc.person_id = ?
    ORDER BY m.release_year DESC
  `).all(req.params.id);

  // Also check if they are a director
  const directedMovies = db.prepare(`
    SELECT m.id, m.title, m.release_year, m.poster, m.imdb_rating
    FROM movies m
    WHERE m.director_id = ?
    ORDER BY m.release_year DESC
  `).all(req.params.id);

  res.json({ ...person, filmography, directedMovies });
});

module.exports = router;
