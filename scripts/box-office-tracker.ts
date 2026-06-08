import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

import { db } from '../src/lib/db';
import { movies } from '../src/lib/schema/content';
import { realtimeSessions, hourlyTrendingLogs } from '../src/lib/schema/tracking';
import { eq, or, sql } from 'drizzle-orm';
import * as fs from 'fs';
import * as crypto from 'crypto';

// ══════════════════════════════════════════════════════════
// CONFIGURATION
// ══════════════════════════════════════════════════════════
const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const WORKER_UA = process.env.WORKER_UA;
const WORKER_KEY = process.env.WORKER_KEY;

// Track a specific movie only (for testing). Set TRACK_MOVIE_ID=2967 for Peddi.
const TRACK_MOVIE_ID = process.env.TRACK_MOVIE_ID ? parseInt(process.env.TRACK_MOVIE_ID) : null;
// Track ALL venues (production mode). Default is false (limited venues for dev).
const TRACK_ALL = process.env.TRACK_ALL_VENUES === 'true';
// Enable continuous loop mode with jitter (production). Default is single-run.
const LOOP_MODE = process.env.LOOP_MODE === 'true';
// Base interval in minutes for loop mode
const BASE_INTERVAL_MIN = 10;
// Jitter range in minutes (±)
const JITTER_RANGE_MIN = 2;
// Max consecutive failures before auto-pause
const MAX_CONSECUTIVE_FAILURES = 10;
// Raw JSON backup directory
const RAW_DUMP_DIR = process.env.RAW_DUMP_DIR || path.resolve(__dirname, '../data/raw_dumps');

// Cache to prevent duplicate DB and TMDB calls
const movieCache: Record<string, number> = {};
// Reverse cache: movieId -> cleaned title (for filtering)
const movieIdToTitle: Record<number, string> = {};

// Failure tracking for auto-backoff
let consecutiveBmsFailures = 0;
let consecutiveDistrictFailures = 0;
let isPaused = false;

// ══════════════════════════════════════════════════════════
// MOBILE DEVICE SPOOFING
// ══════════════════════════════════════════════════════════
const MOBILE_DEVICES = [
  {
    ua: 'Dalvik/2.1.0 (Linux; U; Android 11; SM-G998B Build/RP1A.200720.012)',
    appVersion: '13.4.5',
    platform: 'Android'
  },
  {
    ua: 'Dalvik/2.1.0 (Linux; U; Android 12; Pixel 6 Build/SD1A.210817.036)',
    appVersion: '13.4.8',
    platform: 'Android'
  },
  {
    ua: 'Dalvik/2.1.0 (Linux; U; Android 10; SM-A505F Build/QP1A.190711.020)',
    appVersion: '13.4.5',
    platform: 'Android'
  },
  {
    ua: 'Dalvik/2.1.0 (Linux; U; Android 13; OnePlus 11 Build/CPH2447)',
    appVersion: '13.5.0',
    platform: 'Android'
  },
  {
    ua: 'BookMyShow/13.4.5 (iPhone; iOS 16.5; Scale/3.00)',
    appVersion: '13.4.5',
    platform: 'iOS'
  },
  {
    ua: 'BookMyShow/13.4.8 (iPhone; iOS 17.2; Scale/3.00)',
    appVersion: '13.4.8',
    platform: 'iOS'
  }
];

// Indian ISP IP ranges for X-Forwarded-For spoofing
function getRandomIndianIP() {
  const blocks = [49, 103, 117, 122, 157, 163]; // Jio, Airtel, Vi, BSNL
  const block = blocks[Math.floor(Math.random() * blocks.length)];
  return `${block}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
}

function getMobileHeaders() {
  const device = MOBILE_DEVICES[Math.floor(Math.random() * MOBILE_DEVICES.length)];
  return {
    'User-Agent': device.ua,
    'X-App-Version': device.appVersion,
    'X-Platform': device.platform,
    'X-App-Code': 'BMS',
    'Accept': 'application/json',
    'Connection': 'keep-alive',
    'X-Forwarded-For': getRandomIndianIP(),
    'X-Real-IP': getRandomIndianIP(),
  };
}

// ══════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ══════════════════════════════════════════════════════════
function cleanMovieTitle(title: string): string {
  return title
    .replace(/\[.*?\]/g, '')
    .replace(/\(.*?\)/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Deterministic hash based session ID for Paytm/District
function getSessionId(item: any, dateStr: string): string {
  if (item.session_id && item.session_id.trim() !== '') {
    return String(item.session_id);
  }
  const input = `${item.venue}-${item.city}-${item.time}-${item.audi}-${dateStr}`;
  return crypto.createHash('md5').update(input).digest('hex').slice(0, 16);
}

// Get IST date string (always use India timezone)
function getISTDateStr(): string {
  const now = new Date();
  const ist = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
  const y = ist.getFullYear();
  const m = String(ist.getMonth() + 1).padStart(2, '0');
  const d = String(ist.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function getISTDateCode(): string {
  return getISTDateStr().replace(/-/g, '');
}

// Random jitter delay in milliseconds
function getJitterDelay(): number {
  const baseMs = BASE_INTERVAL_MIN * 60 * 1000;
  const jitterMs = JITTER_RANGE_MIN * 60 * 1000;
  const randomJitter = (Math.random() * 2 - 1) * jitterMs; // ± jitter
  return Math.max(60000, baseMs + randomJitter); // At least 1 minute
}

// Small delay between individual requests to appear human
function getRequestDelay(): number {
  return 1000 + Math.floor(Math.random() * 2000); // 1-3 seconds
}

// ══════════════════════════════════════════════════════════
// TIER 1: RAW JSON BACKUP
// ══════════════════════════════════════════════════════════
function saveRawJsonBackup(source: string, venueId: string, dateStr: string, data: any): void {
  try {
    const dir = path.join(RAW_DUMP_DIR, dateStr, source.toLowerCase());
    fs.mkdirSync(dir, { recursive: true });

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${venueId}_${dateStr}_${timestamp}.json`;
    const filepath = path.join(dir, filename);

    fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    // Don't crash the scraper if backup fails — just log
    console.warn(`⚠️ Failed to save raw JSON backup for ${source}/${venueId}:`, err);
  }
}

// ══════════════════════════════════════════════════════════
// MOVIE MANAGEMENT
// ══════════════════════════════════════════════════════════
async function getOrCreateMovie(rawTitle: string): Promise<number | null> {
  const cleanTitle = cleanMovieTitle(rawTitle);
  const slug = generateSlug(cleanTitle);

  if (movieCache[slug]) {
    return movieCache[slug];
  }

  // 1. Check if movie already exists in DB
  try {
    const existing = await db
      .select({ id: movies.id })
      .from(movies)
      .where(or(eq(movies.slug, slug), eq(movies.title, cleanTitle)))
      .limit(1);

    if (existing.length > 0) {
      movieCache[slug] = existing[0].id;
      movieIdToTitle[existing[0].id] = cleanTitle;
      return existing[0].id;
    }
  } catch (err) {
    console.error(`Error querying movie ${cleanTitle} from DB:`, err);
  }

  // 2. Fetch from TMDB if not exists
  let tmdbData: any = null;
  if (TMDB_API_KEY) {
    const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(cleanTitle)}&language=en-US`;
    try {
      const res = await fetch(searchUrl);
      if (res.ok) {
        const json = await res.json();
        if (json.results && json.results.length > 0) {
          tmdbData = json.results[0];
        }
      }
    } catch (err) {
      console.warn(`TMDB lookup failed for ${cleanTitle}:`, err);
    }
  }

  // 3. Insert new movie in DB
  const tmdbId = tmdbData ? tmdbData.id : Math.floor(900000 + Math.random() * 100000);
  const movieDetails = {
    tmdbId,
    title: cleanTitle,
    slug,
    overview: tmdbData ? tmdbData.overview : `Live tracked details for ${cleanTitle}`,
    releaseDate: tmdbData?.release_date ? new Date(tmdbData.release_date) : new Date(),
    year: tmdbData?.release_date ? new Date(tmdbData.release_date).getFullYear() : new Date().getFullYear(),
    voteAverage: tmdbData ? tmdbData.vote_average : 0,
    voteCount: tmdbData ? tmdbData.vote_count : 0,
    popularity: tmdbData ? tmdbData.popularity : 0,
    posterUrl: tmdbData?.poster_path ? `https://image.tmdb.org/t/p/w500${tmdbData.poster_path}` : null,
    backdropUrl: tmdbData?.backdrop_path ? `https://image.tmdb.org/t/p/original${tmdbData.backdrop_path}` : null,
    metadata: tmdbData || { source: 'live-tracker' },
  };

  try {
    const inserted = await db
      .insert(movies)
      .values(movieDetails)
      .onConflictDoUpdate({
        target: movies.tmdbId,
        set: { updatedAt: new Date() },
      })
      .returning({ id: movies.id });

    if (inserted.length > 0) {
      movieCache[slug] = inserted[0].id;
      movieIdToTitle[inserted[0].id] = cleanTitle;
      console.log(`🎬 Created/Mapped movie: "${cleanTitle}" -> ID ${inserted[0].id} (TMDB ID: ${tmdbId})`);
      return inserted[0].id;
    }
  } catch (err) {
    console.error(`❌ Failed to insert movie "${cleanTitle}":`, err);
  }

  return null;
}

// ══════════════════════════════════════════════════════════
// BMS SCRAPER (with raw backup + auto-backoff)
// ══════════════════════════════════════════════════════════
async function scrapeBMS(venueCode: string, dateCode: string, dateStr: string): Promise<any[]> {
  const url = `https://in.bookmyshow.com/api/v2/mobile/showtimes/byvenue?venueCode=${venueCode}&dateCode=${dateCode}`;
  const headers = getMobileHeaders();

  try {
    // Small delay before each request to appear human
    await new Promise(resolve => setTimeout(resolve, getRequestDelay()));

    const response = await fetch(url, { headers });

    // Auto-backoff detection
    if (response.status === 403 || response.status === 429) {
      consecutiveBmsFailures++;
      console.warn(`⚠️ BMS returned ${response.status} for ${venueCode}. Failures: ${consecutiveBmsFailures}/${MAX_CONSECUTIVE_FAILURES}`);

      if (consecutiveBmsFailures >= MAX_CONSECUTIVE_FAILURES) {
        console.error(`🚨 AUTO-PAUSE: ${MAX_CONSECUTIVE_FAILURES} consecutive BMS failures. Possible IP ban detected!`);
        isPaused = true;
      }
      return [];
    }

    if (!response.ok) return [];

    // Reset failure counter on success
    consecutiveBmsFailures = 0;

    const data = await response.json();

    // ★ TIER 1: Save raw JSON backup BEFORE any processing
    saveRawJsonBackup('bms', venueCode, dateStr, data);

    const out = [];

    const sd = data.ShowDetails || [];
    if (sd.length === 0) return [];

    const venue = sd[0].Venues || {};
    const venueName = venue.VenueName || "";
    const city = venue.VenueCity || "Unknown";
    const chain = venue.VenueCompName || "Unknown";
    const state = venue.VenueState || "Unknown State";

    for (const ev of (sd[0].Event || [])) {
      const title = ev.EventTitle || "Unknown";

      for (const ch of (ev.ChildEvents || [])) {
        const dim = (ch.EventDimension || "").trim();
        const lang = (ch.EventLanguage || "").trim();
        const suffix = [dim, lang].filter(Boolean).join(" | ");
        const movie = suffix ? `${title} [${suffix}]` : title;

        for (const sh of (ch.ShowTimes || [])) {
          if (sh.ShowDateCode !== dateCode) continue;

          let total = 0, avail = 0, sold = 0, gross = 0;
          
          for (const cat of (sh.Categories || [])) {
            const seats = parseInt(cat.MaxSeats || 0);
            const free = parseInt(cat.SeatsAvail || 0);
            const price = parseFloat(cat.CurPrice || 0);
            
            total += seats;
            avail += free;
            sold += (seats - free);
            gross += (seats - free) * price;
          }

          out.push({
            movie,
            venue: venueName,
            chain,
            city,
            state,
            time: sh.ShowTime || "",
            audi: sh.Attributes || "",
            sessionId: String(sh.SessionId || ""),
            totalSeats: total,
            availableSeats: avail,
            soldSeats: sold,
            grossRevenue: Number(gross.toFixed(2)),
            source: 'BMS'
          });
        }
      }
    }
    return out;
  } catch (error) {
    consecutiveBmsFailures++;
    return [];
  }
}

// ══════════════════════════════════════════════════════════
// DISTRICT/PAYTM SCRAPER (with raw backup + auto-backoff)
// ══════════════════════════════════════════════════════════
async function scrapeDistrict(venueId: string, dateStr: string): Promise<any[]> {
  if (!WORKER_KEY || !WORKER_UA) {
    return [];
  }

  const url = `https://districtvenues.text2026mail.workers.dev/?cinema_id=${venueId}&date=${dateStr}`;
  try {
    await new Promise(resolve => setTimeout(resolve, getRequestDelay()));

    const res = await fetch(url, {
      headers: {
        'User-Agent': WORKER_UA,
        'x-api-key': WORKER_KEY,
      },
      timeout: 15000,
    } as any);

    if (res.status === 403 || res.status === 429) {
      consecutiveDistrictFailures++;
      console.warn(`⚠️ District returned ${res.status} for ${venueId}. Failures: ${consecutiveDistrictFailures}/${MAX_CONSECUTIVE_FAILURES}`);
      if (consecutiveDistrictFailures >= MAX_CONSECUTIVE_FAILURES) {
        console.error(`🚨 AUTO-PAUSE: District API failures exceeded threshold!`);
      }
      return [];
    }

    if (!res.ok) return [];

    consecutiveDistrictFailures = 0;

    const json = await res.json();

    // ★ TIER 1: Save raw JSON backup
    saveRawJsonBackup('district', venueId, dateStr, json);

    const out: any[] = [];

    const moviesMap: Record<string, any> = {};
    (json.meta?.movies || []).forEach((m: any) => (moviesMap[m.id] = m));

    for (const session of json.pageData?.sessions || []) {
      const movie = moviesMap[session.mid];
      if (!movie) continue;

      const name = movie.name;
      const lang = session.lang || movie.lang || "";
      const format = session.format || movie.format || "";
      const suffix = [format, lang].filter(Boolean).join(" | ");
      const movieTitle = suffix ? `${name} [${suffix}]` : name;

      const total = session.total || 0;
      const avail = session.avail || 0;
      const sold = total - avail;

      let gross = 0;
      (session.areas || []).forEach((a: any) => {
        gross += (a.sTotal - a.sAvail) * (a.price || 0);
      });

      // parse time
      const timeStr = session.showTime ? new Date(session.showTime).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'Asia/Kolkata'
      }) : 'Unknown';

      out.push({
        movie: movieTitle,
        venue: json.meta?.cinema_name || 'Unknown Venue',
        chain: 'Ticketnew',
        city: json.meta?.city_name || 'Unknown City',
        state: json.meta?.state_name || 'Unknown State',
        time: timeStr,
        audi: session.audi || "",
        sessionId: "", // Let it be generated deterministically
        totalSeats: total,
        availableSeats: avail,
        soldSeats: sold,
        grossRevenue: gross,
        source: 'PAYTM',
      });
    }

    return out;
  } catch (err) {
    consecutiveDistrictFailures++;
    return [];
  }
}

// ══════════════════════════════════════════════════════════
// CONCURRENCY POOL
// ══════════════════════════════════════════════════════════
async function runWithLimit(tasks: (() => Promise<void>)[], limit: number) {
  const active: Promise<void>[] = [];
  for (const task of tasks) {
    if (isPaused) {
      console.warn('⏸️ Scraper is paused due to excessive failures. Skipping remaining tasks.');
      break;
    }
    const promise = task().then(() => {
      active.splice(active.indexOf(promise), 1);
    });
    active.push(promise);
    if (active.length >= limit) {
      await Promise.race(active);
    }
  }
  await Promise.all(active);
}

// ══════════════════════════════════════════════════════════
// HEALTH CHECK LOGGING
// ══════════════════════════════════════════════════════════
function writeHealthLog(stats: {
  cycleNumber: number;
  startTime: Date;
  endTime: Date;
  bmsVenues: number;
  districtVenues: number;
  totalSessions: number;
  successfulInserts: number;
  bmsFailures: number;
  districtFailures: number;
  isPaused: boolean;
}) {
  try {
    const logDir = path.join(RAW_DUMP_DIR, 'health');
    fs.mkdirSync(logDir, { recursive: true });
    const logFile = path.join(logDir, `health-${getISTDateStr()}.jsonl`);
    const entry = {
      ...stats,
      startTime: stats.startTime.toISOString(),
      endTime: stats.endTime.toISOString(),
      durationSec: (stats.endTime.getTime() - stats.startTime.getTime()) / 1000,
    };
    fs.appendFileSync(logFile, JSON.stringify(entry) + '\n', 'utf-8');
  } catch (err) {
    console.warn('⚠️ Failed to write health log:', err);
  }
}

// ══════════════════════════════════════════════════════════
// MAIN TRACKER FUNCTION (Single Cycle)
// ══════════════════════════════════════════════════════════
async function runSingleCycle(cycleNumber: number) {
  const cycleStart = new Date();
  console.log(`\n${'═'.repeat(60)}`);
  console.log(`🚀 Cycle #${cycleNumber} — ${cycleStart.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST`);
  console.log(`${'═'.repeat(60)}`);

  // Reset pause state at start of each cycle (allow recovery)
  isPaused = false;
  consecutiveBmsFailures = 0;
  consecutiveDistrictFailures = 0;

  const dateStr = getISTDateStr();
  const dateCode = getISTDateCode();

  // ──────────────────────────────────────────────
  // 1. GATHER VENUE LISTS
  // ──────────────────────────────────────────────
  let venuesList: any[] = [];
  const assetzDir = path.resolve(__dirname, '../../bfilmy-repos-temp/assetz');

  if (fs.existsSync(assetzDir)) {
    for (let i = 1; i <= 8; i++) {
      const file = path.join(assetzDir, `venues${i}.json`);
      if (fs.existsSync(file)) {
        const data = JSON.parse(fs.readFileSync(file, 'utf-8'));
        for (const [code, val] of Object.entries(data as any)) {
          venuesList.push({
            code,
            name: (val as any).VenueName,
            city: (val as any).City,
            state: (val as any).State,
          });
        }
      }
    }
  }

  // Decide how many venues to scrape
  let bmsVenuesToScrape: any[];
  if (TRACK_ALL) {
    // Production: ALL venues
    bmsVenuesToScrape = venuesList;
    console.log(`🏛️ PRODUCTION MODE: Scraping ALL ${bmsVenuesToScrape.length} BMS venues`);
  } else {
    // Dev: Major cities only, limited count
    const majorCities = ['hyderabad', 'secunderabad', 'visakhapatnam', 'vizag', 'vijayawada', 'bengaluru', 'bangalore', 'chennai'];
    bmsVenuesToScrape = venuesList.filter(v => majorCities.includes(v.city.toLowerCase()));
    if (bmsVenuesToScrape.length === 0) {
      bmsVenuesToScrape = [
        { code: 'AMBC', name: 'AMB Cinemas: Gachibowli', city: 'Hyderabad', state: 'Telangana' },
        { code: 'PRAS', name: 'Prasads Multiplex: Hyderabad', city: 'Hyderabad', state: 'Telangana' },
        { code: 'CPCH', name: 'Cinepolis: Sudha Multiplex, Hyderabad', city: 'Hyderabad', state: 'Telangana' },
        { code: 'SKRN', name: 'Sri Kanya: Visakhapatnam', city: 'Visakhapatnam', state: 'Andhra Pradesh' },
        { code: 'PVRR', name: 'PVR: Forum Mall, Bangalore', city: 'Bengaluru', state: 'Karnataka' },
      ];
    } else {
      bmsVenuesToScrape = bmsVenuesToScrape.slice(0, 50);
    }
    console.log(`📊 DEV MODE: Scraping ${bmsVenuesToScrape.length} BMS venues (Date: ${dateStr})`);
  }

  // ──────────────────────────────────────────────
  // 2. SCRAPE BMS
  // ──────────────────────────────────────────────
  const sessionsToInsert: any[] = [];
  const bmsTasks = bmsVenuesToScrape.map(v => async () => {
    const results = await scrapeBMS(v.code, dateCode, dateStr);
    if (results.length > 0) {
      sessionsToInsert.push(...results);
    }
  });

  console.log('🌐 Scraping BookMyShow Mobile API...');
  await runWithLimit(bmsTasks, 5);
  console.log(`   ✓ BMS done. ${sessionsToInsert.length} sessions from ${bmsVenuesToScrape.length} venues.`);

  // ──────────────────────────────────────────────
  // 3. SCRAPE DISTRICT/PAYTM
  // ──────────────────────────────────────────────
  let districtVenueCount = 0;
  if (WORKER_KEY && WORKER_UA && !isPaused) {
    console.log('🌐 Scraping District/Paytm API...');
    let districtVenues: any[] = [];
    const distFile = path.join(assetzDir, 'districtvenues.json');
    if (fs.existsSync(distFile)) {
      districtVenues = JSON.parse(fs.readFileSync(distFile, 'utf-8'));
    }
    
    if (districtVenues.length > 0) {
      const listToScrape = TRACK_ALL ? districtVenues : districtVenues.slice(0, 15);
      districtVenueCount = listToScrape.length;
      const distTasks = listToScrape.map((v: any) => async () => {
        const results = await scrapeDistrict(v.id, dateStr);
        if (results.length > 0) {
          sessionsToInsert.push(...results);
        }
      });
      await runWithLimit(distTasks, 10);
      console.log(`   ✓ District done. Total sessions now: ${sessionsToInsert.length}`);
    }
  } else if (!WORKER_KEY) {
    console.log('ℹ️ Paytm/District skipped (WORKER_KEY not configured).');
  }

  // ──────────────────────────────────────────────
  // 4. MAP MOVIES, FILTER, & INSERT TO DB
  // ──────────────────────────────────────────────
  let successCount = 0;
  let filteredCount = 0;

  if (sessionsToInsert.length > 0) {
    console.log(`\n📝 Processing ${sessionsToInsert.length} raw sessions...`);
    const dbSessions: any[] = [];

    for (const item of sessionsToInsert) {
      const movieId = await getOrCreateMovie(item.movie);
      if (!movieId) continue;

      // ★ TRACK_MOVIE_ID filter: only insert sessions for the target movie
      if (TRACK_MOVIE_ID && movieId !== TRACK_MOVIE_ID) {
        filteredCount++;
        continue;
      }

      const sessionId = getSessionId(item, dateStr);

      dbSessions.push({
        movieId,
        sessionId,
        venueName: item.venue,
        chainName: item.chain,
        city: item.city,
        state: item.state,
        showDate: new Date(dateStr),
        showTime: item.time,
        audi: item.audi,
        totalSeats: item.totalSeats,
        availableSeats: item.availableSeats,
        soldSeats: item.soldSeats,
        grossRevenue: item.grossRevenue,
        source: item.source,
        lastUpdated: new Date(),
      });
    }

    if (TRACK_MOVIE_ID) {
      console.log(`   🎯 Tracking movie ID ${TRACK_MOVIE_ID} only. Kept ${dbSessions.length} sessions, filtered out ${filteredCount}.`);
    }

    // Deduplicate
    const sessionMap = new Map<string, any>();
    for (const session of dbSessions) {
      const key = `${session.movieId}_${session.sessionId}`;
      sessionMap.set(key, session);
    }
    const uniqueSessions = Array.from(sessionMap.values());

    console.log(`   Deduplicated to ${uniqueSessions.length} unique sessions. Upserting to PostgreSQL...`);

    // Batch insert
    const chunkSize = 1000;
    for (let i = 0; i < uniqueSessions.length; i += chunkSize) {
      const chunk = uniqueSessions.slice(i, i + chunkSize);
      try {
        await db
          .insert(realtimeSessions)
          .values(chunk)
          .onConflictDoUpdate({
            target: [realtimeSessions.movieId, realtimeSessions.sessionId],
            set: {
              availableSeats: sql`EXCLUDED.available_seats`,
              soldSeats: sql`EXCLUDED.sold_seats`,
              grossRevenue: sql`EXCLUDED.gross_revenue`,
              lastUpdated: new Date(),
            }
          });
        successCount += chunk.length;
      } catch (err) {
        console.error(`❌ Batch insert failed starting at index ${i}:`, err);
      }
    }

    // ──────────────────────────────────────────────
    // 5. HOURLY TRENDING SNAPSHOT
    // ──────────────────────────────────────────────
    console.log('📊 Generating hourly trending logs...');
    const nowHour = new Date();
    nowHour.setMinutes(0, 0, 0);

    const uniqueMovieIds = Array.from(new Set(uniqueSessions.map(s => s.movieId)));
    let aggregatedCount = 0;

    for (const mId of uniqueMovieIds) {
      const aggregated = await db
        .select({
          sold: sql`SUM(${realtimeSessions.soldSeats})`.mapWith(Number),
          gross: sql`SUM(${realtimeSessions.grossRevenue})`.mapWith(Number),
          shows: sql`COUNT(${realtimeSessions.id})`.mapWith(Number),
          totalSeats: sql`SUM(${realtimeSessions.totalSeats})`.mapWith(Number),
        })
        .from(realtimeSessions)
        .where(eq(realtimeSessions.movieId, mId));

      if (aggregated.length > 0 && aggregated[0].shows > 0) {
        const stat = aggregated[0];
        const occupancy = stat.totalSeats > 0 ? (stat.sold / stat.totalSeats) * 100 : 0;
        
        try {
          await db
            .insert(hourlyTrendingLogs)
            .values({
              movieId: mId,
              timestamp: nowHour,
              soldTickets: stat.sold,
              grossRevenue: stat.gross,
              showsCount: stat.shows,
              averageOccupancy: Number(occupancy.toFixed(2)),
            })
            .onConflictDoUpdate({
              target: [hourlyTrendingLogs.movieId, hourlyTrendingLogs.timestamp],
              set: {
                soldTickets: stat.sold,
                grossRevenue: stat.gross,
                showsCount: stat.shows,
                averageOccupancy: Number(occupancy.toFixed(2)),
              }
            });
          aggregatedCount++;
        } catch (err) {
          console.error(`❌ Failed to write hourly trending log for movie ID ${mId}:`, err);
        }
      }
    }

    console.log(`✅ Cycle #${cycleNumber} complete! Upserted ${successCount} sessions, ${aggregatedCount} hourly snapshots.`);
  } else {
    console.log('⚠️ No sessions found this cycle.');
  }

  // ──────────────────────────────────────────────
  // 6. HEALTH LOG
  // ──────────────────────────────────────────────
  const cycleEnd = new Date();
  writeHealthLog({
    cycleNumber,
    startTime: cycleStart,
    endTime: cycleEnd,
    bmsVenues: bmsVenuesToScrape.length,
    districtVenues: districtVenueCount,
    totalSessions: sessionsToInsert.length,
    successfulInserts: successCount,
    bmsFailures: consecutiveBmsFailures,
    districtFailures: consecutiveDistrictFailures,
    isPaused,
  });

  return { successCount, isPaused };
}

// ══════════════════════════════════════════════════════════
// ENTRY POINT
// ══════════════════════════════════════════════════════════
async function main() {
  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║         TFIverse Box Office Tracker Engine v2           ║');
  console.log('╠══════════════════════════════════════════════════════════╣');
  console.log(`║ Mode:          ${LOOP_MODE ? 'CONTINUOUS LOOP' : 'SINGLE RUN'}${' '.repeat(LOOP_MODE ? 25 : 30)}║`);
  console.log(`║ Track All:     ${TRACK_ALL ? 'YES (all venues)' : 'NO (dev/limited)'}${' '.repeat(TRACK_ALL ? 23 : 23)}║`);
  console.log(`║ Movie Filter:  ${TRACK_MOVIE_ID ? `ID ${TRACK_MOVIE_ID} only` : 'ALL movies'}${' '.repeat(TRACK_MOVIE_ID ? 28 : 29)}║`);
  console.log(`║ JSON Backups:  ${RAW_DUMP_DIR.length > 35 ? '...' + RAW_DUMP_DIR.slice(-32) : RAW_DUMP_DIR}${' '.repeat(Math.max(0, 39 - Math.min(RAW_DUMP_DIR.length, 35)))}║`);
  console.log('╚══════════════════════════════════════════════════════════╝');

  if (LOOP_MODE) {
    // Continuous loop with jitter
    let cycle = 1;
    while (true) {
      try {
        const result = await runSingleCycle(cycle);

        if (result.isPaused) {
          // If paused due to ban detection, wait longer before retrying
          const cooldown = 30 * 60 * 1000; // 30 minutes
          console.log(`⏸️ Paused. Cooling down for 30 minutes before retry...`);
          await new Promise(resolve => setTimeout(resolve, cooldown));
        } else {
          // Normal jitter delay
          const delay = getJitterDelay();
          const delayMin = (delay / 60000).toFixed(1);
          console.log(`⏳ Next cycle in ${delayMin} minutes...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      } catch (err) {
        console.error(`💥 Cycle ${cycle} crashed:`, err);
        // Wait 5 minutes on crash before retrying
        await new Promise(resolve => setTimeout(resolve, 5 * 60 * 1000));
      }
      cycle++;
    }
  } else {
    // Single run mode
    await runSingleCycle(1);
    process.exit(0);
  }
}

main();
