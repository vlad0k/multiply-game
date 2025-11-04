import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.join(__dirname, '..', 'public');
const svgPath = path.join(publicDir, 'pwa-icon.svg');

// Размеры для PWA иконок
const iconSizes = [
  { size: 180, name: 'apple-touch-icon.png' }, // iOS
  { size: 192, name: 'pwa-192x192.png' }, // Android
  { size: 512, name: 'pwa-512x512.png' }, // Android
  { size: 512, name: 'favicon.png' }, // General favicon
];

// Размеры для маскируемой иконки (Android maskable icon)
// Маскируемая иконка должна иметь безопасную зону (80% от размера)
const maskableIconSize = 512;
const maskableIconSafeZone = maskableIconSize * 0.8; // 80% от размера

async function generateMaskableIcon() {
  // Создаем SVG для маскируемой иконки с безопасной зоной
  const maskableSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
      <defs>
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
        </linearGradient>
        <filter id="shadow">
          <feDropShadow dx="0" dy="4" stdDeviation="8" flood-opacity="0.3"/>
        </filter>
      </defs>
      
      <!-- Background with rounded corners -->
      <rect width="512" height="512" rx="120" fill="url(#bgGradient)"/>
      
      <!-- Safe zone (80% of the icon) -->
      <g transform="translate(51.2, 51.2) scale(0.8)">
        <!-- Decorative circle behind the symbol -->
        <circle cx="256" cy="256" r="180" fill="rgba(255, 255, 255, 0.15)" filter="url(#shadow)"/>
        
        <!-- Main multiplication symbol -->
        <text 
          x="256" 
          y="256" 
          dy="0.35em"
          font-family="Arial, sans-serif" 
          font-size="280" 
          font-weight="bold" 
          text-anchor="middle" 
          fill="white"
          filter="url(#shadow)"
        >×</text>
      </g>
    </svg>
  `;

  const outputPath = path.join(publicDir, 'pwa-512x512-maskable.png');
  await sharp(Buffer.from(maskableSvg))
    .resize(maskableIconSize, maskableIconSize, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .png()
    .toFile(outputPath);
  
  console.log(`✓ Generated maskable icon: ${outputPath}`);
}

async function generateIcons() {
  console.log('Generating PWA icons...\n');

  // Читаем SVG файл
  const svgBuffer = fs.readFileSync(svgPath);

  // Генерируем все иконки
  for (const { size, name } of iconSizes) {
    const outputPath = path.join(publicDir, name);
    
    await sharp(svgBuffer)
      .resize(size, size, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png()
      .toFile(outputPath);
    
    console.log(`✓ Generated ${name} (${size}x${size})`);
  }

  // Генерируем маскируемую иконку
  await generateMaskableIcon();

  // Создаем favicon.ico (16x16 и 32x32)
  const favicon16 = await sharp(svgBuffer)
    .resize(16, 16)
    .png()
    .toBuffer();
  
  const favicon32 = await sharp(svgBuffer)
    .resize(32, 32)
    .png()
    .toBuffer();

  const icoPath = path.join(publicDir, 'favicon.ico');
  // Для favicon.ico используем 32x32 версию (простой подход)
  fs.writeFileSync(icoPath, favicon32);
  console.log(`✓ Generated favicon.ico`);

  console.log('\n✨ All icons generated successfully!');
}

generateIcons().catch(console.error);

