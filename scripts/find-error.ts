import * as fs from 'fs';
import * as path from 'path';

const file = '/home/pepper-salt/.gemini/antigravity/brain/13ca8f27-b344-4495-943f-2a735bbb8970/.system_generated/tasks/task-3373.log';
if (fs.existsSync(file)) {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    if (line.includes('Error inserting chunk') || line.includes('DrizzleQueryError') || line.includes('Failed query:')) {
      console.log(`L${idx + 1}: ${line}`);
      // Log next 15 lines
      for (let i = 1; i <= 15; i++) {
        if (lines[idx + i]) {
          console.log(`  L${idx + i + 1}: ${lines[idx + i]}`);
        }
      }
      console.log('---');
    }
  });
} else {
  console.log('File does not exist');
}
