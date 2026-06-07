import * as fs from 'fs';
import * as path from 'path';

const file = path.resolve(__dirname, '../../bfilmy-repos/assetz/daily/logs/2026-06/monthlylogs.json');
if (fs.existsSync(file)) {
  const content = fs.readFileSync(file, 'utf8');
  const data = JSON.parse(content);
  console.log('Type of data:', typeof data, Array.isArray(data) ? 'Array' : 'Object');
  const keys = Object.keys(data);
  console.log('Total movies in logs:', keys.length);
  console.log('First 5 movies:', keys.slice(0, 5));
  const firstMovie = keys[0];
  if (firstMovie) {
    console.log(`Sample logs for movie "${firstMovie}":`, JSON.stringify(data[firstMovie], null, 2));
  }
} else {
  console.log('File does not exist:', file);
}
