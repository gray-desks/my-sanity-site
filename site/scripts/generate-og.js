import sharp from 'sharp';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Language configurations
const supportedLanguages = [
  { id: 'ja', title: '日本語' },
  { id: 'en', title: 'English' },
  { id: 'zh-cn', title: '中文（简体）' },
  { id: 'zh-tw', title: '中文（繁體）' },
  { id: 'ko', title: '한국어' },
  { id: 'th', title: 'ไทย' },
  { id: 'vi', title: 'Tiếng Việt' },
  { id: 'id', title: 'Bahasa Indonesia' },
  { id: 'ms', title: 'Bahasa Melayu' },
  { id: 'tl', title: 'Filipino' },
  { id: 'fr', title: 'Français' },
  { id: 'de', title: 'Deutsch' },
  { id: 'es', title: 'Español' },
  { id: 'it', title: 'Italiano' },
  { id: 'pt', title: 'Português' },
  { id: 'ru', title: 'Русский' },
  { id: 'ar', title: 'العربية' },
  { id: 'hi', title: 'हिन्दी' },
  { id: 'tr', title: 'Türkçe' },
  { id: 'pt-br', title: 'Português (Brasil)' }
];

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
  'vi': 'Nhật ký du lịch - Ghi chép du lịch toàn Nhật Bản',
  'id': 'Log Perjalanan - Catatan Perjalanan Seluruh Jepang',
  'ms': 'Log Perjalanan - Catatan Perjalanan Seluruh Jepang',
  'tl': 'Travel Log - Tala ng Paglalakbay sa Buong Japan',
  'fr': 'Journal de Voyage - Carnets de voyage du Japon',
  'de': 'Reisetagebuch - Japan Reiseaufzeichnungen',
  'es': 'Diario de Viaje - Registro de viajes por todo Japón',
  'it': 'Diario di Viaggio - Registri di viaggio in tutto il Giappone',
  'pt': 'Diário de Viagem - Registros de viagem por todo o Japão',
  'ru': 'Дневник путешествий - Записи путешествий по всей Японии',
  'ar': 'مذكرات السفر - سجلات السفر في جميع أنحاء اليابان',
  'hi': 'यात्रा डायरी - पूरे जापान की यात्रा रिकॉर्ड',
  'tr': 'Seyahat Günlüğü - Tüm Japonya Seyahat Kayıtları',
  'pt-br': 'Diário de Viagem - Registros de viagem por todo o Japão'
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
          <circle cx="150" cy="150" r="80" fill="#A61E22" opacity="0.08"/>
          <circle cx="1050" cy="480" r="60" fill="#D94741" opacity="0.08"/>
          <rect x="900" y="100" width="2" height="400" fill="#EAE8E5"/>
          <rect x="300" y="100" width="2" height="400" fill="#EAE8E5"/>
          
          <!-- Logo -->
          <text x="600" y="200" text-anchor="middle" fill="url(#logo-gradient)" font-size="64" font-weight="bold" font-family="Noto Sans JP, system-ui">旅</text>
          
          <!-- Title -->
          <text x="600" y="320" text-anchor="middle" fill="#2C2C2C" font-size="42" font-weight="bold" font-family="Noto Sans JP, system-ui">${title}</text>
          
          <!-- Subtitle -->
          <text x="600" y="420" text-anchor="middle" fill="#5A5A5A" font-size="22" font-family="system-ui">Discover Japan Through Local Eyes</text>
          
          <!-- Bottom accent line -->
          <rect x="400" y="500" width="400" height="3" fill="url(#logo-gradient)" rx="2"/>
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