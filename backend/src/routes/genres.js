const db = require('../db/schema');
const express = require('express');
const router = express.Router();

// GET /api/genres
router.get('/', (req, res) => {
  const genres = db.prepare(`
    SELECT g.id, g.name, COUNT(DISTINCT mg.movie_id) AS movie_count
    FROM genres g
    LEFT JOIN movie_genres mg ON mg.genre_id = g.id
    GROUP BY g.id
    ORDER BY movie_count DESC
  `).all();
  res.json(genres);
});

module.exports = router;
