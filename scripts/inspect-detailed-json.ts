import * as fs from 'fs';
import * as path from 'path';

const file = path.resolve(__dirname, '../../bfilmy-repos/data2026/daily/data/2026/06-04_finaldetailed.json');
if (fs.existsSync(file)) {
  const content = fs.readFileSync(file, 'utf8');
  const parsed = JSON.parse(content);
  const data = parsed.data;
  
  let totalB = 0;
  let emptySessionIdB = 0;
  let totalD = 0;
  let emptySessionIdD = 0;
  
  for (const item of data) {
    if (item.s === 'B') {
      totalB++;
      if (!item.session_id) {
        emptySessionIdB++;
      }
    } else if (item.s === 'D') {
      totalD++;
      if (!item.session_id) {
        emptySessionIdD++;
      }
    }
  }
  
  console.log(`BMS (B): Total = ${totalB}, Empty session_id = ${emptySessionIdB}`);
  console.log(`District (D): Total = ${totalD}, Empty session_id = ${emptySessionIdD}`);
  
  // Let's print some sample session IDs for both B and D
  const sampleB = data.filter((i: any) => i.s === 'B' && i.session_id).slice(0, 3).map((i: any) => i.session_id);
  const sampleD = data.filter((i: any) => i.s === 'D' && i.session_id).slice(0, 3).map((i: any) => i.session_id);
  console.log('Sample BMS session_ids:', sampleB);
  console.log('Sample District session_ids:', sampleD);
} else {
  console.log('File does not exist');
}
