# 🚀 TFIverse — Project Vision & Roadmap

## 🎯 The Ultimate Vision
TFIverse is the **definitive digital ecosystem for the Telugu Film Industry (Tollywood)**. It acts as the single source of truth for movies, box office, celebrity tracking, and highly engaging fan-driven community interactions. It blends the data accuracy of IMDb/TMDB, the user review structure of Letterboxd, and the community obsession of X/Reddit—all wrapped in a premium, startup-grade user interface.

---

## 🏗️ Production Architecture (LOCKED)

```
ONE VPS (₹500–800/mo)
├── Nginx          → reverse proxy + TLS + gzip/brotli + cache headers
├── Next.js 16     → production build, managed by PM2 (cluster mode)
├── PostgreSQL 16  → primary DB (localhost only, never public)
├── PgBouncer      → connection pooling (transaction mode)
├── Certbot/CF     → TLS (Cloudflare Origin Certificate)
├── UFW            → firewall (deny-all + allow 22/80/443)
├── Fail2ban       → SSH brute-force protection
├── Cron           → daily DB backups → Backblaze B2
└── Node 20 LTS

External Services:
├── Cloudflare     → DNS + CDN + DDoS + WAF (FREE)
├── AWS SES        → transactional email (~₹83/mo)
├── Backblaze B2   → media storage (~₹100-300/mo)
└── GitHub Actions → CI/CD auto-deploy (FREE)

Domain: tfiverse.com
Monthly Cost: ~₹650-1200
```

---

## ✅ PHASE 1: FOUNDATION (100% COMPLETE)

1. **The Icons Hub (People Pages)** ✅
   - 19 categories, 28 subcategories, 28 JSON data files
   - Universal profile rendering engine handles all tiers
   - Heroes, Heroines, Directors, Music Directors, Villains, Comedians + 13 crew categories

2. **User Profiles (The Bento Box)** ✅
   - Apple-style premium Bento grid layouts
   - Follow system, privacy controls, badges, social links
   - Public profiles at `/u/username`

3. **Auth System** ✅
   - Email + Password, Google OAuth, Forgot/Reset Password
   - Rate limiting, middleware route protection, JWT sessions
   - Secrets secured in `.env.local`

4. **Memes Portal** ✅
   - Upload, like, comment, share, bookmark, report, download tracking
   - Presigned URL uploads to Backblaze B2

5. **Tier List System** ✅
   - Drag-and-drop S/A/B/C/D/F ranking via TMDB data
   - Community feed with likes and comments

---

## ⏳ PHASE 2: CORE MOVIE ENGINE (UP NEXT)

6. **Browse Movies & Movie Details Hub**
   - TMDB data sync script for Telugu films
   - Movie grid with year/genre/rating filters
   - Full movie pages: poster, trailer, cast, crew, OTT links, reviews

7. **The Movie Diary (Letterboxd Clone)**
   - Mark as Watched / Add to Watchlist buttons
   - Write reviews with ratings
   - Movie diary section on user profile Bento

8. **Rate Year / Month Generator**
   - Viral PNG export — pick a month, rate your movies, share on Instagram/X

---

## 📈 PHASE 3: INDUSTRY INTELLIGENCE & TRACKING

9. **Box Office & Re-Release Tracking**
   - Automated scrapers for BMS interest, district tracking
   - Hit/Flop/Blockbuster verdicts

10. **OTT Discovery Engine**
    - "New on OTT", "Upcoming", Shuffle Mode (mood-based suggestions)

11. **Rumors & Trade Talk**
    - Editorial/blog format for industry speculation and deals

12. **Latest Updates & Upcoming Movies**
    - Trailers, release dates, launch announcements

---

## 🌐 PHASE 4: COMMUNITY DOMINANCE

13. **Fan Zone (The TFI Twitter)**
    - Threaded discussions, @tag movies/celebrities, spoiler protection

14. **Fan Gallery**
    - FDFS celebration photos, fan-edits, artwork uploads

---

## 🛡️ PHASE 5: MODERATION & CROWDSOURCING

15. **Contributors System**
    - GitHub-style "Suggest an Edit" with contribution points and badges

16. **Admin & Moderation Dashboard**
    - Diff view for edit approval, banning, content moderation
    - Basic version needed BEFORE launch for meme moderation

---

## 🔮 FUTURE / MOONSHOT FEATURES
- **TFIverse Verdict Algorithm**: TMDB + User ratings + Box Office = TFI Score out of 100%
- **Watch Party System**: Discord-integrated weekly sync watches
- **Mobile App**: React Native (post-launch)

---
*Document maintained by Antigravity (Lead Developer & Mentor) & TFIverse Owner.*
