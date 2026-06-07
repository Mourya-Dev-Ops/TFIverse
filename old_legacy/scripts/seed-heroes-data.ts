import { db } from '@/lib/db';
import { heroes, heroMovies } from '@/lib/schema';
import fs from 'fs';
import path from 'path';

// Update path to public/data/heroes
const DATA_DIR = path.join(process.cwd(), 'public', 'data', 'heroes');

async function seedHeroes() {
  try {
    console.log('🌱 Migrating heroes...');
    const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));
    
    console.log(`📁 Found ${files.length} hero files`);

    for (const file of files) {
      const slug = file.replace('.json', '');
      const heroData = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf-8'));

      const [hero] = await db.insert(heroes).values({
        slug,
        data: heroData,
      }).returning();

      console.log(`✅ ${slug} (ID: ${hero.id})`);

      if (heroData.filmography?.length) {
        for (const movie of heroData.filmography) {
          try {
            await db.insert(heroMovies).values({
              heroId: hero.id,
              title: movie.title || 'Unknown',
              year: movie.year ? parseInt(movie.year) : null,
              role: movie.role || 'Lead',
              character: movie.character || null,
            });
          } catch (e) {
            // Skip duplicates
          }
        }
      }
    }

    console.log('\n✅ Migration Complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

seedHeroes();
