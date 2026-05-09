// scripts/generate-people-index.js
const fs = require('fs');
const path = require('path');

// ============================================
// CONFIGURATION
// ============================================

const PEOPLE_DIR = path.join(process.cwd(), 'public', 'data', 'people');
const OUTPUT_FILE = path.join(process.cwd(), 'public', 'data', 'people.json');

const CATEGORY_ORDER = {
  'legends': 1,
  'superstar': 2,
  'rising-stars': 3
};

// ============================================
// MAIN FUNCTION
// ============================================

async function generatePeopleIndex() {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║  👥 PEOPLE INDEX GENERATOR v1.0                           ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  if (!fs.existsSync(PEOPLE_DIR)) {
    console.error(`❌ Error: People directory not found: ${PEOPLE_DIR}`);
    console.error('Please create public/data/people/ and add hero JSON files.\n');
    process.exit(1);
  }

  console.log('🔍 Scanning people directory...\n');

  const files = fs.readdirSync(PEOPLE_DIR).filter(f => f.endsWith('.json'));

  console.log(`✅ Found ${files.length} people files\n`);

  const categoryStats = {
    actor: { legends: 0, superstar: 0, 'rising-stars': 0 },
    actress: { legends: 0, superstar: 0, 'rising-stars': 0 },
    director: 0,
    producer: 0,
    'music-director': 0,
    comedian: 0,
    villain: 0,
    'character-artist': 0,
    cinematographer: 0,
    lyricist: 0,
    choreographer: 0,
    editor: 0,
    'art-director': 0,
    singer: 0,
    other: 0
  };

  const people = [];

  console.log('📋 Processing files...\n');

  for (const file of files) {
    try {
      const filePath = path.join(PEOPLE_DIR, file);
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

      // Build person entry
      const person = {
        id: data.id,
        name: data.name,
        slug: data.slug,
        title: data.title || null,
        type: data.type,
        category: data.category || null,
        portrait: data.images?.portrait?.url || null,
        tmdbPersonId: data.tmdbPersonId || null,
        moviesCount: data.movies?.length || 0,
        debutYear: data.personalInfo?.debutYear || null,
        popularity: data.popularity || 0,
        verified: data.meta?.completeness >= 90
      };

      people.push(person);

      // Update stats
      if (data.type === 'actor' || data.type === 'actress') {
        if (data.category && categoryStats[data.type][data.category] !== undefined) {
          categoryStats[data.type][data.category]++;
        }
      } else {
        if (categoryStats[data.type] !== undefined) {
          categoryStats[data.type]++;
        }
      }

      console.log(`✓ ${data.name} (${data.type})`);
    } catch (error) {
      console.error(`❌ Error processing ${file}:`, error.message);
    }
  }

  // Sort people
  people.sort((a, b) => {
    // Sort by category order first (legends, superstars, rising-stars)
    const catOrderA = CATEGORY_ORDER[a.category] || 99;
    const catOrderB = CATEGORY_ORDER[b.category] || 99;
    if (catOrderA !== catOrderB) return catOrderA - catOrderB;

    // Then by popularity
    if (b.popularity !== a.popularity) return b.popularity - a.popularity;

    // Then by name
    return a.name.localeCompare(b.name);
  });

  // Build index
  const index = {
    total: people.length,
    lastUpdated: new Date().toISOString(),
    categories: {
      actor: {
        legends: categoryStats.actor.legends,
        superstar: categoryStats.actor.superstar,
        risingStars: categoryStats.actor['rising-stars'],
        total: categoryStats.actor.legends + categoryStats.actor.superstar + categoryStats.actor['rising-stars']
      },
      actress: {
        legends: categoryStats.actress.legends,
        superstar: categoryStats.actress.superstar,
        risingStars: categoryStats.actress['rising-stars'],
        total: categoryStats.actress.legends + categoryStats.actress.superstar + categoryStats.actress['rising-stars']
      },
      director: categoryStats.director,
      producer: categoryStats.producer,
      musicDirector: categoryStats['music-director'],
      comedian: categoryStats.comedian,
      villain: categoryStats.villain,
      characterArtist: categoryStats['character-artist'],
      cinematographer: categoryStats.cinematographer,
      lyricist: categoryStats.lyricist,
      choreographer: categoryStats.choreographer,
      editor: categoryStats.editor,
      artDirector: categoryStats['art-director'],
      singer: categoryStats.singer,
      other: categoryStats.other
    },
    people: people
  };

  // Save to file
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(index, null, 2));

  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('✅ PEOPLE INDEX GENERATED!');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`📊 Total People: ${index.total}`);
  console.log(`🎬 Actors: ${index.categories.actor.total}`);
  console.log(`   ├─ Legends: ${index.categories.actor.legends}`);
  console.log(`   ├─ Superstars: ${index.categories.actor.superstar}`);
  console.log(`   └─ Rising Stars: ${index.categories.actor.risingStars}`);
  console.log(`👩 Actresses: ${index.categories.actress.total}`);
  console.log(`🎥 Directors: ${index.categories.director}`);
  console.log(`💾 Saved to: ${OUTPUT_FILE}\n`);
}

// Run
generatePeopleIndex().catch(error => {
  console.error('\n❌ FATAL ERROR:', error.message);
  process.exit(1);
});
