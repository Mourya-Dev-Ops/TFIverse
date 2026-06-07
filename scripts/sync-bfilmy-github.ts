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
    metadata: tmdbData || { source: 'github-sync' },
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

function getSessionId(item: any, dateStr: string): string {
  if (item.session_id && item.session_id.trim() !== '') {
    return String(item.session_id);
  }
  const input = `${item.venue}-${item.city}-${item.time}-${item.audi}-${dateStr}`;
  return crypto.createHash('md5').update(input).digest('hex').slice(0, 16);
}

async function importDetailedData(data: any[], dateStr: string) {
  console.log(`Mapping ${data.length} sessions from download...`);
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

  // Deduplicate
  const sessionMap = new Map<string, any>();
  for (const session of sessionsToInsert) {
    const key = `${session.movieId}_${session.sessionId}`;
    sessionMap.set(key, session);
  }
  const uniqueSessions = Array.from(sessionMap.values());
  console.log(`Deduplicated to ${uniqueSessions.length} unique sessions. Upserting to Postgres...`);

  let successCount = 0;
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
    } catch (err) {
      console.error(`❌ Error inserting chunk starting at index ${i}:`, err);
    }
  }
  console.log(`✅ Finished detailed sync for ${dateStr}. Success count: ${successCount}`);
}

async function syncDate(date: Date) {
  const year = date.getFullYear();
  const monthStr = String(date.getMonth() + 1).padStart(2, '0');
  const dayStr = String(date.getDate()).padStart(2, '0');
  
  const compact = `${year}${monthStr}${dayStr}`;
  const dateStr = `${year}-${monthStr}-${dayStr}`;
  const localFileName = `${monthStr}-${dayStr}_finaldetailed.json`;
  const localDir = path.resolve(__dirname, `../../bfilmy-repos/data2026/daily/data/${year}`);
  const localPath = path.join(localDir, localFileName);

  console.log(`\n📅 Syncing date: ${dateStr}...`);

  const url = `https://raw.githubusercontent.com/unknownman2024/assetz/refs/heads/main/daily/data/${compact}/finaldetailed.json`;
  
  try {
    console.log(`📥 Downloading from: ${url}`);
    const res = await fetch(url);
    if (!res.ok) {
      console.log(`⚠️ GitHub raw returned status ${res.status}. Skip date.`);
      return;
    }

    const rawContent = await res.text();
    const parsed = JSON.parse(rawContent);

    // Save locally
    if (!fs.existsSync(localDir)) {
      fs.mkdirSync(localDir, { recursive: true });
    }
    fs.writeFileSync(localPath, rawContent, 'utf-8');
    console.log(`💾 Saved local copy at ${localPath}`);

    // Import
    await importDetailedData(parsed.data || [], dateStr);
  } catch (err) {
    console.error(`❌ Sync error for date ${dateStr}:`, err);
  }
}

async function syncHourlyLogs() {
  console.log('\n📈 Syncing hourly trending logs for current month from GitHub...');
  const now = new Date();
  const year = now.getFullYear();
  const monthStr = String(now.getMonth() + 1).padStart(2, '0');
  const monthLabel = `${year}-${monthStr}`;

  const url = `https://raw.githubusercontent.com/unknownman2024/assetz/refs/heads/main/daily/logs/${monthLabel}/monthlylogs.json`;

  try {
    console.log(`📥 Downloading monthly logs: ${url}`);
    const res = await fetch(url);
    if (!res.ok) {
      console.log(`⚠️ Status ${res.status} when fetching monthly logs. Skip.`);
      return;
    }

    const raw = await res.text();
    const monthlyData = JSON.parse(raw);

    const logsToInsert: any[] = [];

    for (const [movieName, dateMap] of Object.entries(monthlyData)) {
      const movieId = await getOrCreateMovie(movieName);
      if (!movieId) continue;

      for (const [dateStr, hourMap] of Object.entries(dateMap as any)) {
        const [day, valMonth, yearNum] = dateStr.split('/').map(Number);
        
        for (const [hourStr, metrics] of Object.entries(hourMap as any)) {
          let hour = parseInt(hourStr.slice(0, 2));
          const ampm = hourStr.slice(2);
          if (ampm === 'PM' && hour !== 12) {
            hour += 12;
          } else if (ampm === 'AM' && hour === 12) {
            hour = 0;
          }

          const timestamp = new Date(yearNum, valMonth - 1, day, hour, 0, 0);
          
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

    console.log(`Deduplicating ${logsToInsert.length} synced hourly logs...`);
    const logMap = new Map<string, any>();
    for (const log of logsToInsert) {
      const key = `${log.movieId}_${log.timestamp.getTime()}`;
      logMap.set(key, log);
    }
    const uniqueLogs = Array.from(logMap.values());
    console.log(`Deduplicated to ${uniqueLogs.length} unique logs. Upserting to PostgreSQL...`);

    let totalLogsCount = 0;
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
    console.log(`✅ Hourly logs sync complete. Success count: ${totalLogsCount}`);
  } catch (err) {
    console.error('❌ Failed to sync hourly logs:', err);
  }
}

async function main() {
  console.log('🚀 Starting BFilmy GitHub Sync...');
  
  // Sync today and yesterday
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  await syncDate(yesterday);
  await syncDate(today);

  // Sync hourly logs
  await syncHourlyLogs();

  console.log('\n🎉 BFilmy GitHub Sync completed successfully!');
  process.exit(0);
}

main();
