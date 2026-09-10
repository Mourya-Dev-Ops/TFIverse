# TFIverse Box Office Data Engine — Production Architecture

> **Last Updated:** September 10, 2026  
> **Status:** Implementation Phase  
> **Designed for:** 5+ years of production use

---

## 1. System Overview

```
┌──────────────┐     ┌─────────────────────────────────────────────────────┐
│ cron-job.org │────▶│              GitHub Actions (Free, Public Repo)     │
│  (Hourly)    │     │                                                     │
└──────────────┘     │  ┌─────────────────────────────────────────────┐   │
                     │  │  9 BMS Shards    +    1 Paytm Runner        │   │
                     │  │  (cloudscraper)       (districtdata CDN)     │   │
                     │  └────────────────────┬────────────────────────┘   │
                     │                       ▼                            │
                     │  ┌─────────────────────────────────────────────┐   │
                     │  │  aggregate.py (Combine 9 BMS shards → 1)    │   │
                     │  └────────────────────┬────────────────────────┘   │
                     │                       ▼                            │
                     │  ┌─────────────────────────────────────────────┐   │
                     │  │  backup_to_b2.py                             │   │
                     │  │  Uploads: LATEST files + timestamped chunks   │   │
                     │  └────────────────────┬────────────────────────┘   │
                     └───────────────────────┼────────────────────────────┘
                                             ▼
                     ┌───────────────────────────────────────────────────┐
                     │              Backblaze B2 (Free 10GB)            │
                     │                                                   │
                     │  LATEST_bms_live.json          (overwritten)     │
                     │  LATEST_bms_advance.json       (overwritten)     │
                     │  LATEST_bms_deep_advance.json  (overwritten)     │
                     │  LATEST_paytm_live.json        (overwritten)     │
                     │  LATEST_paytm_advance.json     (overwritten)     │
                     │  LATEST_paytm_deep_advance.json(overwritten)     │
                     │                                                   │
                     │  chunks/YYYY-MM-DD/bms_live_YYYY-MM-DD_HHMM.json│
                     │  chunks/YYYY-MM-DD/...  (historical per hour)    │
                     │                                                   │
                     │  archives/YYYY-MM-DD/FULL_DAY_bms_live.json     │
                     │  archives/YYYY-MM-DD/... (midnight squash output)│
                     └───────────────────────┬───────────────────────────┘
                                             │
                    ┌────────────────────────┐│┌────────────────────────┐
                    │ NOW: Manual sync       │││ LATER: VPS cron        │
                    │ npx tsx scripts/       │││ runs same script       │
                    │  sync-box-office.ts    │││ every hour             │
                    └────────────┬───────────┘│└────────────┬───────────┘
                                 ▼             ▼             ▼
                     ┌───────────────────────────────────────────────────┐
                     │              PostgreSQL Database                  │
                     │  (Local now → Neon/Supabase in production)       │
                     │                                                   │
                     │  realtime_sessions     (live show-level data)    │
                     │  hourly_trending_logs  (charts over time)        │
                     │  city_booking_snapshots(advance velocity)        │
                     │  daily_box_office      (SACNilk estimates)       │
                     └───────────────────────┬───────────────────────────┘
                                             ▼
                     ┌───────────────────────────────────────────────────┐
                     │  Next.js UI on Vercel (reads from PostgreSQL)    │
                     │  /box-office           → Dashboard               │
                     │  /box-office/movie/X   → 5-Level Drill Down     │
                     └───────────────────────────────────────────────────┘
```

---

## 2. The Three Pipelines

### Pipeline 1: Hourly Scraper (24 runs/day)

| Field | Value |
|-------|-------|
| **Workflow** | `scraper_pipeline.yml` |
| **Trigger** | cron-job.org → `workflow_dispatch` POST every hour |
| **Backup Trigger** | GitHub cron `0 * * * *` (unreliable, drops runs) |
| **Runners** | 10 (1 venue discovery + 9 scraper shards) |
| **Duration** | ~12-13 minutes |
| **Cost** | $0 (public repo = unlimited GitHub Actions minutes) |

**What it scrapes:**
- **BMS Live** (Today): 9 shards scrape all ~4,000 venues in parallel
- **BMS Advance** (Tomorrow): Same 9 shards, second pass per venue
- **Paytm Live** (Today): 1 runner, fetches from districtdata2026 CDN
- **Paytm Advance** (Tomorrow): Same runner, advance endpoint

**What it produces in B2:**

| File | Type | Lifetime |
|------|------|----------|
| `LATEST_bms_live.json` | Overwritten | Always current |
| `LATEST_bms_advance.json` | Overwritten | Always current |
| `LATEST_paytm_live.json` | Overwritten | Always current |
| `LATEST_paytm_advance.json` | Overwritten | Always current |
| `chunks/2026-09-10/bms_live_2026-09-10_0800.json` | Historical | Until midnight squash |
| `chunks/2026-09-10/bms_advance_2026-09-10_0800.json` | Historical | Until midnight squash |
| `chunks/2026-09-10/paytm_live_2026-09-10_0800.json` | Historical | Until midnight squash |
| `chunks/2026-09-10/paytm_advance_2026-09-10_0800.json` | Historical | Until midnight squash |

---

### Pipeline 2: Deep Advance Scraper (8 runs/day)

| Field | Value |
|-------|-------|
| **Workflow** | `deep_advance_pipeline.yml` |
| **Trigger** | GitHub cron `30 */3 * * *` (every 3 hours at :30) |
| **What** | Days 2, 3, 4, 5 advance bookings |
| **Duration** | ~25 minutes |

**What it produces in B2:**

| File | Type |
|------|------|
| `LATEST_bms_deep_advance.json` | Overwritten every 3 hours |
| `LATEST_paytm_deep_advance.json` | Overwritten every 3 hours |
| `chunks/YYYY-MM-DD/bms_deep_advance_{timestamp}.json` | Historical |
| `chunks/YYYY-MM-DD/paytm_deep_advance_{timestamp}.json` | Historical |

**Why separate from hourly?** Fresh GitHub IPs every 3 hours prevent Cloudflare from recognizing our scraping pattern. BMS can't ban IPs that only exist for 25 minutes.

---

### Pipeline 3: Midnight Squash (1 run/day)

| Field | Value |
|-------|-------|
| **Workflow** | `midnight_squash.yml` |
| **Trigger** | GitHub cron `25 18 * * *` (11:55 PM IST) |
| **What** | Archives the day's chunks, cleans up B2 |
| **Duration** | ~2 minutes |

**What it does:**
1. Lists ALL files in `chunks/YYYY-MM-DD/` from B2
2. For each type (bms_live, bms_advance, bms_deep_advance, paytm_live, paytm_advance, paytm_deep_advance):
   - Downloads all hourly chunks
   - Deduplicates: keeps the LATEST value for each unique show (by showId)
   - Uploads merged file as `archives/YYYY-MM-DD/FULL_DAY_{type}.json`
3. Deletes the individual hourly chunks from B2 to save storage
4. LATEST files are NOT touched (they remain for the sync script)

---

## 3. The Smart Sync Script

**File:** `scripts/sync-box-office.ts`  
**Purpose:** Pull data from B2 → Insert into PostgreSQL  
**When to run:** Manually during development, or via VPS cron later

### Logic:

```
1. Check DB: SELECT MAX(last_updated) FROM realtime_sessions
   → Result: "2026-09-07 23:00:00" (last sync was Sept 7)

2. Calculate missing dates: Sept 8, Sept 9, and today (Sept 10)

3. For each COMPLETED past day (Sept 8, Sept 9):
   Try: Fetch archives/2026-09-08/FULL_DAY_bms_live.json
   If archive exists → parse and upsert into DB
   If archive missing → List chunks/2026-09-08/ from B2
                       → Download the LAST chunk of each type
                       → Parse and upsert into DB

4. For TODAY (Sept 10, incomplete):
   Fetch LATEST_bms_live.json → upsert
   Fetch LATEST_bms_advance.json → upsert
   Fetch LATEST_bms_deep_advance.json → upsert
   Fetch LATEST_paytm_live.json → upsert
   Fetch LATEST_paytm_advance.json → upsert
   Fetch LATEST_paytm_deep_advance.json → upsert

5. Deduplication: BMS takes priority over Paytm
   If same venue+movie+time exists in both → keep BMS data

6. Upsert into realtime_sessions using onConflictDoUpdate
   on (movieId, sessionId) → updates soldSeats, grossRevenue, lastUpdated

7. Generate hourly_trending_logs snapshot
8. Generate city_booking_snapshots for advance data
9. Merge SACNilk industry estimates into daily_box_office
```

### Edge Cases Handled:

| Scenario | What Happens |
|----------|-------------|
| Laptop off for 1 day | Fetches 1 archive + today's LATEST |
| Laptop off for 7 days | Fetches 7 archives + today's LATEST |
| Laptop off for 30 days | Fetches 30 archives (takes ~2 min, but works) |
| Midnight squash missed | Falls back to last chunk of the day |
| B2 has no data for a day | Logs warning, skips that day, continues |
| GitHub dropped an hourly run | That hour has no chunk. Other 23 still exist. Archive has 23 merged |
| BMS blocked a shard | 8 of 9 shards still produce data. Minor gap, not fatal |
| Duplicate shows in BMS+Paytm | Dedup engine keeps BMS, discards Paytm duplicate |
| Deep advance overlaps advance | Day ranges don't overlap (Day 1 vs Days 2-5) |
| Two syncs run close together | `onConflictDoUpdate` → last write wins. No errors |

---

## 4. B2 Storage Budget (5-Year Projection)

### Free Tier Limits:
- **Storage:** 10 GB
- **Downloads:** 1 GB/day
- **Uploads:** 2,500 API calls/day (Class B)

### Daily Storage Math:

| Stage | Files | Size | Running Total |
|-------|-------|------|---------------|
| During day: 24 hourly chunks × 6 types | 144 files | ~300 MB | 300 MB |
| After midnight squash: 6 archive files remain | 6 files | ~20 MB | 20 MB |
| Chunks deleted by midnight squash | -144 files | -300 MB | — |
| LATEST files (always present) | 6 files | ~20 MB | 40 MB |

**Per day net growth:** ~20 MB (archives only)  
**Per month:** ~600 MB  
**Per year:** ~7 GB  
**10 GB limit reached:** ~16 months

### Mitigation (before hitting 10 GB):
- Delete archives older than 12 months (we have the DB as the long-term store)
- Or upgrade B2 ($6/TB/month, extremely cheap)

### Download Budget:
- Sync script downloads: ~40 MB per sync (6 LATEST files)
- Even 24 syncs/day = 960 MB < 1 GB limit ✅
- Catch-up sync (30 missed days): ~600 MB < 1 GB limit ✅

---

## 5. Database Storage Budget

### Current: Local PostgreSQL (development)
- **Disk:** 100+ GB available
- **No limits.** Full local control.

### Production: PostgreSQL on VPS (50 GB disk)
- **Self-hosted PostgreSQL** on VPS with ~50 GB storage
- **No external service limits.** No Neon, no Supabase. Full control.

### Storage Math (50 GB VPS):
- Active movies: ~5 simultaneously
- Shows per day per movie: ~8,000 unique sessions
- Total per day: ~40,000 rows × 500 bytes = **20 MB/day**

| Duration | Raw Sessions Size | Fits in 50 GB? |
|----------|------------------|----------------|
| 30 days | ~600 MB | ✅ YES |
| 60 days | ~1.2 GB | ✅ YES |
| 1 year | ~7.3 GB | ✅ YES |
| 5 years | ~36.5 GB | ✅ YES |

**With 50 GB, we can keep ALL raw sessions for 5+ years without any cleanup!**

### Nightly Aggregation (daily_box_office, regional_box_office, chain_box_office):
- Crushes 40,000 raw sessions → ~35 aggregate rows per movie per day
- These aggregate tables grow at ~7 KB/day → **negligible forever**
- Powers historical charts, lifetime collection, movie comparisons
- Even after 5 years: aggregate tables total ~90 MB

### Optional Retention Policy (only if tracking 20+ movies simultaneously):
```sql
-- Run yearly if needed:
DELETE FROM realtime_sessions WHERE show_date < NOW() - INTERVAL '2 years';
```

---

## 6. Known Risks & Mitigations

### Risk 1: BMS Starts Aggressively Blocking Scrapers
- **Probability:** Medium (within 2-3 years)
- **Impact:** BMS data stops flowing
- **Mitigation:** We still have Paytm as a backup source. Paytm uses a CDN, not direct scraping, so it's much harder to block.
- **Long-term fix:** Residential proxy service (~$50/month) if needed

### Risk 2: districtdata2026.pages.dev Goes Down
- **Probability:** Medium (Paytm data source is third-party)
- **Impact:** Paytm data stops flowing
- **Mitigation:** BMS alone covers ~80% of Indian cinemas. Paytm is supplementary.

### Risk 3: cron-job.org Shuts Down
- **Probability:** Low (running since 2007)
- **Impact:** Hourly triggers become unreliable (fall back to GitHub cron)
- **Mitigation:** Switch to EasyCron, UptimeRobot, or VPS cron. Takes 5 minutes.

### Risk 4: GitHub Changes Actions Free Tier
- **Probability:** Low-Medium
- **Impact:** May need to pay for Actions minutes
- **Current safety:** Public repos get UNLIMITED free minutes
- **Mitigation:** The repo MUST stay public. If it goes private, costs ~$4/month.

### Risk 5: Backblaze B2 Changes Pricing
- **Probability:** Very Low
- **Impact:** Need to switch object storage
- **Mitigation:** Code uses standard S3 API. Can switch to Cloudflare R2 (10 GB free, zero egress) by changing 2 environment variables.

### Risk 6: Movie Title Mismatches
- **Probability:** High (BMS sometimes changes title formatting)
- **Impact:** Creates duplicate movie entries in DB
- **Current fix:** Auto-discovery adds new movies. `onConflictDoNothing` prevents crashes.
- **Long-term fix:** Add a movie alias table + fuzzy matching

---

## 7. What's Built ✅

### Data Engine (`tfiverse-data-engine`)

| Component | File | Status |
|-----------|------|--------|
| BMS Scraper (Live + Advance) | `src/scrapers/bms_async.py` | ✅ Built |
| BMS Scraper (Deep Advance mode) | `src/scrapers/bms_async.py` (DEEP_ADVANCE=true) | ✅ Built |
| Paytm Scraper (Live + Advance) | `src/scrapers/paytm_async.py` | ✅ Built |
| Paytm Scraper (Deep Advance mode) | `src/scrapers/paytm_async.py` (DEEP_ADVANCE=true) | ✅ Built |
| Venue Discovery | `src/scrapers/venue_discovery.py` | ✅ Built |
| Shard Combiner | `src/combiner/aggregate.py` | ✅ Built |
| B2 Backup | `src/db/backup_to_b2.py` | ✅ Built |
| Midnight Squash | `src/combiner/midnight_squash.py` | 🔧 Needs fix (missing deep advance) |
| Hourly Pipeline | `.github/workflows/scraper_pipeline.yml` | ✅ Built |
| Deep Advance Pipeline | `.github/workflows/deep_advance_pipeline.yml` | 🔧 Needs fix (Paytm runs 9x) |
| Midnight Squash Pipeline | `.github/workflows/midnight_squash.yml` | ✅ Built |

### Next.js App (`tfiverse`)

| Component | File | Status |
|-----------|------|--------|
| DB Schema (8 tables) | `src/lib/schema/tracking.ts` | ✅ Built |
| Box Office Hub Page | `src/app/(main)/box-office/page.tsx` | ✅ Built |
| Movie Drill-Down Page | `src/app/(main)/box-office/movie/[slug]/page.tsx` | ✅ Built |
| 5-Level Dashboard Component | `src/components/box-office/BoxOfficeDashboard.tsx` | ✅ Built |
| Advanced API Route | `src/app/api/movies/[slug]/box-office/advanced/route.ts` | ✅ Built |
| Hub API Layer | `src/lib/api/box-office/hub.ts` | ✅ Built |
| Sync Script | `scripts/sync-box-office.ts` | 🔧 Needs upgrade (smart catch-up) |

---

## 8. What Needs to Be Fixed 🔧

### ✅ Fix 1: `midnight_squash.py` — DONE (Pushed Sept 10)
Added `bms_deep_advance` and `paytm_deep_advance` to the master_data dictionary.

### ✅ Fix 2: `deep_advance_pipeline.yml` — DONE (Pushed Sept 10)
Moved Paytm from 9x matrix job to 1x combine-and-backup job.

### 🔧 Fix 3: `sync-box-office.ts` — Smart Catch-Up (IN PROGRESS)
Add logic to:
1. Check last sync timestamp from DB
2. Fetch B2 archives for missed days
3. Fall back to last chunk if archive missing
4. Then fetch today's LATEST files

### 🔧 Fix 4: Nightly Aggregation Script — `scripts/nightly-aggregate.ts` (NEW)
Runs at midnight to crush raw sessions into permanent daily/regional/chain aggregates.

### ⬜ Fix 5: Verify GitHub Secrets
Confirm these exist in GitHub repo settings → Secrets → Actions:
- `B2_KEY_ID`
- `B2_APPLICATION_KEY`

---

## 8.5. BFilmy Competition Analysis (14 Repos Scanned)

| BFilmy Repo | What It Does | Do We Have It? |
|---|---|---|
| `assetz` | Main scraper (BMS venues, shows) | ✅ Already built, better |
| `district_tracking` | Paytm districtdata CDN scraper | ✅ Already built |
| `PIC_Sales` | PVR/INOX/Cinepolis chain tracking | ✅ In our plan |
| `bms-hype` | Pre-release buzz ("Interested" clicks on BMS) | 🟡 Future feature |
| `bms-interest-track` | Interest spike detection over time | 🟡 Future feature |
| `bms-movies` | Movie listings from BMS | ✅ Our auto-discovery does this |
| `yearlydata` | Yearly collection + state/chain breakdown | ✅ Our aggregates do this |
| `hibo_database` | Historical box office (past years) | 🟡 Future feature |
| `stats` | Google Analytics for page views | Not needed (different thing) |
| `exch_rates` | Currency conversion for overseas | 🔒 Later (overseas phase) |
| `cineworld` | UK theaters | 🔒 Later (overseas phase) |
| `japan-bo-data` | Japan box office | 🔒 Later (overseas phase) |
| `Nepal-Boxoffice` | Nepal box office | 🔒 Later (overseas phase) |
| `vue` | Old Vue.js frontend | Not needed (we use Next.js) |

**Verdict:** Nothing critical missing for Indian box office. All core features covered.
Hype/interest tracking and historical DB are future additions after core is live.

---

## 9. What's Pending for VPS 📋

When you get a VPS ($3-5/month), set up these 4 cron jobs:

### Cron 1: Trigger Hourly Scraper
```bash
# Every hour at minute :00
0 * * * * curl -s -X POST \
  "https://api.github.com/repos/TFIverse/tfiverse-data-engine/actions/workflows/scraper_pipeline.yml/dispatches" \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer YOUR_GITHUB_PAT" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  -d '{"ref":"main"}' >> /var/log/tfiverse-trigger.log 2>&1
```

### Cron 2: Sync B2 → PostgreSQL
```bash
# Every hour at minute :20 (gives scraper 20 mins to finish)
20 * * * * cd /home/tfiverse/tfiverse && npx tsx scripts/sync-box-office.ts >> /var/log/tfiverse-sync.log 2>&1
```

### Cron 3: Trigger Deep Advance
```bash
# Every 3 hours at minute :30 (if GitHub cron is unreliable)
30 */3 * * * curl -s -X POST \
  "https://api.github.com/repos/TFIverse/tfiverse-data-engine/actions/workflows/deep_advance_pipeline.yml/dispatches" \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer YOUR_GITHUB_PAT" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  -d '{"ref":"main"}' >> /var/log/tfiverse-trigger.log 2>&1
```

### Cron 4: Trigger Midnight Squash
```bash
# Once daily at 11:55 PM IST
55 23 * * * curl -s -X POST \
  "https://api.github.com/repos/TFIverse/tfiverse-data-engine/actions/workflows/midnight_squash.yml/dispatches" \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer YOUR_GITHUB_PAT" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  -d '{"ref":"main"}' >> /var/log/tfiverse-trigger.log 2>&1
```

### VPS Specs:
- **OS:** Ubuntu 22.04+
- **RAM:** 2 GB+
- **Storage:** 50 GB (PostgreSQL self-hosted)
- **PostgreSQL:** Self-hosted with Drizzle ORM (same as local dev)
- **Node.js:** 20+ with npm and tsx
- **Clone:** The `tfiverse` repo (for sync script + Next.js app)
- **Configure:** `.env.local` with `DATABASE_URL=postgresql://user:pass@localhost:5432/tfiverse`

### VPS Storage Breakdown:
| Component | Size | Notes |
|-----------|------|-------|
| PostgreSQL (raw sessions, 5 years) | ~36.5 GB | ALL raw data kept |
| PostgreSQL (aggregates, 5 years) | ~90 MB | Daily/regional/chain |
| Node.js + Dependencies | ~500 MB | |
| OS + System | ~5 GB | |
| **Total** | **~42 GB** | **Fits in 50 GB ✅** |

---

## 10. Production Deployment Checklist

### Phase 1: Data Pipeline (Current)
- [x] Fix midnight_squash.py (add deep advance) — ✅ Done Sept 10
- [x] Fix deep_advance_pipeline.yml (Paytm 1x not 9x) — ✅ Done Sept 10
- [ ] Verify B2 secrets in GitHub repo settings
- [ ] Upgrade sync-box-office.ts (smart catch-up from B2)
- [ ] Build nightly-aggregate.ts script
- [ ] Set up cron-job.org (hourly trigger)
- [ ] Manually trigger scraper pipeline to populate B2
- [ ] Run sync script to populate local DB
- [ ] Verify data appears at localhost:3000/box-office

### Phase 2: UI Features (Next)
- [ ] State-wise / City-wise drill-down tables
- [ ] Chain-wise breakdown (PVR/INOX/Cinepolis/PIC Total)
- [ ] Territory-wise breakdown (Nizam/Ceded/UA etc.)
- [ ] Hourly trending chart
- [ ] Time slot heatmap
- [ ] ATP distribution
- [ ] Format-wise breakdown
- [ ] Venue-wise table
- [ ] All shows detail table
- [ ] Advance booking tab (5 days)
- [ ] Past movie lifetime page
- [ ] Day-by-day collection chart
- [ ] Movie comparison overlay
- [ ] Verdict badge (Hit/Flop)

### Phase 3: VPS Deployment
- [ ] Buy VPS (Hetzner/Oracle)
- [ ] Install PostgreSQL + Node.js
- [ ] Clone tfiverse repo
- [ ] Set up 4 cron jobs + nightly aggregation
- [ ] Deploy Next.js (self-hosted or Vercel pointing to VPS DB)
- [ ] Verify automated 24/7 sync

### Phase 4: Future Features
- [ ] BMS Hype/Interest tracking (pre-release buzz)
- [ ] Historical box office database (import past years)
- [ ] Overseas box office (UK, Japan, Nepal, Australia)
- [ ] Exchange rate conversion for overseas collections
