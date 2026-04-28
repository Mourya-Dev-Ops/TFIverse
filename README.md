# TFIverse
Telugu Film Industry Database Platform 

## Overview

TFIverse is a full-stack web application that serves as a comprehensive database for the Telugu Film Industry (Tollywood). Browse movies, explore actors and directors, search by genre or year, and discover the rich legacy of Telugu cinema.

## Features

- 🎬 **Movie Database** – 20+ Telugu films with ratings, box office, synopsis, cast & crew
- 👤 **People Directory** – Actors, actresses, directors with bios and filmographies
- 🔍 **Search & Filter** – Search movies by title, filter by genre and year
- ⭐ **Ratings** – IMDb-style ratings for all movies
- 📱 **Responsive UI** – Works on mobile, tablet, and desktop

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18 + Vite + Tailwind CSS + React Router |
| Backend | Node.js + Express |
| Database | SQLite (via `better-sqlite3`) |

## Quick Start

### Prerequisites
- Node.js 18+
- npm 9+

### Setup

```bash
# Install dependencies
cd backend && npm install
cd ../frontend && npm install

# Seed the database
cd backend && npm run seed

# Build the frontend
cd ../frontend && npm run build

# Start the server (serves both API and frontend)
cd ../backend && npm start
```

Then open http://localhost:5000 in your browser.

### Development Mode

Run the backend and frontend separately with hot-reload:

```bash
# Terminal 1 – Backend API
cd backend && npm run dev

# Terminal 2 – Frontend (with proxy to backend)
cd frontend && npm run dev
```

Frontend dev server: http://localhost:3000  
Backend API: http://localhost:5000

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/movies` | List movies (supports `q`, `genre`, `year`, `page`, `limit`) |
| GET | `/api/movies/featured` | Top-rated movies for homepage |
| GET | `/api/movies/:id` | Movie detail with cast & genres |
| GET | `/api/persons` | List people (supports `q`, `role`, `page`, `limit`) |
| GET | `/api/persons/:id` | Person detail with filmography |
| GET | `/api/genres` | All genres with movie counts |

## Project Structure

```
TFIverse/
├── backend/
│   ├── src/
│   │   ├── app.js          # Express server entry point
│   │   ├── db/
│   │   │   ├── schema.js   # SQLite schema & connection
│   │   │   └── seed.js     # Database seeder (20 movies, 18 people)
│   │   └── routes/
│   │       ├── movies.js   # Movie endpoints
│   │       ├── persons.js  # Person endpoints
│   │       └── genres.js   # Genre endpoints
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx         # Root component + routing
│   │   ├── api.js          # API client helper
│   │   ├── components/     # Reusable UI components
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── MovieCard.jsx
│   │   │   ├── PersonCard.jsx
│   │   │   ├── Pagination.jsx
│   │   │   └── Spinner.jsx
│   │   └── pages/
│   │       ├── Home.jsx        # Hero + featured movies + genres
│   │       ├── Movies.jsx      # Movie listing with search/filter
│   │       ├── MovieDetail.jsx # Full movie page
│   │       ├── Persons.jsx     # People listing
│   │       └── PersonDetail.jsx # Person profile + filmography
│   └── package.json
└── package.json            # Root scripts
```

## Notable Films in the Database

| Film | Year | Rating |
|------|------|--------|
| Jersey | 2019 | 8.6 |
| Eega | 2012 | 8.3 |
| Baahubali 2: The Conclusion | 2017 | 8.2 |
| Arjun Reddy | 2017 | 8.1 |
| Rangasthalam | 2018 | 8.1 |
| Athadu | 2005 | 8.1 |
| Baahubali: The Beginning | 2015 | 8.0 |
| Magadheera | 2009 | 8.0 |
| Uppena | 2021 | 8.0 |
| RRR | 2022 | 7.8 |
