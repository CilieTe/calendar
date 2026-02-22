const fs = require('fs');
const path = require('path');

// 检查是否有 sharp 模块
try {
  const sharp = require('sharp');
  
  const sizes = [72, 96, 128, 144, 152, 384];
  const inputFile = path.join(__dirname, 'icon-512x512.png');
  
  async function generateIcons() {
    console.log('Generating icons...');
    
    for (const size of sizes) {
      const outputFile = path.join(__dirname, `icon-${size}x${size}.png`);
      
      try {
        await sharp(inputFile)
          .resize(size, size)
          .png()
          .toFile(outputFile);
        
        console.log(`✓ Generated ${size}x${size}`);
      } catch (err) {
        console.error(`✗ Failed ${size}x${size}:`, err.message);
      }
    }
    
    console.log('Done!');
  }
  
  generateIcons();
} catch (err) {
  console.log('Please install sharp first:');
  console.log('  npm install sharp');
  console.log('\nOr use the resize.html tool in browser.');
}
