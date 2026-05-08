# 🚀 TFIverse — The Master Plan

This is the **Definitive Source of Truth** for the TFIverse project. It combines the vision, the technical architecture, the progress report, and the roadmap into one unified document.

---

## 🎯 1. The Ultimate Vision
TFIverse is the **definitive digital ecosystem for the Telugu Film Industry (Tollywood)**. It acts as the single source of truth for movies, box office, celebrity tracking, and highly engaging fan-driven community interactions. 
- **IMDb/TMDB Accuracy** + **Letterboxd Structure** + **Reddit/X Community Energy**.
- **Aesthetic Goal**: Premium, startup-grade, "Apple-style" minimalist design.

---

## 🏗️ 2. Production Architecture (Hardened)

### The Stack
- **Core**: Next.js 15 (App Router) + Turbopack for lightning-fast dev.
- **Database**: PostgreSQL 16 managed via **Drizzle ORM**.
- **Auth**: Auth.js (NextAuth v5) with Google OAuth + Email/Password + Rate Limiting.
- **Storage**: Backblaze B2 (S3-compatible) with pre-signed URL uploads.
- **Hosting**: Single VPS (PM2, Nginx, UFW, Fail2ban) for maximum performance and cost-efficiency.

### Key Technical Patterns
- **Universal Rendering**: One engine to handle all 19 celebrity categories.
- **Edge-Safe Auth**: NextAuth config is split into `auth.ts` (DB-aware) and `auth.config.ts` (Edge-compatible) to support Middleware.
- **Idempotent Ingestion**: All sync scripts (TMDB, JSON) use `ON CONFLICT DO UPDATE` to prevent data duplication.

---

## ✅ 3. Completion Report (What's Already Built)

### **Phase 1: The Foundation**
- **The Icons Hub (People Pages)**: Completed all 19 categories (Heroes, Directors, Crew, etc.) with a universal rendering engine.
- **User Profiles (The Bento Box)**: Premium Apple-style bento grid profiles at `/u/[username]` with follow/unfollow and privacy controls.
- **Security & Auth**: Google Login, Email/Pass, Forgot/Reset password, and secure onboarding (mandatory DOB).
- **Memes Portal**: Hardened upload pipeline to B2 with atomic engagement tracking (likes/views) at the DB level.
- **Tier List System**: Drag-and-drop ranking system integrated with TMDB data.

### **Optimizations Done**
- **NextAuth BasePath**: Fixed `NEXTAUTH_URL` issues to ensure session JSON is correctly parsed.
- **Database Migration**: Successfully moved legacy JSON data into Postgres with strict UUID and foreign key integrity.
- **Responsive Design**: All core screens are optimized for both Cinematic Desktop (video backgrounds) and Native-like Mobile (glassmorphism fallbacks).

---

## ⏳ 4. The Roadmap (The Big Three Features)

### **Phase 2: The Core Movie Engine (Next Up)**
1.  **TMDB Mass Sync**: Ingest 6000+ Telugu films from TMDB. Sync credits to link movies with our "Icons" database.
2.  **OTT Discovery**: Integrate JustWatch/OTT Play logic to show real-time "Where to Watch" links (Netflix, Prime, etc.).
3.  **Movie Diary**: Letterboxd-style "Mark as Watched", "Watchlist", and user reviews.

### **Phase 3: Industry Intelligence & Tracking**
1.  **BMS Interest Tracking**: Automated daily snapshots of "Interested" counts for upcoming movies.
2.  **Box Office Module**: Real-time tracking of collections, including **Regional/District-wise** breakdowns (Nizam, Ceeded, etc.).
3.  **Verdicts**: Automated Hit/Flop/Blockbuster status based on collection vs. budget.

### **Phase 4: Community & Crowdsourcing**
1.  **"Suggest an Edit" (GitHub for Movies)**: Users suggest data changes.
2.  **Moderation System**: Suggestions go to a `drafts` state. Admins approve/reject via a dedicated dashboard.
3.  **Fan Zone**: Threaded discussions and @tagging for movies and celebrities.

---

## 🛠️ 5. Developer Rules of Engagement
- **Aesthetics First**: Every component must "wow" the user. Use sleek dark modes, vibrant curated colors, and micro-animations.
- **No Placeholders**: Never use generic icons or text. Always generate high-quality assets or use real TMDB data.
- **Performance**: Keep `LCP` low. Use `loading="lazy"` for assets and `npx shadcn-ui` components as base but custom-style them to be "premium".
- **Database Safety**: Never run a destructive DB operation without a backup plan. Always update the `MIGRATION_REPORT.md` for major schema changes.

---
*Document maintained by Antigravity (Lead Developer) & TFIverse Owner.*
