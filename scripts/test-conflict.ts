import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

import { db } from '../src/lib/db';
import { realtimeSessions } from '../src/lib/schema/tracking';
import { movies } from '../src/lib/schema/content';
import { sql } from 'drizzle-orm';

async function testConflict() {
  try {
    const [movie] = await db.select({ id: movies.id }).from(movies).limit(1);
    if (!movie) return;
    
    console.log(`Inserting test session 1`);
    await db.insert(realtimeSessions).values({
      movieId: movie.id,
      sessionId: 'CONFLICT_TEST',
      venueName: 'Venue 1',
      city: 'City 1',
      showDate: new Date(),
      showTime: '10:00 AM',
      totalSeats: 100,
      availableSeats: 80,
      soldSeats: 20,
      grossRevenue: 2000,
      source: 'BMS',
      lastUpdated: new Date()
    }).onConflictDoUpdate({
      target: [realtimeSessions.movieId, realtimeSessions.sessionId],
      set: {
        venueName: 'Updated Venue',
        lastUpdated: new Date()
      }
    });
    
    console.log(`Inserting test session 2 (conflict)`);
    await db.insert(realtimeSessions).values({
      movieId: movie.id,
      sessionId: 'CONFLICT_TEST',
      venueName: 'Venue 2',
      city: 'City 2',
      showDate: new Date(),
      showTime: '11:00 AM',
      totalSeats: 120,
      availableSeats: 90,
      soldSeats: 30,
      grossRevenue: 3000,
      source: 'BMS',
      lastUpdated: new Date()
    }).onConflictDoUpdate({
      target: [realtimeSessions.movieId, realtimeSessions.sessionId],
      set: {
        venueName: 'Updated Venue 2',
        lastUpdated: new Date()
      }
    });
    
    console.log('Conflict handling success!');
  } catch (err: any) {
    console.error('Conflict handling failed:', err);
  }
  process.exit(0);
}

testConflict();
