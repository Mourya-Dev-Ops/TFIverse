import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

import { db } from '../src/lib/db';
import { movies } from '../src/lib/schema/content';
import { realtimeSessions, hourlyTrendingLogs } from '../src/lib/schema/tracking';
import { eq, or, sql } from 'drizzle-orm';
import * as fs from 'fs';
import * as crypto from 'crypto';

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const WORKER_UA = process.env.WORKER_UA;
const WORKER_KEY = process.env.WORKER_KEY;

// Cache to prevent duplicate DB and TMDB calls
const movieCache: Record<string, number> = {};

// Headers for BMSMobile API bypass
const HEADERS = {
  'User-Agent': 'Dalvik/2.1.0 (Linux; U; Android 11; SM-G998B Build/RP1A.200720.012)',
  'Accept': 'application/json',
  'Connection': 'keep-alive',
  'X-Forwarded-For': '',
};

function getRandomIndianIP() {
  const blocks = [49, 103, 117, 122, 157, 163];
  const block = blocks[Math.floor(Math.random() * blocks.length)];
  return `${block}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
}

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
      console.log(`🎬 Created/Mapped movie: "${cleanTitle}" -> ID ${inserted[0].id} (TMDB ID: ${tmdbId})`);
      return inserted[0].id;
    }
  } catch (err) {
    console.error(`❌ Failed to insert movie "${cleanTitle}":`, err);
  }

  return null;
}

// Deterministic hash based session ID for Paytm/District
function getSessionId(item: any, dateStr: string): string {
  if (item.session_id && item.session_id.trim() !== '') {
    return String(item.session_id);
  }
  const input = `${item.venue}-${item.city}-${item.time}-${item.audi}-${dateStr}`;
  return crypto.createHash('md5').update(input).digest('hex').slice(0, 16);
}

// Direct scraping of BMS
async function scrapeBMS(venueCode: string, dateCode: string, dateStr: string): Promise<any[]> {
  const url = `https://in.bookmyshow.com/api/v2/mobile/showtimes/byvenue?venueCode=${venueCode}&dateCode=${dateCode}`;
  HEADERS['X-Forwarded-For'] = getRandomIndianIP();

  try {
    const response = await fetch(url, { headers: HEADERS });
    if (!response.ok) return [];

    const data = await response.json();
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
    return [];
  }
}

// Scrape Paytm/District using workers API if keys are present
async function scrapeDistrict(venueId: string, dateStr: string): Promise<any[]> {
  if (!WORKER_KEY || !WORKER_UA) {
    return [];
  }

  const url = `https://districtvenues.text2026mail.workers.dev/?cinema_id=${venueId}&date=${dateStr}`;
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': WORKER_UA,
        'x-api-key': WORKER_KEY,
      },
      timeout: 15000,
    } as any);

    if (!res.ok) return [];
    const json = await res.json();
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
    return [];
  }
}

// Concurrency-limited promise pool
async function runWithLimit(tasks: (() => Promise<void>)[], limit: number) {
  const active: Promise<void>[] = [];
  for (const task of tasks) {
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

async function runTracker() {
  console.log('🚀 Starting TFIverse Box Office Tracker Engine...');
  const startTime = Date.now();

  const today = new Date();
  const dateCode = today.toISOString().split('T')[0].replace(/-/g, ''); // e.g. 20260605
  const dateStr = today.toISOString().split('T')[0]; // e.g. 2026-06-05

  // 1. Gather BMS Venues
  let venuesList: any[] = [];
  const assetzDir = path.resolve(__dirname, '../../bfilmy-repos/assetz');
  const trackAll = process.env.TRACK_ALL_VENUES === 'true';

  if (fs.existsSync(assetzDir)) {
    // Read from venues1.json to venues8.json
    for (let i = 1; i <= 8; i++) {
      const file = path.join(assetzDir, `venues${i}.json`);
      if (fs.existsSync(file)) {
        const data = JSON.parse(fs.readFileSync(file, 'utf-8'));
        for (const [code, val] of Object.entries(data as any)) {
          venuesList.push({
            code,
            name: val.VenueName,
            city: val.City,
            state: val.State,
          });
        }
      }
    }
  }

  // Filter list to major Telugu box office cities to run safely and fast in development
  const majorCities = ['hyderabad', 'secunderabad', 'visakhapatnam', 'vizag', 'vijayawada', 'bengaluru', 'bangalore', 'chennai'];
  let bmsVenuesToScrape = venuesList.filter(v => majorCities.includes(v.city.toLowerCase()));

  if (bmsVenuesToScrape.length === 0) {
    console.log('⚠️ No local venues found. Using fallback major venues.');
    bmsVenuesToScrape = [
      { code: 'AMBC', name: 'AMB Cinemas: Gachibowli', city: 'Hyderabad', state: 'Telangana' },
      { code: 'PRAS', name: 'Prasads Multiplex: Hyderabad', city: 'Hyderabad', state: 'Telangana' },
      { code: 'CPCH', name: 'Cinepolis: Sudha Multiplex, Hyderabad', city: 'Hyderabad', state: 'Telangana' },
      { code: 'SKRN', name: 'Sri Kanya: Visakhapatnam', city: 'Visakhapatnam', state: 'Andhra Pradesh' },
      { code: 'PVRR', name: 'PVR: Forum Mall, Bangalore', city: 'Bengaluru', state: 'Karnataka' },
    ];
  } else if (!trackAll) {
    // Limit to 50 venues in dev to avoid getting IP blocked
    bmsVenuesToScrape = bmsVenuesToScrape.slice(0, 50);
  }

  console.log(`📊 Selected ${bmsVenuesToScrape.length} BMS venues to track today (Date: ${dateStr}).`);

  // 2. Scraping BMS in Parallel
  const sessionsToInsert: any[] = [];
  const bmsTasks = bmsVenuesToScrape.map(v => async () => {
    const results = await scrapeBMS(v.code, dateCode, dateStr);
    if (results.length > 0) {
      sessionsToInsert.push(...results);
    }
  });

  console.log('🌐 Polling BookMyShow Mobile API...');
  await runWithLimit(bmsTasks, 15);

  // 3. Scraping District (Paytm) if Worker secrets exist
  if (WORKER_KEY && WORKER_UA) {
    console.log('🌐 Polling District/Paytm API...');
    let districtVenues: any[] = [];
    const distFile = path.join(assetzDir, 'districtvenues.json');
    if (fs.existsSync(distFile)) {
      districtVenues = JSON.parse(fs.readFileSync(distFile, 'utf-8'));
    }
    
    if (districtVenues.length > 0) {
      const listToScrape = trackAll ? districtVenues : districtVenues.slice(0, 15); // limit in dev
      const distTasks = listToScrape.map((v: any) => async () => {
        const results = await scrapeDistrict(v.id, dateStr);
        if (results.length > 0) {
          sessionsToInsert.push(...results);
        }
      });
      await runWithLimit(distTasks, 10);
    }
  } else {
    console.log('ℹ️ Paytm/District tracking is skipped because WORKER_KEY is not configured in .env.local.');
  }

  // 4. Map movie names to movie IDs & Insert to DB
  if (sessionsToInsert.length > 0) {
    console.log(`Mapped ${sessionsToInsert.length} raw sessions. Processing movies...`);
    const dbSessions: any[] = [];

    for (const item of sessionsToInsert) {
      const movieId = await getOrCreateMovie(item.movie);
      if (!movieId) continue;

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

    // Deduplicate array
    const sessionMap = new Map<string, any>();
    for (const session of dbSessions) {
      const key = `${session.movieId}_${session.sessionId}`;
      sessionMap.set(key, session);
    }
    const uniqueSessions = Array.from(sessionMap.values());

    console.log(`Deduplicated to ${uniqueSessions.length} unique sessions. Upserting to PostgreSQL...`);

    // Batch insert
    let successCount = 0;
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

    // 5. Aggregate Hourly Velocity Snapshot
    console.log('📊 Generating hourly trending logs...');
    const nowHour = new Date();
    nowHour.setMinutes(0, 0, 0); // Rounded hour

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

    console.log(`✅ Success! Updated ${successCount} showtimes and generated hourly snapshots for ${aggregatedCount} movies.`);
  } else {
    console.log('⚠️ No active shows found on BookMyShow for target venues.');
  }

  const endTime = Date.now();
  console.log(`✅ Tracker completed successfully in ${((endTime - startTime) / 1000).toFixed(2)} seconds.`);
  process.exit(0);
}

runTracker();
