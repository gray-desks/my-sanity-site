/**
 * OG Image Generation Script
 * Generates default OG images for each language using Sharp
 */

import sharp from 'sharp';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { getLangIds } from '../lib/getSupportedLangs.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// OG Image dimensions (1200x630 for optimal social media display)
const OG_WIDTH = 1200;
const OG_HEIGHT = 630;

// Language-specific titles
const langTitles: Record<string, string> = {
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

export async function generateOgImages(): Promise<void> {
  console.log('🖼️  Generating OG images...');
  
  const publicDir = join(__dirname, '../../public');
  const ogDir = join(publicDir, 'og');
  
  // Create og directory if it doesn't exist
  if (!existsSync(ogDir)) {
    mkdirSync(ogDir, { recursive: true });
  }

  const langIds = getLangIds();

  for (const langId of langIds) {
    const title = langTitles[langId] || langTitles['en'];
    const outputPath = join(ogDir, `default-${langId}.webp`);

    try {
      // Create a clean, washi-paper-like background
      const background = await sharp({
        create: {
          width: OG_WIDTH,
          height: OG_HEIGHT,
          channels: 3,
          background: { r: 253, g: 252, b: 251 } // base: '#FDFCFB'
        }
      })
      .png()
      .toBuffer();

      // Add a large, subtle red circle (Hinomaru motif)
      const hinomaru = Buffer.from(`
        <svg width="${OG_WIDTH}" height="${OG_HEIGHT}">
          <circle cx="${OG_WIDTH / 2}" cy="${OG_HEIGHT / 2}" r="${OG_HEIGHT * 0.6}" fill="#A61E22" opacity="0.05" />
        </svg>
      `);

      // Create text overlay with the new design
      const textSvg = `
        <svg width="${OG_WIDTH}" height="${OG_HEIGHT}">
          <style>
            .title {
              font-family: 'Noto Serif JP', serif;
              font-size: 72px;
              font-weight: bold;
              fill: #2C2C2C; /* ink */
              text-anchor: middle;
              dominant-baseline: middle;
            }
            .logo-text {
              font-family: 'Noto Sans JP', sans-serif;
              font-size: 36px;
              font-weight: bold;
              fill: #2C2C2C; /* ink */
              text-anchor: middle;
              dominant-baseline: middle;
            }
            .logo-box {
              fill: #A61E22; /* primary */
            }
            .logo-char {
              font-family: 'Noto Sans JP', sans-serif;
              font-size: 48px;
              font-weight: bold;
              fill: #FDFCFB; /* base */
              text-anchor: middle;
              dominant-baseline: middle;
            }
            .domain {
                font-family: 'Noto Sans JP', sans-serif;
                font-size: 24px;
                fill: #5A5A5A; /* secondary */
                text-anchor: middle;
                dominant-baseline: middle;
            }
          </style>
          
          <!-- Logo -->
          <g transform="translate(${OG_WIDTH / 2 - 100}, 150)">
            <rect x="-40" y="-40" width="80" height="80" rx="12" class="logo-box" />
            <text x="0" y="5" class="logo-char">旅</text>
          </g>
          <text x="${OG_WIDTH / 2 + 40}" y="150" class="logo-text">旅ログ</text>

          <!-- Main Title -->
          <text x="${OG_WIDTH / 2}" y="340" class="title">${title}</text>

          <!-- Domain -->
          <text x="${OG_WIDTH / 2}" y="550" class="domain">your-domain.com</text>
        </svg>
      `;

      // Composite all layers
      const finalImage = await sharp(background)
        .composite([
          { input: hinomaru, top: 0, left: 0 },
          { input: Buffer.from(textSvg), top: 0, left: 0 }
        ])
        .webp({ quality: 85 })
        .toBuffer();

      // Write to file
      writeFileSync(outputPath, finalImage);
      console.log(`✅ Generated: ${outputPath}`);
      
    } catch (error) {
      console.error(`❌ Failed to generate OG image for ${langId}:`, error);
    }
  }

  console.log('🎉 OG image generation completed!');
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateOgImages().catch(console.error);
}