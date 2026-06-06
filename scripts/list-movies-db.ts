import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

import { db } from '../src/lib/db';
import { movies } from '../src/lib/schema/content';

async function listMovies() {
  try {
    const list = await db.select({
      id: movies.id,
      title: movies.title,
      slug: movies.slug,
      releaseDate: movies.releaseDate
    }).from(movies).limit(50);
    console.log(`Found ${list.length} movies:`);
    list.forEach(m => {
      console.log(`- [${m.id}] ${m.title} (${m.slug}) - ${m.releaseDate}`);
    });
  } catch (err) {
    console.error('Error listing movies:', err);
  }
  process.exit(0);
}
listMovies();
