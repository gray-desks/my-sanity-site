import sharp from 'sharp';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Language configurations - Import from central config
import { supportedLanguages } from '../../supportedLanguages.js';

// OG Image dimensions
const OG_WIDTH = 1200;
const OG_HEIGHT = 630;

// Language-specific titles
const langTitles = {
  'ja': '旅ログ - 日本全国の旅記録',
  'en': 'Travel Log - Japan Travel Journal',
  'zh-cn': '旅行日志 - 日本全国旅行记录',
  'zh-tw': '旅行日誌 - 日本全國旅行記錄',
  'ko': '여행 로그 - 일본 전국 여행 기록',
  'th': 'บันทึกการเดินทาง - บันทึกการเดินทางทั่วญี่ปุ่น',
  'id': 'Log Perjalanan - Catatan Perjalanan Seluruh Jepang',
  'nl': 'Reisjournaal - Reisverslagen uit heel Japan',
  'pl': 'Dziennik Podróży - Zapiski podróżne z całej Japonii',
  'sv': 'Resedagbok - Reseanteckningar från hela Japan',
  'da': 'Rejsedagbog - Rejseoptegnelser fra hele Japan',
  'fi': 'Matkapäiväkirja - Matkamuistiinpanot koko Japanista',
  'tr': 'Seyahat Günlüğü - Tüm Japonya Seyahat Kayıtları',
  'pt-br': 'Diário de Viagem - Registros de viagem por todo o Japão',
  'fr': 'Journal de Voyage - Carnets de voyage du Japon',
  'de': 'Reisetagebuch - Japan Reiseaufzeichnungen',
  'es': 'Diario de Viaje - Registro de viajes por todo Japón',
  'it': 'Diario di Viaggio - Registri di viaggio in tutto il Giappone',
  'ru': 'Дневник путешествий - Записи путешествий по всей Японии',
  'ar': 'مذكرات السفر - سجلات السفر في جميع أنحاء اليابان'
};

async function generateOgImages() {
  console.log('🖼️  Generating OG images...');
  
  const publicDir = join(__dirname, '../public');
  const ogDir = join(publicDir, 'og');
  
  // Create og directory if it doesn't exist
  if (!existsSync(ogDir)) {
    mkdirSync(ogDir, { recursive: true });
  }

  for (const lang of supportedLanguages) {
    const title = langTitles[lang.id] || langTitles['en'];
    const outputPath = join(ogDir, `default-${lang.id}.webp`);

    try {
      // Create SVG content
      const svgContent = `
        <svg width="${OG_WIDTH}" height="${OG_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#FDFCFB"/>
              <stop offset="50%" style="stop-color:#EAE8E5"/>
              <stop offset="100%" style="stop-color:#FDFCFB"/>
            </linearGradient>
            <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#A61E22;stop-opacity:0.1"/>
              <stop offset="50%" style="stop-color:#D94741;stop-opacity:0.08"/>
              <stop offset="100%" style="stop-color:#A61E22;stop-opacity:0.1"/>
            </linearGradient>
            <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#A61E22"/>
              <stop offset="100%" style="stop-color:#D94741"/>
            </linearGradient>
          </defs>
          
          <!-- Background -->
          <rect width="100%" height="100%" fill="url(#bg)"/>
          <rect width="100%" height="100%" fill="url(#accent)"/>
          
          <!-- Decorative elements -->
          <g opacity="0.06">
            <circle cx="150" cy="130" r="100" fill="#A61E22"/>
            <circle cx="1050" cy="500" r="80" fill="#A61E22"/>
          </g>

          <g>
            <line x1="200" y1="100" x2="200" y2="530" stroke="#e0e0e0" stroke-width="1"/>
            <line x1="1000" y1="100" x2="1000" y2="530" stroke="#e0e0e0" stroke-width="1"/>
          </g>

          <!-- Main Kanji -->
          <text x="600" y="240" text-anchor="middle" fill="#A61E22" font-size="92" font-weight="700" font-family="Hiragino Mincho ProN, YuMincho, Noto Serif JP, serif">旅</text>
          <!-- Title -->
          <text x="600" y="340" text-anchor="middle" fill="#2C2C2C" font-size="44" font-weight="700" font-family="Hiragino Mincho ProN, YuMincho, Noto Serif JP, serif">${title}</text>
          <!-- Subtitle -->
          <text x="600" y="420" text-anchor="middle" fill="#5A5A5A" font-size="24" font-family="Hiragino Mincho ProN, YuMincho, Noto Serif JP, serif">Discover Japan Through Local Eyes</text>
          <!-- Bottom accent line -->
          <rect x="450" y="480" width="300" height="4" fill="url(#logo-gradient)" rx="2"/>
        </svg>
      `;

      // Generate image
      const buffer = await sharp(Buffer.from(svgContent))
        .webp({ quality: 85 })
        .toBuffer();

      // Write to file
      writeFileSync(outputPath, buffer);
      console.log(`✅ Generated: default-${lang.id}.webp`);
      
    } catch (error) {
      console.error(`❌ Failed to generate OG image for ${lang.id}:`, error);
    }
  }

  console.log('🎉 OG image generation completed!');
}

// Run the generation
generateOgImages().catch(console.error);