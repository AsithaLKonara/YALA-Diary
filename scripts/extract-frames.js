const ffmpegPath = require('ffmpeg-static');
const { execFile } = require('child_process');
const fs = require('fs');
const path = require('path');

const videoPath = path.join(__dirname, '../public/videos/0921(2).mp4');
const outputDir = path.join(__dirname, '../public/frames/0921_2');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

console.log('Extracting frames with ffmpeg:', ffmpegPath);

const args = [
  '-i', videoPath,
  '-vf', 'fps=30',
  '-vframes', '150',
  '-q:v', '50',
  '-c:v', 'libwebp',
  path.join(outputDir, 'frame_%03d.webp')
];

execFile(ffmpegPath, args, (error, stdout, stderr) => {
  if (error) {
    console.error('Error extracting frames:', error);
    process.exit(1);
  }
  console.log('Successfully extracted frames.');
  
  const files = fs.readdirSync(outputDir).filter(f => f.endsWith('.webp'));
  console.log(`Created ${files.length} frames in ${outputDir}`);
});
