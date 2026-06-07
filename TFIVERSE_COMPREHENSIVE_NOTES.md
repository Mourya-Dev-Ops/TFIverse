# 🚀 TFIverse - Comprehensive Project Notes & Master Guide
**Generated:** 2026-06-06
**Status:** Pre-Reinstall Backup & Consolidation

This document contains everything about the TFIverse project up to this exact moment. It combines all developer notes, roadmap items, tech stack details, and our recent deep dive into the Box Office & `bfilmy` tracking integration.

---

## 🏗️ 1. Technology Stack
- **Framework:** Next.js 15 (App Router) + Turbopack
- **Database:** PostgreSQL 16 (Local) managed via **Drizzle ORM**
- **Authentication:** Auth.js (NextAuth v5) - Google OAuth & Credentials (Email/Password)
- **Storage:** Backblaze B2 (S3-compatible) with pre-signed URLs for direct secure uploads
- **Styling:** Tailwind CSS + Framer Motion (Glassmorphism & premium UI)
- **Hosting Target:** Single VPS with Nginx, PM2, UFW, Certbot
- **Data Integrations:** TMDB API, Custom Scrapers (BMS, Paytm/District)

---

## ✅ 2. What We Have Done (Completed Milestones)

### Phase 1: Foundation & Migrations
- **Database Migration:** Successfully migrated all static JSON data (`heroes.json`, `memes.json`, `rumors.json`, `upcoming.json`) to PostgreSQL. Used `ON CONFLICT DO UPDATE` for idempotent upserts. Handled UUID mapping and relational integrity.
- **The Icons Hub:** Universal rendering engine for all 19 celebrity categories (Heroes, Heroines, Directors, etc.).
- **User Profiles (The Bento Box):** Premium Apple-style bento grid profiles at `/u/[username]` with follow/unfollow and privacy controls.
- **Security & Auth:** 
  - Google Login, Email/Password, Forgot/Reset password flows.
  - **Mandatory Onboarding:** Edge-safe middleware intercepts users with missing Date of Birth (`hasDOB: false`) and redirects them to onboarding.
  - **Rate Limiting:** Custom in-memory rate limiting for auth routes.
- **Memes Portal:** Upload, like, comment, share, bookmark, report features. Strict composite unique DB constraints to prevent duplicate engagements.
- **Tier List System:** Drag-and-drop S/A/B/C/D/F ranking using TMDB data.

### Phase 2: Box Office Infrastructure (Back-end)
- **Bfilmy Integration:** Analyzed the 31 repos from `bfilmy`. Discovered a massive scraping architecture targeting BookMyShow, Paytm (District), Sacnilk, Cineworld, and Vue.
- **Step 1 - Historical Data Import:** Built `import-bfilmy.ts` to ingest the last 3 days of detailed sessions and monthly hourly logs from the raw JSON files into PostgreSQL (`realtime_sessions` and `hourly_trending_logs`).
- **Step 2 - Live Box Office Tracker Engine:** Built `box-office-tracker.ts`. This script polls BMS mobile APIs (using Android user-agents and rotating IPs) and District APIs (via a Cloudflare worker `districtvenues.text2026mail.workers.dev`) to get real-time showtimes, seat availability, and gross revenue. It maps everything automatically via TMDB.
- **Step 3 - GitHub Auto-Sync:** Built `sync-bfilmy-github.ts` to pull the latest daily data and hourly logs directly from the `unknownman2024/assetz` raw GitHub URL, keeping our DB up-to-date automatically.

---

## 🛑 3. Where We Left Off (The Pending "Step 3" of Box Office)
We successfully built the back-end engines for Box Office Tracking (scraping, mapping, and database storage). **We stopped at Step 3**, which involves:
1. **Frontend Integration:** Building the UI to display this Box Office data. We need to create the dashboard that shows the Hit/Flop verdicts, hourly velocity charts, and district-wise breakdowns using the data we are now collecting.
2. **Cron Job Orchestration:** Setting up the actual server cron jobs (or Vercel cron) to run `box-office-tracker.ts` and `sync-bfilmy-github.ts` on a schedule.

---

## 📋 4. Pending Features & Release To-Do List

### Core Movie Engine (Next Up)
- [ ] **TMDB Mass Sync:** Ingest 6000+ Telugu films from TMDB and sync credits to link movies with our "Icons" database.
- [ ] **OTT Discovery Engine:** Integrate JustWatch logic to show real-time "Where to Watch" links.
- [ ] **The Movie Diary:** Letterboxd-style "Mark as Watched", "Watchlist", and write user reviews.

### Box Office (Completing the Loop)
- [ ] **Box Office Dashboard UI:** Visualize the `realtime_sessions` and `hourly_trending_logs`.
- [ ] **Automated Verdicts:** Algorithm to calculate Hit/Flop/Blockbuster based on gross vs budget.
- [ ] **Cron Deployment:** Hook the tracking scripts up to the server crontab.

### Community & Growth
- [ ] **"Suggest an Edit" Moderation:** GitHub-style edits for movie data, with an Admin approval dashboard.
- [ ] **Fan Zone:** Twitter-style threaded discussions and @tagging.
- [ ] **Rate Year/Month Generator:** Viral PNG export for users to share their movie ratings on social media.

---

## 📂 5. Notes on Bfilmy 31 Repos & Scripts
The `bfilmy-repos` folder contained an absolute goldmine of data scraping tools:
- **Tracking Repos:** `Trackbo`, `predictbo`, `district_tracking`, `bms-hype`, `bms-interest-track`.
- **APIs & Proxies:** The setup utilizes Cloudflare workers to bypass Paytm/District bot protections, and Android Dalvik user-agents to hit BookMyShow mobile endpoints.
- **Data Pipeline:** We condensed the scattered 31 repos into 3 highly efficient TypeScript files (`box-office-tracker.ts`, `import-bfilmy.ts`, `sync-bfilmy-github.ts`) that plug directly into our Drizzle Postgres database, eliminating the need for scattered JSON files.

*(Note: The raw `bfilmy-repos` folder was heavily bloating the Next.js file watcher and IDE memory. It is being completely removed for the fresh install. The logic has already been extracted.)*
