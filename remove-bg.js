const fs = require('fs');
const path = require('path');
const https = require('https');

// Install required package
const { execSync } = require('child_process');

try {
  console.log('Installing required packages...');
  execSync('npm install jimp --save', { cwd: __dirname, stdio: 'inherit' });
  
  const Jimp = require('jimp');
  
  const imagePath = path.join(__dirname, 'frontend/public/WhatsApp Image 2026-04-01 at 3.47.44 PM.jpeg');
  const outputPath = path.join(__dirname, 'frontend/public/WhatsApp Image 2026-04-01 at 3.47.44 PM.png');
  
  console.log('Processing image...');
  
  Jimp.read(imagePath, async (err, image) => {
    if (err) throw err;
    
    // Simple background removal: detect and remove white/light backgrounds
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
      // Get RGB values
      const r = this.bitmap.data[idx];
      const g = this.bitmap.data[idx + 1];
      const b = this.bitmap.data[idx + 2];
      const a = this.bitmap.data[idx + 3];
      
      // Check if pixel is close to white or light color (background)
      if (r > 240 && g > 240 && b > 240) {
        // Make it transparent
        this.bitmap.data[idx + 3] = 0;
      }
    });
    
    image.write(outputPath, () => {
      console.log('✅ Background removed! Image saved as PNG with transparency');
      console.log('File: ' + outputPath);
    });
  });
  
} catch (error) {
  console.error('Error:', error.message);
  console.log('\nTrying alternative method with Python...');
}
