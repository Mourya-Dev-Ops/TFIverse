import * as fs from 'fs';
import * as path from 'path';

function searchFile(dir: string, fileName: string) {
  const fullPath = path.join(dir, fileName);
  if (fileName === 'node_modules' || fileName === '.git' || fileName === '.next') {
    return;
  }
  try {
    const stats = fs.statSync(fullPath);
    if (stats.isDirectory()) {
      const files = fs.readdirSync(fullPath);
      for (const file of files) {
        searchFile(fullPath, file);
      }
    } else if (stats.isFile()) {
      if (stats.size > 1024 * 1024) return; // skip files larger than 1MB
      if (fileName.endsWith('.js') || fileName.endsWith('.ts') || fileName.endsWith('.py') || fileName.endsWith('.env') || fileName.startsWith('.env') || fileName === 'config.yml' || fileName === 'main.yml') {
        const content = fs.readFileSync(fullPath, 'utf8');
        if (content.includes('WORKER_KEY') || content.includes('WORKER_UA') || content.includes('text2026mail.workers.dev') || content.includes('text2024mail.workers.dev')) {
          console.log(`Found pattern in: ${fullPath}`);
          const lines = content.split('\n');
          lines.forEach((line, idx) => {
            if (line.includes('WORKER_') || line.includes('workers.dev') || line.includes('x-api-key')) {
              console.log(`  L${idx + 1}: ${line.trim()}`);
            }
          });
        }
      }
    }
  } catch (err) {
    // Ignore errors
  }
}

console.log('Searching for WORKER_KEY and workers.dev...');
searchFile('/home/pepper-salt/.gemini/antigravity/scratch/tfiverse', '');
console.log('Search finished.');
