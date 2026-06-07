import { db } from './src/lib/db';
import { movies, movieCredits, people } from './src/lib/schema';
import { eq, like, inArray } from 'drizzle-orm';

async function check() {
  const [movie] = await db.select({ id: movies.id }).from(movies).where(like(movies.slug, '%salaar%')).limit(1);
  console.log('Local Movie ID:', movie.id);
  
  const credits = await db.select({ 
      personId: movieCredits.personId, 
      orderIndex: movieCredits.orderIndex,
      name: people.name
  })
  .from(movieCredits)
  .leftJoin(people, eq(people.id, movieCredits.personId))
  .where(eq(movieCredits.movieId, movie.id))
  .limit(10);
  
  console.log('Credits:', credits);
  process.exit(0);
}
check();
