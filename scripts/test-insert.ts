import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

import { db } from '../src/lib/db';
import { realtimeSessions } from '../src/lib/schema/tracking';
import { movies } from '../src/lib/schema/content';

async function testInsert() {
  try {
    // get a movie
    const [movie] = await db.select({ id: movies.id }).from(movies).limit(1);
    if (!movie) {
      console.log('No movies found in database.');
      return;
    }
    
    console.log(`Inserting test session for movie ID: ${movie.id}`);
    
    const res = await db.insert(realtimeSessions).values({
      movieId: movie.id,
      sessionId: 'TEST_SESSION_123',
      venueName: 'Test Venue',
      chainName: 'Test Chain',
      city: 'Test City',
      state: 'Test State',
      showDate: new Date(),
      showTime: '10:00 AM',
      audi: 'Audi 1',
      totalSeats: 100,
      availableSeats: 80,
      soldSeats: 20,
      grossRevenue: 2000,
      source: 'BMS',
      lastUpdated: new Date()
    });
    
    console.log('Insert success!', res);
  } catch (err: any) {
    console.error('Insert failed with error:');
    console.error(err);
    if (err.stack) {
      console.error(err.stack);
    }
  }
  process.exit(0);
}

testInsert();
