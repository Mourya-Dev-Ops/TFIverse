// scripts/generate-recent-news.js
const fs = require('fs');
const path = require('path');

// ============================================
// CONFIGURATION
// ============================================

const PEOPLE_DIR = path.join(process.cwd(), 'public', 'data', 'people');
const OUTPUT_FILE = path.join(process.cwd(), 'public', 'data', 'recent-news.json');

// ============================================
// MAIN FUNCTION
// ============================================

async function generateRecentNews() {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║  📰 RECENT NEWS GENERATOR v1.0                            ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  if (!fs.existsSync(PEOPLE_DIR)) {
    console.error(`❌ Error: People directory not found: ${PEOPLE_DIR}`);
    process.exit(1);
  }

  console.log('🔍 Scanning people files for recent news...\n');

  const files = fs.readdirSync(PEOPLE_DIR).filter(f => f.endsWith('.json'));
  const allNews = [];

  for (const file of files) {
    try {
      const filePath = path.join(PEOPLE_DIR, file);
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

      if (data.recentNews && Array.isArray(data.recentNews)) {
        for (const news of data.recentNews) {
          allNews.push({
            ...news,
            person: {
              name: data.name,
              slug: data.slug,
              portrait: data.images?.portrait?.url || null
            }
          });
        }
      }
    } catch (error) {
      console.error(`❌ Error processing ${file}:`, error.message);
    }
  }

  // Sort by date (newest first)
  allNews.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB - dateA;
  });

  // Keep only last 6 months
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const recentNews = allNews.filter(news => {
    return new Date(news.date) >= sixMonthsAgo;
  });

  const output = {
    total: recentNews.length,
    lastUpdated: new Date().toISOString(),
    cutoffDate: sixMonthsAgo.toISOString(),
    news: recentNews
  };

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));

  console.log('═══════════════════════════════════════════════════════════');
  console.log('✅ RECENT NEWS GENERATED!');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`📊 Total News Items: ${output.total}`);
  console.log(`📅 Cutoff Date: ${sixMonthsAgo.toLocaleDateString()}`);
  console.log(`💾 Saved to: ${OUTPUT_FILE}\n`);
}

// Run
generateRecentNews().catch(error => {
  console.error('\n❌ FATAL ERROR:', error.message);
  process.exit(1);
});
