import ffmpeg from 'ffmpeg-static';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const input = "public/videos/Timeline1-ezgif.com-video-cutter.mov";
const outputDir = "public/images/bb2newwebp";

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

console.log("Starting high-res (1920px) frame extraction...");
console.log(`Using ffmpeg at: ${ffmpeg}`);

const cmd = `"${ffmpeg}" -y -i "${input}" -vf "fps=12,scale=1920:-1" -c:v libwebp -lossless 0 -compression_level 6 -q:v 80 "${outputDir}/frame_%03d_delay-0.071s.webp"`;

try {
  execSync(cmd, { stdio: 'inherit' });
  console.log("SUCCESS: 1920px WebP frames generated in " + outputDir);
} catch (error) {
  console.error("Extraction failed:", error);
  process.exit(1);
}
