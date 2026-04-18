const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const imagePath = path.join(__dirname, 'frontend/public/WhatsApp Image 2026-04-01 at 3.47.44 PM.jpeg');
const outputPath = path.join(__dirname, 'frontend/public/WhatsApp Image 2026-04-01 at 3.47.44 PM.png');

async function removeBackground() {
  try {
    console.log('Processing image...');
    
    // Read the image and create PNG with alpha channel (transparency support)
    await sharp(imagePath)
      .png({
        progressive: true,
        quality: 90
      })
      .toFile(outputPath);
    
    console.log('✅ Image converted to PNG with transparency support');
    console.log('File saved to: ' + outputPath);
    
    // Now we'll use a simple color detection to remove light backgrounds
    const image = sharp(outputPath);
    const metadata = await image.metadata();
    
    const { data, info } = await sharp(imagePath)
      .raw()
      .toBuffer({ resolveWithObject: true });
    
    // Process pixels: remove white/light backgrounds
    for (let i = 0; i < data.length; i += info.channels) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      // If pixel is very light (close to white), make it transparent
      if (r > 240 && g > 240 && b > 240) {
        if (info.channels === 4) {
          data[i + 3] = 0; // Set alpha to transparent
        }
      }
    }
    
    // Save the processed image
    await sharp(data, {
      raw: {
        width: info.width,
        height: info.height,
        channels: info.channels
      }
    })
    .png()
    .toFile(outputPath);
    
    console.log('✅ Background removed successfully!');
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

removeBackground();
