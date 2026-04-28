const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, '../../data/tfiverse.db');

// Ensure data directory exists
const dataDir = path.join(__dirname, '../../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(DB_PATH);

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS genres (
    id   INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
  );

  CREATE TABLE IF NOT EXISTS persons (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT NOT NULL,
    born        TEXT,
    birth_place TEXT,
    bio         TEXT,
    photo       TEXT,
    created_at  TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS movies (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    title        TEXT NOT NULL,
    release_year INTEGER,
    duration_min INTEGER,
    language     TEXT DEFAULT 'Telugu',
    synopsis     TEXT,
    poster       TEXT,
    banner       TEXT,
    imdb_rating  REAL,
    box_office   TEXT,
    director_id  INTEGER REFERENCES persons(id),
    created_at   TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS movie_genres (
    movie_id  INTEGER REFERENCES movies(id) ON DELETE CASCADE,
    genre_id  INTEGER REFERENCES genres(id) ON DELETE CASCADE,
    PRIMARY KEY (movie_id, genre_id)
  );

  CREATE TABLE IF NOT EXISTS movie_cast (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    movie_id   INTEGER REFERENCES movies(id) ON DELETE CASCADE,
    person_id  INTEGER REFERENCES persons(id) ON DELETE CASCADE,
    role       TEXT,
    role_type  TEXT CHECK(role_type IN ('actor','actress','director','producer','music','writer')) DEFAULT 'actor'
  );
`);

module.exports = db;
