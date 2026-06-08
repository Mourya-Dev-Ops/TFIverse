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

// Cache to prevent duplicate DB queries and TMDB queries
const movieCache: Record<string, number> = {};

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

  // 1. Check if movie already exists in DB (by slug or title)
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
    metadata: tmdbData || { source: 'historical-importer' },
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

// Generates a deterministic unique session ID if one is empty
function getSessionId(item: any, dateStr: string): string {
  if (item.session_id && item.session_id.trim() !== '') {
    return String(item.session_id);
  }
  // Deterministic hash based on venue, city, time, audi and showDate
  const input = `${item.venue}-${item.city}-${item.time}-${item.audi}-${dateStr}`;
  return crypto.createHash('md5').update(input).digest('hex').slice(0, 16);
}

async function importDetailedFile(filePath: string, dateStr: string) {
  console.log(`\n📂 Reading file: ${path.basename(filePath)}...`);
  const raw = fs.readFileSync(filePath, 'utf-8');
  const parsed = JSON.parse(raw);
  const data = parsed.data || [];
  
  console.log(`Found ${data.length} sessions in file. Mapping to DB...`);
  
  const showDate = new Date(dateStr);
  const sessionsToInsert: any[] = [];
  
  for (const item of data) {
    const movieId = await getOrCreateMovie(item.movie);
    if (!movieId) continue;

    const sessionId = getSessionId(item, dateStr);
    const source = item.s === 'B' ? 'BMS' : 'PAYTM';
    
    sessionsToInsert.push({
      movieId,
      sessionId,
      venueName: item.venue || 'Unknown Venue',
      chainName: item.chain || null,
      city: item.city || 'Unknown City',
      state: item.state || 'Unknown State',
      showDate,
      showTime: item.time || 'Unknown Time',
      audi: item.audi || null,
      totalSeats: Number(item.totalSeats || 0),
      availableSeats: Number(item.available || 0),
      soldSeats: Number(item.sold || 0),
      grossRevenue: Number(item.gross || 0),
      source,
      lastUpdated: new Date(),
    });
  }

  // DEDUPLICATE inside the sessions array to prevent ON CONFLICT DO UPDATE from failing
  console.log(`Deduplicating ${sessionsToInsert.length} sessions...`);
  const sessionMap = new Map<string, any>();
  for (const session of sessionsToInsert) {
    const key = `${session.movieId}_${session.sessionId}`;
    sessionMap.set(key, session);
  }
  const uniqueSessions = Array.from(sessionMap.values());
  console.log(`Deduplicated to ${uniqueSessions.length} unique sessions. Inserting...`);

  let successCount = 0;
  // Batch insert
  const chunkSize = 2000;
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
      process.stdout.write(`💾 Imported ${successCount}/${uniqueSessions.length} sessions...\r`);
    } catch (err) {
      console.error(`\n❌ Error inserting chunk starting at index ${i}:`, err);
    }
  }
  console.log(`\n✅ Finished detailed import for ${dateStr}. Success count: ${successCount}`);
}

async function importHourlyLogs() {
  console.log('\n📈 Starting hourly logs import...');
  const logsDir = path.resolve(__dirname, '../../bfilmy-repos-temp/assetz/daily/logs');
  if (!fs.existsSync(logsDir)) {
    console.log('Logs directory not found at:', logsDir);
    return;
  }

  const monthFolders = fs.readdirSync(logsDir).filter(f => f.match(/^\d{4}-\d{2}$/));
  console.log(`Found ${monthFolders.length} month logs folders.`);

  let totalLogsCount = 0;

  for (const month of monthFolders) {
    const monthlyLogsPath = path.join(logsDir, month, 'monthlylogs.json');
    if (!fs.existsSync(monthlyLogsPath)) continue;

    console.log(`Reading monthly logs for ${month}...`);
    const monthlyData = JSON.parse(fs.readFileSync(monthlyLogsPath, 'utf-8'));

    const logsToInsert: any[] = [];

    for (const [movieName, dateMap] of Object.entries(monthlyData)) {
      const movieId = await getOrCreateMovie(movieName);
      if (!movieId) continue;

      for (const [dateStr, hourMap] of Object.entries(dateMap as any)) {
        // Parse dateStr (DD/MM/YYYY)
        const [day, valMonth, year] = dateStr.split('/').map(Number);
        
        for (const [hourStr, metrics] of Object.entries(hourMap as any)) {
          // Parse hourStr (e.g. "06AM", "12PM", "01PM")
          let hour = parseInt(hourStr.slice(0, 2));
          const ampm = hourStr.slice(2);
          if (ampm === 'PM' && hour !== 12) {
            hour += 12;
          } else if (ampm === 'AM' && hour === 12) {
            hour = 0;
          }

          // Create date in local IST
          const timestamp = new Date(year, valMonth - 1, day, hour, 0, 0);
          
          const showsCount = Number(metrics[0] || 0);
          const grossRevenue = Number(metrics[1] || 0);
          const soldTickets = Number(metrics[2] || 0);
          const averageOccupancy = Number(metrics[3] || 0);

          logsToInsert.push({
            movieId,
            timestamp,
            soldTickets,
            grossRevenue,
            showsCount,
            averageOccupancy,
          });
        }
      }
    }

    console.log(`Deduplicating ${logsToInsert.length} hourly trending logs...`);
    const logMap = new Map<string, any>();
    for (const log of logsToInsert) {
      const key = `${log.movieId}_${log.timestamp.getTime()}`;
      logMap.set(key, log);
    }
    const uniqueLogs = Array.from(logMap.values());
    console.log(`Deduplicated to ${uniqueLogs.length} unique hourly logs. Inserting...`);

    // Batch insert
    const chunkSize = 2000;
    for (let i = 0; i < uniqueLogs.length; i += chunkSize) {
      const chunk = uniqueLogs.slice(i, i + chunkSize);
      try {
        await db
          .insert(hourlyTrendingLogs)
          .values(chunk)
          .onConflictDoUpdate({
            target: [hourlyTrendingLogs.movieId, hourlyTrendingLogs.timestamp],
            set: {
              soldTickets: sql`EXCLUDED.sold_tickets`,
              grossRevenue: sql`EXCLUDED.gross_revenue`,
              showsCount: sql`EXCLUDED.shows_count`,
              averageOccupancy: sql`EXCLUDED.average_occupancy`,
            }
          });
        totalLogsCount += chunk.length;
      } catch (err) {
        console.error(`❌ Error inserting hourly chunk starting at index ${i}:`, err);
      }
    }
  }

  console.log(`\n✅ Completed hourly logs import. Total rows inserted: ${totalLogsCount}`);
}

async function main() {
  console.log('🚀 Starting BFilmy Historical Data Importer...');
  
  console.log('🧹 Truncating tracking tables for a clean slate...');
  try {
    await db.execute(sql`TRUNCATE TABLE realtime_sessions CASCADE;`);
    await db.execute(sql`TRUNCATE TABLE hourly_trending_logs CASCADE;`);
    console.log('🧹 Cleanup complete.');
  } catch (err) {
    console.warn('Failed to truncate tables:', err);
  }

  // 1. Import detailed sessions for the last 3 days
  const dailyDataDir = path.resolve(__dirname, '../../bfilmy-repos-temp/data2026/daily/data/2026');
  if (fs.existsSync(dailyDataDir)) {
    const files = fs.readdirSync(dailyDataDir)
      .filter(f => f.endsWith('_finaldetailed.json'))
      .sort()
      .slice(-3); // Last 3 files (06-02, 06-03, 06-04)

    for (const file of files) {
      const match = file.match(/^(\d{2})-(\d{2})_finaldetailed\.json$/);
      if (match) {
        const dateStr = `2026-${match[1]}-${match[2]}`;
        await importDetailedFile(path.join(dailyDataDir, file), dateStr);
      }
    }
  } else {
    console.warn(`Daily data directory not found at: ${dailyDataDir}`);
  }

  // 2. Import hourly trending logs
  await importHourlyLogs();

  console.log('\n🎉 Historical data import completed successfully!');
  process.exit(0);
}

main();
