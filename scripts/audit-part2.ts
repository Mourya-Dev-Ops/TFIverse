import { config } from "dotenv";
config({ path: ".env.local" });

async function run() {
  const { db } = await import("../src/lib/db");
  const { sql } = await import("drizzle-orm");

  // Credits
  const totalCredits = await db.execute(sql`SELECT count(*) as cnt FROM movie_credits`);
  const moviesWithCredits = await db.execute(sql`SELECT count(distinct movie_id) as cnt FROM movie_credits`);
  console.log("CREDITS total:", (totalCredits as any)[0]?.cnt);
  console.log("CREDITS movies covered:", (moviesWithCredits as any)[0]?.cnt);

  // OTT providers
  const providers = await db.execute(sql`SELECT provider_name, count(*) as cnt FROM movie_ott_links GROUP BY provider_name ORDER BY cnt DESC LIMIT 15`);
  console.log("\nOTT PROVIDERS:");
  for (const p of providers as any[]) {
    console.log(`  ${p.provider_name}: ${p.cnt}`);
  }

  // All tables
  const tables = await db.execute(sql`SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename`);
  console.log("\nALL TABLES:");
  for (const t of tables as any[]) {
    console.log(`  ${t.tablename}`);
  }

  // Check for users table
  const users = await db.execute(sql`SELECT count(*) as cnt FROM users`);
  console.log("\nUSERS count:", (users as any)[0]?.cnt);

  // Memes
  const memes = await db.execute(sql`SELECT count(*) as cnt FROM memes`);
  console.log("MEMES count:", (memes as any)[0]?.cnt);

  // Tier lists
  try {
    const tiers = await db.execute(sql`SELECT count(*) as cnt FROM tier_lists`);
    console.log("TIER LISTS count:", (tiers as any)[0]?.cnt);
  } catch (e) {
    console.log("TIER LISTS: table not found");
  }

  // Rumors
  const rumors = await db.execute(sql`SELECT count(*) as cnt FROM rumors`);
  console.log("RUMORS count:", (rumors as any)[0]?.cnt);

  // People follows
  const follows = await db.execute(sql`SELECT count(*) as cnt FROM people_follows`);
  console.log("PEOPLE FOLLOWS count:", (follows as any)[0]?.cnt);

  // Check heroes.json duplication issue
  const heroesOld = await db.execute(sql`SELECT count(*) as cnt FROM people WHERE category = 'heroes'`);
  console.log("\nPEOPLE with category='heroes' (stale):", (heroesOld as any)[0]?.cnt);

  // 9 heroes without subcategory
  const heroesNoSub = await db.execute(sql`SELECT name, slug, subcategory FROM people WHERE category = 'hero' AND subcategory IS NULL`);
  console.log("\nHEROES without subcategory:");
  for (const h of heroesNoSub as any[]) {
    console.log(`  ${h.name} (${h.slug}) - subcategory: ${h.subcategory}`);
  }

  process.exit(0);
}

run().catch(err => {
  console.error("Audit part2 failed:", err.message);
  process.exit(1);
});
