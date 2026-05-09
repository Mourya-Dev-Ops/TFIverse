
// scripts/import-people.ts
// Imports/updates people from JSON files with smart ID matching

import 'dotenv/config';
import * as fs from 'fs';
import * as path from 'path';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { people, movieCredits } from '../lib/schema';
import { eq, or, sql } from 'drizzle-orm';

// Database connection
const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString);
const db = drizzle(client);

// Base path to JSON files
const DATA_PATH = path.join(process.cwd(), 'public', 'data');

// All categories
const CATEGORIES = [
  { folder: 'art-directors', mainCategory: 'art-director' },
  { folder: 'character-artists', mainCategory: 'character-artist' },
  { folder: 'choreographers', mainCategory: 'choreographer' },
  { folder: 'cinematographers', mainCategory: 'cinematographer' },
  { folder: 'comedians', mainCategory: 'comedian' },
  { folder: 'costume-designers', mainCategory: 'costume-designer' },
  { folder: 'directors', mainCategory: 'director' },
  { folder: 'editors', mainCategory: 'editor' },
  { folder: 'heroes', mainCategory: 'hero' },
  { folder: 'heroines', mainCategory: 'heroine' },
  { folder: 'line-producers', mainCategory: 'line-producer' },
  { folder: 'lyricists', mainCategory: 'lyricist' },
  { folder: 'music-directors', mainCategory: 'music-director' },
  { folder: 'producers', mainCategory: 'producer' },
  { folder: 'pros', mainCategory: 'pro' },
  { folder: 'singers', mainCategory: 'singer' },
  { folder: 'stunt-directors', mainCategory: 'stunt-director' },
  { folder: 'vfx-supervisors', mainCategory: 'vfx-supervisor' },
  { folder: 'villains', mainCategory: 'villain' },
];

let totalInserted = 0;
let totalUpdated = 0;
let totalErrors = 0;

async function processFolder(folderPath: string, mainCategory: string, subcategory: string | null) {
  try {
    const files = fs.readdirSync(folderPath).filter(file => file.endsWith('.json'));
    if (files.length === 0) return;

    const subfolder = subcategory ? `${subcategory}/` : '';
    console.log(`   📄 ${subfolder}${files.length} files`);

    for (const file of files) {
      try {
        const filePath = path.join(folderPath, file);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(fileContent);

        const jsonId = data.id;
        const name = data.name;
        const slug = data.slug;
        const tmdbPersonId = data.tmdbPersonId || data.metadata?.tmdb_person_id || null;
        const imdbId = data.imdbId || data.metadata?.imdb_id || null;
        const category = data.metadata?.category || mainCategory;
        const subcategoryValue = data.metadata?.subCategory || subcategory || null;

        if (!jsonId || !name || !slug || !data.metadata) {
          console.error(`      ❌ Missing fields in ${file}`);
          totalErrors++;
          continue;
        }

        // 🔍 SMART LOOKUP: Find existing by tmdb_person_id OR name (NOT by JSON id)
        const existing = await db
          .select()
          .from(people)
          .where(
            or(
              tmdbPersonId ? eq(people.tmdbPersonId, tmdbPersonId) : undefined,
              sql`LOWER(${people.name}) = LOWER(${name})`
            )
          )
          .limit(1);

        if (existing.length > 0) {
          const dbId = existing[0].id;
          
          if (dbId !== jsonId) {
            // 🔄 ID MISMATCH - Need to relink everything
            console.log(`      🔄 ID mismatch: DB="${dbId}", JSON="${jsonId}"`);
            
            // 1. Update movie_credits to use correct ID from JSON
            const updateResult = await db
              .update(movieCredits)
              .set({ personId: jsonId })
              .where(eq(movieCredits.personId, dbId));
            
            // 2. Delete old stub record
            await db.delete(people).where(eq(people.id, dbId));
            
            // 3. Insert with correct ID from JSON
            await db.insert(people).values({
              id: jsonId,
              name,
              slug,
              tmdbPersonId,
              imdbId,
              category,
              subcategory: subcategoryValue,
              metadata: data,
            });
            
            console.log(`      ✅ Updated: ${name} (${dbId} → ${jsonId})`);
            totalUpdated++;
          } else {
            // ✅ IDs match - just update data
            await db
              .update(people)
              .set({
                name,
                slug,
                tmdbPersonId,
                imdbId,
                category,
                subcategory: subcategoryValue,
                metadata: data,
                updatedAt: new Date(),
              })
              .where(eq(people.id, dbId));
            
            console.log(`      ✅ Updated: ${name}`);
            totalUpdated++;
          }
        } else {
          // ✨ NEW PERSON - Insert
          await db.insert(people).values({
            id: jsonId,
            name,
            slug,
            tmdbPersonId,
            imdbId,
            category,
            subcategory: subcategoryValue,
            metadata: data,
          });
          
          console.log(`      ✅ Inserted: ${name}`);
          totalInserted++;
        }

      } catch (error: any) {
        totalErrors++;
        console.error(`      ❌ Error in ${file}:`, error.message);
      }
    }
  } catch (error: any) {
    console.error(`   ❌ Error reading folder:`, error.message);
  }
}

async function importPeople() {
  console.log('🚀 Starting people import...\n');
  console.log(`📂 Base path: ${DATA_PATH}\n`);

  for (const category of CATEGORIES) {
    const categoryPath = path.join(DATA_PATH, category.folder);

    if (!fs.existsSync(categoryPath)) {
      console.log(`⚠️  Folder not found: ${category.folder}`);
      continue;
    }

    console.log(`📁 Processing ${category.folder}...`);

    try {
      const items = fs.readdirSync(categoryPath, { withFileTypes: true });
      const subfolders = items.filter(d => d.isDirectory()).map(d => d.name);
      const jsonFiles = items.filter(d => d.isFile() && d.name.endsWith('.json'));

      // Process JSON files in category root
      if (jsonFiles.length > 0) {
        await processFolder(categoryPath, category.mainCategory, null);
      }

      // Process subfolders
      for (const subfolder of subfolders) {
        const subfolderPath = path.join(categoryPath, subfolder);
        await processFolder(subfolderPath, category.mainCategory, subfolder);
      }
    } catch (error: any) {
      console.error(`   ❌ Error:`, error.message);
    }

    console.log('');
  }

  console.log('═══════════════════════════════════════');
  console.log('✅ Import complete!');
  console.log(`   ✨ New records: ${totalInserted}`);
  console.log(`   🔄 Updated: ${totalUpdated}`);
  console.log(`   ❌ Errors: ${totalErrors}`);
  console.log('═══════════════════════════════════════\n');

  await client.end();
  process.exit(0);
}

// Run import
importPeople().catch((error) => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});
