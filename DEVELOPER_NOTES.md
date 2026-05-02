# 🎬 TFIverse - Developer Architecture Notes
**Date:** May 2026
**Status:** Phase 0 (Bug Fixes & Pipeline Hardening) Completed. Ready for Phase 1 (Universal Profile UI).

## 🧠 The "Spiderweb" Architecture
TFIverse operates on a highly normalized, relational database model. We do **NOT** store duplicate data.
- **Rule 1:** Movies are never stored inside a person's JSON file.
- **Rule 2:** People JSONs contain only biography, personal stats, lifestyle, and *personal* awards.
- **Rule 3:** All movie data (posters, release dates, movie-level awards) lives in the `movies` table.
- **Rule 4:** People and Movies are linked via the `movie_credits` bridge table. 

This means updating a movie poster once updates it on every actor and director's page instantly.

---

## 🔧 The 4-Script Data Pipeline

### 1. TMDB Movie Fetcher (`old_legacy/scripts/fetch_movies_data.py`)
- **Purpose:** Downloads bulk movie data (5,500+ Telugu movies) from the TMDB API.
- **Usage:** Used initially to seed the database with core filmographies.

### 2. AI Person Generator (Perplexity Workflow)
- **Purpose:** We run `fetch_filmography.py` to get an actor's accurate TMDB filmography, then feed it to an AI (Perplexity) using our 28-category templates (e.g., `scripts/prompts/02-superstars-prompt.md`).
- **Output:** A rich JSON file containing the actor's bio, cars, aura, etc. (e.g., `public/data/heroes/superstars/prabhas.json`).

### 3. Database Migration & Deduplication
- **Scripts:** `import-movies.ts` (bulk movie import) & `migration-engine.ts` (person JSON import).
- **How it works:** When movies are imported, "stubs" (placeholders) are created for actors in the `people` table. When `migration-engine.ts` runs, it uses `ON CONFLICT DO UPDATE` to overwrite the stub with the rich JSON data, preventing duplicates.

### 4. OTT Streaming Links (`old_legacy/scripts/fetch-ott-links-justwatch.py`)
- **Purpose:** Scrapes JustWatch for direct streaming URLs (Netflix, Prime, Aha) bypassing TMDB redirects.
- **Output:** Populates the `movie_ott_links` table with 4K/HD streaming links.

---

## 🚀 The Execution Roadmap (What's Next)

### Phase 1: Universal Profile Page (Current Focus)
- We are building ONE `IconProfileClient.tsx` that handles ALL 28 categories.
- Instead of 28 different pages, the component uses `if (data.heroAura)` to conditionally render sections.
- Different categories get different theme colors (e.g., Heroes = dark/gritty, Heroines = elegant/rose), but share the same bulletproof code.

### Phase 2: Movie Database Sync
- We will fetch and import movies based on the people we are adding, using the TMDB fetchers.

### Phase 3: Automated Cron Jobs
- We will set up automated scripts to check for new movie announcements daily, and new OTT link drops (using a `--recent` flag so we don't scan all 6,000 movies).

### Phase 4: Wikipedia-Style Contributions
- A UI where fans can submit missing awards or OTT links, which go to an Admin Dashboard for approval.

---

## 🛠️ Recent Bug Fixes Applied
1. **Next.js 15 Params:** Added `await params` in `[slug]/page.tsx` to prevent Turbopack crash.
2. **Category URLs:** Fixed `[category]/page.tsx` to link to plural routes consistently.
3. **Promotion Safety:** Added slug-first lookup in `[slug]/page.tsx` so if a "rising-star" becomes a "superstar", their old URL auto-redirects instead of hitting a 404.
4. **PostgreSQL JSONB Optimization:** Category listing page now uses `sql\`${people.metadata}->'images'\`` to fetch 1MB of data instead of 75MB.
