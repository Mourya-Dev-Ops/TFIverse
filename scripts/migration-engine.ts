import { config } from "dotenv";
config({ path: ".env" }); // Load from .env

import fs from "fs/promises";
import path from "path";

async function run() {
  console.log("🚀 Starting TFIverse Migration Engine...");
  
  // Dynamically import db and schema to avoid hoisting issues with dotenv
  const { db } = await import("../src/lib/db");
  const { people } = await import("../src/lib/schema");
  
  const dataDir = path.join(process.cwd(), "public", "data");
  let totalMigrated = 0;
  let totalErrors = 0;

  async function processDirectory(currentPath: string) {
    try {
      const entries = await fs.readdir(currentPath, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(currentPath, entry.name);
        
        if (entry.isDirectory()) {
          await processDirectory(fullPath);
        } else if (entry.name.endsWith(".json")) {
          try {
            const fileContent = await fs.readFile(fullPath, "utf-8");
            const data = JSON.parse(fileContent);
            
            if (!data.id || !data.slug || !data.name) {
               console.log(`⚠️ Skipping ${entry.name} - Missing core fields (id, slug, name)`);
               totalErrors++;
               continue;
            }

            const category = data.metadata?.category || data.category || "unknown";
            const subcategory = data.metadata?.subCategory || data.subCategory || "unknown";

            // Upsert into PostgreSQL
            await db.insert(people).values({
              id: data.id,
              name: data.name,
              slug: data.slug,
              tmdbPersonId: data.tmdbPersonId || null,
              imdbId: data.imdbId || null,
              category: category,
              subcategory: subcategory,
              metadata: data, // Store the entire JSON safely in JSONB
            }).onConflictDoUpdate({
              target: people.id,
              set: {
                name: data.name,
                slug: data.slug,
                tmdbPersonId: data.tmdbPersonId || null,
                imdbId: data.imdbId || null,
                category: category,
                subcategory: subcategory,
                metadata: data,
                updatedAt: new Date(),
              }
            });

            console.log(`✅ Migrated: ${data.name} (${category} -> ${subcategory})`);
            totalMigrated++;
          } catch (error: any) {
            console.error(`❌ ERROR processing ${fullPath}:`, error.message);
            totalErrors++;
          }
        }
      }
    } catch (e: any) {
      // Directory might not exist or be accessible, skip silently
      if (e.code !== 'ENOENT') {
        console.error(`Error reading directory ${currentPath}:`, e.message);
      }
    }
  }

  await processDirectory(dataDir);
  console.log(`\n🎉 Migration Complete!`);
  console.log(`Total Migrated: ${totalMigrated}`);
  console.log(`Total Errors/Skipped: ${totalErrors}`);
  process.exit(0);
}

run();
