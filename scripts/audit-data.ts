/**
 * TFIverse Data Audit Script
 * Comprehensive check of all data layers before public launch.
 */
import { config } from "dotenv";
config({ path: ".env.local" });

async function run() {
  const { db } = await import("../src/lib/db");
  const { people, movies, movieOttLinks, movieCredits } = await import("../src/lib/schema");
  const { sql, ne, eq, isNull, isNotNull } = await import("drizzle-orm");

  console.log("\n╔══════════════════════════════════════════════════════════╗");
  console.log("║  🔍 TFIverse FULL DATA AUDIT                            ║");
  console.log("╚══════════════════════════════════════════════════════════╝\n");

  // ═══════════════════════════════════════════════════
  // 1. PEOPLE TABLE
  // ═══════════════════════════════════════════════════
  console.log("═══ 1. PEOPLE TABLE ═══");
  const cats = await db.select({ category: people.category, count: sql<number>`count(*)` }).from(people).groupBy(people.category).orderBy(people.category);
  console.log("\nCategory Breakdown:");
  let totalPeople = 0;
  for (const c of cats) {
    console.log(`  ${c.category}: ${c.count}`);
    totalPeople += Number(c.count);
  }
  console.log(`  TOTAL: ${totalPeople}`);

  // Subcategory detail for non-crew
  const subcats = await db.select({ category: people.category, subcategory: people.subcategory, count: sql<number>`count(*)` }).from(people).where(ne(people.category, 'crew')).groupBy(people.category, people.subcategory).orderBy(people.category, people.subcategory);
  console.log("\nNon-Crew Subcategory Detail:");
  for (const s of subcats) {
    console.log(`  ${s.category} / ${s.subcategory || '(none)'}: ${s.count}`);
  }

  // Check which category pages have data
  const categoryRoutes = ["hero", "heroine", "director", "music-director", "villain", "comedian", "character-artist", "singer", "producer", "cinematographer", "editor", "lyricist", "choreographer", "stunt-director", "art-director", "costume-designer", "line-producer", "vfx-supervisor", "pro"];
  console.log("\nCategory Route Coverage:");
  for (const route of categoryRoutes) {
    const [result] = await db.select({ count: sql<number>`count(*)` }).from(people).where(eq(people.category, route));
    const count = Number(result.count);
    const status = count > 0 ? `✅ ${count} profiles` : "❌ EMPTY";
    console.log(`  /icons/${route}s → ${status}`);
  }

  // People with images vs without
  const withImages = await db.select({ count: sql<number>`count(*)` }).from(people).where(sql`${people.metadata}->>'images' IS NOT NULL AND ${people.category} != 'crew'`);
  const noImages = await db.select({ count: sql<number>`count(*)` }).from(people).where(sql`(${people.metadata}->>'images' IS NULL) AND ${people.category} != 'crew'`);
  console.log(`\nProfile Image Coverage (non-crew):`);
  console.log(`  With images: ${withImages[0].count}`);
  console.log(`  Without images: ${noImages[0].count}`);

  // Heroes from heroes.json (duplicate category='heroes')
  const heroesOld = await db.select({ count: sql<number>`count(*)` }).from(people).where(eq(people.category, 'heroes'));
  if (Number(heroesOld[0].count) > 0) {
    console.log(`\n⚠️  WARNING: ${heroesOld[0].count} people still have category='heroes' (should be 'hero')`);
  }

  // ═══════════════════════════════════════════════════
  // 2. MOVIES TABLE
  // ═══════════════════════════════════════════════════
  console.log("\n═══ 2. MOVIES TABLE ═══");
  const totalMovies = await db.select({ count: sql<number>`count(*)` }).from(movies);
  console.log(`Total movies: ${totalMovies[0].count}`);

  const withPoster = await db.select({ count: sql<number>`count(*)` }).from(movies).where(isNotNull(movies.posterUrl));
  const withBackdrop = await db.select({ count: sql<number>`count(*)` }).from(movies).where(isNotNull(movies.backdropUrl));
  const withTrailer = await db.select({ count: sql<number>`count(*)` }).from(movies).where(isNotNull(movies.trailerUrl));
  const withOverview = await db.select({ count: sql<number>`count(*)` }).from(movies).where(isNotNull(movies.overview));
  console.log(`With poster: ${withPoster[0].count}`);
  console.log(`With backdrop: ${withBackdrop[0].count}`);
  console.log(`With trailer: ${withTrailer[0].count}`);
  console.log(`With overview: ${withOverview[0].count}`);

  // Year distribution
  const yearDist = await db.select({ year: movies.year, count: sql<number>`count(*)` }).from(movies).where(isNotNull(movies.year)).groupBy(movies.year).orderBy(sql`year DESC`).limit(10);
  console.log("\nTop 10 Years (most recent):");
  for (const y of yearDist) {
    console.log(`  ${y.year}: ${y.count} movies`);
  }

  // Status breakdown
  const statuses = await db.select({ status: movies.status, count: sql<number>`count(*)` }).from(movies).groupBy(movies.status);
  console.log("\nMovie Status Breakdown:");
  for (const s of statuses) {
    console.log(`  ${s.status || '(null)'}: ${s.count}`);
  }

  // ═══════════════════════════════════════════════════
  // 3. OTT LINKS
  // ═══════════════════════════════════════════════════
  console.log("\n═══ 3. OTT LINKS ═══");
  const totalLinks = await db.select({ count: sql<number>`count(*)` }).from(movieOttLinks);
  const uniqueMoviesWithLinks = await db.select({ count: sql<number>`count(distinct ${movieOttLinks.movieId})` }).from(movieOttLinks);
  const synced = await db.select({ count: sql<number>`count(*)` }).from(movies).where(isNotNull(movies.lastOttSyncAt));
  const notSynced = await db.select({ count: sql<number>`count(*)` }).from(movies).where(isNull(movies.lastOttSyncAt));
  console.log(`Total OTT links: ${totalLinks[0].count}`);
  console.log(`Movies with OTT links: ${uniqueMoviesWithLinks[0].count}`);
  console.log(`Movies with lastOttSyncAt set: ${synced[0].count}`);
  console.log(`Movies NOT yet synced: ${notSynced[0].count}`);

  // Provider breakdown
  const providers = await db.select({ provider: movieOttLinks.providerName, count: sql<number>`count(*)` }).from(movieOttLinks).groupBy(movieOttLinks.providerName).orderBy(sql`count(*) DESC`).limit(15);
  console.log("\nTop OTT Providers:");
  for (const p of providers) {
    console.log(`  ${p.provider}: ${p.count} links`);
  }

  // ═══════════════════════════════════════════════════
  // 4. CREDITS TABLE
  // ═══════════════════════════════════════════════════
  console.log("\n═══ 4. CREDITS TABLE ═══");
  const totalCredits = await db.select({ count: sql<number>`count(*)` }).from(movieCredits);
  const moviesWithCredits = await db.select({ count: sql<number>`count(distinct ${movieCredits.movieId})` }).from(movieCredits);
  console.log(`Total credits: ${totalCredits[0].count}`);
  console.log(`Movies with credits: ${moviesWithCredits[0].count}`);

  // ═══════════════════════════════════════════════════
  // 5. FEATURE GAPS / RISKS
  // ═══════════════════════════════════════════════════
  console.log("\n═══ 5. FEATURE GAP ANALYSIS ═══");
  
  // Movies without any credits
  const moviesNoCredits = Number(totalMovies[0].count) - Number(moviesWithCredits[0].count);
  console.log(`Movies without credits linked: ${moviesNoCredits}`);
  
  // Movies without slug
  const noSlug = await db.select({ count: sql<number>`count(*)` }).from(movies).where(sql`slug IS NULL OR slug = ''`);
  console.log(`Movies without slug (broken URLs): ${noSlug[0].count}`);

  // People without slug
  const noSlugPeople = await db.select({ count: sql<number>`count(*)` }).from(people).where(sql`slug IS NULL OR slug = ''`);
  console.log(`People without slug (broken URLs): ${noSlugPeople[0].count}`);

  console.log("\n═══ AUDIT COMPLETE ═══\n");
  process.exit(0);
}

run().catch(err => {
  console.error("Audit failed:", err);
  process.exit(1);
});
