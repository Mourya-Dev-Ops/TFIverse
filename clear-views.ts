import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import "dotenv/config";

const client = postgres(process.env.DATABASE_URL!);
const db = drizzle(client);

async function main() {
  await client`DELETE FROM meme_views`;
  await client`DELETE FROM meme_likes`;
  console.log("Cleared views and likes");
  process.exit(0);
}
main();
