require('dotenv').config();
require('./db/schema'); // ensure DB + tables exist

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const moviesRouter = require('./routes/movies');
const personsRouter = require('./routes/persons');
const genresRouter = require('./routes/genres');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/movies', moviesRouter);
app.use('/api/persons', personsRouter);
app.use('/api/genres', genresRouter);

// Health check
app.get('/api/health', (_req, res) => res.json({ status: 'ok', service: 'TFIverse API' }));

// Serve built frontend if it exists
const frontendDist = path.join(__dirname, '../../frontend/dist');
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
} else {
  // API 404
  app.use((_req, res) => res.status(404).json({ error: 'Not found' }));
}

app.listen(PORT, () => {
  console.log(`🎬 TFIverse API running at http://localhost:${PORT}`);
  if (fs.existsSync(frontendDist)) {
    console.log(`🌐 Frontend served at http://localhost:${PORT}`);
  }
});

module.exports = app;
