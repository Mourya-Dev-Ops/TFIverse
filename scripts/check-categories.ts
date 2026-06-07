import { db } from '../src/lib/db';
import { sql } from 'drizzle-orm';

async function main() {
  const result = await db.execute(sql`SELECT DISTINCT category, count(*) as cnt FROM people GROUP BY category ORDER BY cnt DESC`);
  console.log("Categories in DB:", result.rows || result);
  process.exit(0);
}
main();
