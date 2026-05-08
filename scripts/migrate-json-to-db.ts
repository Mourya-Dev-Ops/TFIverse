/**
 * migrate-json-to-db.ts
 * 
 * Idempotent migration script: JSON → PostgreSQL
 * Safe to run multiple times. Uses ON CONFLICT (upsert) to prevent duplicates.
 * 
 * Usage: npx tsx scripts/migrate-json-to-db.ts
 */

import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { sql } from 'drizzle-orm';
import * as fs from 'fs';
import * as path from 'path';

// ============================================================================
// DB CONNECTION
// ============================================================================

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL not set. Aborting.');
  process.exit(1);
}

const client = postgres(DATABASE_URL, { max: 5 });
const db = drizzle(client);

// ============================================================================
// HELPERS
// ============================================================================

function loadJson<T>(filePath: string): T {
  const absolute = path.resolve(__dirname, '..', filePath);
  const raw = fs.readFileSync(absolute, 'utf-8');
  return JSON.parse(raw) as T;
}

function slugToId(slug: string): string {
  return slug.toLowerCase().replace(/[^a-z0-9-]/g, '');
}

const log = {
  info: (msg: string) => console.log(`  ℹ️  ${msg}`),
  ok: (msg: string) => console.log(`  ✅ ${msg}`),
  warn: (msg: string) => console.log(`  ⚠️  ${msg}`),
  err: (msg: string) => console.error(`  ❌ ${msg}`),
  header: (msg: string) => console.log(`\n${'═'.repeat(60)}\n  ${msg}\n${'═'.repeat(60)}`),
};

// ============================================================================
// 1. MIGRATE HEROES → people TABLE
// ============================================================================

async function migrateHeroes() {
  log.header('MIGRATING heroes.json → people');
  
  const heroes = loadJson<any[]>('src/data/heroes.json');
  let inserted = 0;
  let updated = 0;
  let skipped = 0;

  for (const hero of heroes) {
    const id = slugToId(hero.slug);
    const slug = hero.slug;
    const name = hero.name;
    const category = 'heroes';
    const subcategory = hero.category || hero.subcategory || null;

    try {
      const result = await db.execute(sql`
        INSERT INTO people (id, name, slug, category, subcategory, metadata, created_at, updated_at)
        VALUES (${id}, ${name}, ${slug}, ${category}, ${subcategory}, ${JSON.stringify(hero)}::jsonb, NOW(), NOW())
        ON CONFLICT (id) DO UPDATE SET
          metadata = ${JSON.stringify(hero)}::jsonb,
          updated_at = NOW()
        RETURNING (xmax = 0) AS is_insert
      `);
      
      const isInsert = (result as any)[0]?.is_insert;
      if (isInsert) {
        inserted++;
      } else {
        updated++;
      }
    } catch (err: any) {
      log.err(`Failed to upsert hero "${name}" (${id}): ${err.message}`);
      skipped++;
    }
  }

  log.ok(`Heroes: ${inserted} inserted, ${updated} updated, ${skipped} skipped`);
}

// ============================================================================
// 2. MIGRATE RUMORS → rumors TABLE
// ============================================================================

async function migrateRumors() {
  log.header('MIGRATING rumors.json → rumors');
  
  const rumorsData = loadJson<any[]>('src/data/rumors.json');
  let inserted = 0;
  let skipped = 0;

  for (const rumor of rumorsData) {
    try {
      // Check if this exact rumor already exists (by title match)
      const existing = await db.execute(sql`
        SELECT id FROM rumors WHERE title = ${rumor.title} LIMIT 1
      `);

      if ((existing as any[]).length > 0) {
        skipped++;
        continue;
      }

      await db.execute(sql`
        INSERT INTO rumors (title, summary, status, source, url, created_at)
        VALUES (${rumor.title}, ${rumor.summary}, ${rumor.status}, ${rumor.source || null}, ${rumor.url || null}, NOW())
      `);
      inserted++;
    } catch (err: any) {
      log.err(`Failed to insert rumor "${rumor.title}": ${err.message}`);
      skipped++;
    }
  }

  log.ok(`Rumors: ${inserted} inserted, ${skipped} skipped (already exist or errored)`);
}

// ============================================================================
// 3. VALIDATE MEMES — DO NOT MIGRATE (they use userId: "system")
// ============================================================================
// The memes.json contains dummy seed data with `userId: "system"`. These
// are NOT real user-generated memes. They violate the UUID FK constraint on
// the users table. We flag them as deprecated seed data.

function reportMemes() {
  log.header('MEMES.JSON — VALIDATION ONLY (NOT MIGRATED)');
  
  const memesData = loadJson<any[]>('src/data/memes.json');
  
  log.warn(`Found ${memesData.length} dummy memes with userId: "system".`);
  log.warn(`These are placeholder seed data and CANNOT be migrated to the DB.`);
  log.warn(`The memes table uses UUID FKs to the users table.`);
  log.info(`Action: These should be replaced by real user-generated memes after launch.`);
  log.info(`The getMemes() fallback to memes.json will be removed.`);
}

// ============================================================================
// 4. VALIDATE UPCOMING — DO NOT MIGRATE (missing required tmdbId)
// ============================================================================

function reportUpcoming() {
  log.header('UPCOMING.JSON — VALIDATION ONLY (NOT MIGRATED)');
  
  const upcomingData = loadJson<any[]>('src/data/upcoming.json');
  
  const withTmdb = upcomingData.filter(m => m.tmdbId);
  const withoutTmdb = upcomingData.filter(m => !m.tmdbId);
  
  log.info(`Total upcoming entries: ${upcomingData.length}`);
  log.ok(`${withTmdb.length} have TMDB IDs (potentially migratable)`);
  log.warn(`${withoutTmdb.length} are missing TMDB IDs (CANNOT be inserted into movies table)`);
  
  withoutTmdb.forEach(m => {
    log.warn(`  → "${m.title}" by ${m.director} — missing tmdbId`);
  });
  
  log.info(`Action: upcoming.json should be replaced by querying the movies table with status filtering.`);
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

async function main() {
  console.log('\n🚀 TFIverse JSON → PostgreSQL Migration');
  console.log(`   Database: ${DATABASE_URL?.split('@')[1]?.split('/')[0] || '***'}`);
  console.log(`   Timestamp: ${new Date().toISOString()}`);
  
  try {
    await migrateHeroes();
    await migrateRumors();
    reportMemes();
    reportUpcoming();
    
    log.header('MIGRATION SUMMARY');
    log.ok('heroes.json → people table: DONE (upserted)');
    log.ok('rumors.json → rumors table: DONE (deduplicated)');
    log.warn('memes.json → NOT MIGRATED (dummy seed data with invalid userId)');
    log.warn('upcoming.json → NOT MIGRATED (missing required tmdbId fields)');
    log.info('');
    log.info('Next steps:');
    log.info('  1. Remove JSON fallback logic from page.tsx, memes.ts, tier-list pages');
    log.info('  2. Keep src/data/ folder for 48 hours as rollback insurance');
    log.info('  3. After verification, delete src/data/ and remove all imports');
    
  } catch (err) {
    console.error('\n💥 Migration failed:', err);
    process.exit(1);
  } finally {
    await client.end();
    console.log('\n🔌 Database connection closed.');
  }
}

main();
