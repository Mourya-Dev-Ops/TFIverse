# 🎬 TFIverse: Project Handover Manifest (V2 - Final)

This document serves as the complete state-of-the-union for the TFIverse project as we migrate from Windows to Zorin OS (Linux). 

---

## 🌟 1. The Vision
To build the most premium, cinematic, and community-active database for the Telugu Film Industry (TFI). This isn't just an IMDb clone; it's an "Awwwards-grade" experience that combines high-fidelity TMDB data with fan-driven content (Memes, Awards, Reviews).

---

## 🛠 2. Tech Stack & Service Integration
*   **Next.js 15 (App Router) + Drizzle ORM**: The core engine.
*   **PostgreSQL (Docker)**: The source of truth for all data.
*   **Backblaze B2**: Primary storage for Memes, Avatars, and High-res banners.
*   **Zoho Mail**: Transactional emails (verification/OTP) via SMTP from `admin@tfiverse.com`.
*   **AWS SES**: High-volume fallback for email scaling.
*   **Cloudinary**: Real-time image optimization and transformations.
*   **NextAuth.js (Auth.js v5)**: Secure Google and Email-based logins.

---

## 📊 3. Data Status & Targets
### TMDB Movie Data
*   **Current**: ~3,500+ Telugu movies fully ingested in `data/movies-json`.
*   **Target**: ~6,000 titles (The complete history of Tollywood).
*   **Status**: We need to run the next batch fetch for older titles (pre-1990s).

### OTT Links (JustWatch)
*   **Current**: We have basic TMDB links for most.
*   **Upgrade Status**: We left off mid-batch on the `fetch-ott-links-justwatch.py` script. 
*   **Pending**: ~3,100 movies still need their deep-links scraped and verified to enable the "App Icon" UI feature.

---

## 🧠 4. The "Star" Movie Edit Problem
**The Permanent Solution:**
1.  **TMDB First**: TMDB is the base record.
2.  **Community Drafts**: User edits are stored separately as Drafts.
3.  **Merge Engine**: Admin merges user entries into official TMDB records to prevent duplicates.
4.  **UI Logic**: Detail page checks approved community edits first (e.g., Box Office numbers) before falling back to TMDB.
5.  **Points**: Users earn **+50 points** for approved edits.

---

## 🏗 5. The "Cooked" UI (Where We Left Off)
*   **Cinematic Header**: Edge-to-edge layout, metallic gradient title text.
*   **Action Bar**: Glassmorphic capsule for Watched/Rate/Review.
*   **Branded OTT**: Custom icons (Netflix 'N', Prime 'P', Aha) instead of buttons.
*   **Cast Cards**: 2:3 cinematic ratio with hover-zoom and bottom-fade gradients.
*   **The Hub**: Massive gradient cards for Reviews, Awards, and Memes.

---

## ⏰ 6. The Cron Job Schedule
We have planned these for off-peak hours (India Time). On Zorin OS, these will go in your `crontab` or GitHub Actions.

| Job Name | Frequency | Time (IST) | Time (UTC) | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| `sync-tmdb-new` | Daily | 3:30 AM | 10:00 PM | Fetch new Telugu titles added to TMDB. |
| `refresh-ott-links` | Weekly | Sun 4:30 AM | Sat 11:00 PM | Update streaming deep-links. |
| `box-office-tracker`| 4x Daily | 6-hr intervals | Every 6 hrs | Update revenue/interest for active films. |
| `trending-engine` | Hourly | Every Hour | Every Hour | Re-calculate "Hot" movies list. |

**Cron Expressions:**
*   `0 22 * * *` (TMDB Sync)
*   `0 23 * * 6` (Weekly OTT)
*   `0 */6 * * *` (Revenue Tracking)

---

## 📋 Minor Details to Remember
*   **Selection Color**: Custom `selection:bg-amber-500` added for that TFI brand feel.
*   **INR Formatting**: USD converted to `₹ Cr` automatically in the sidebar.
*   **Icon Fixes**: Using `Camera` (Insta) and `MessageCircle` (Twitter) for build compatibility.
*   **Backup**: A 72MB `db_backup.sql` was zipped to `db_backup.zip` (9MB) for easy transfer to Zorin.
