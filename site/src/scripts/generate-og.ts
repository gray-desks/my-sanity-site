/**
 * OG Image Generation Script
 * Generates default OG images for each language using Sharp
 */

import sharp from 'sharp';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { getLangIds } from '../lib/getSupportedLangs.js';

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
      // Create a gradient background
      const background = await sharp({
        create: {
          width: OG_WIDTH,
          height: OG_HEIGHT,
          channels: 3,
          background: { r: 15, g: 23, b: 42 } // slate-900 equivalent
        }
      })
      .png()
      .toBuffer();

      // Create overlay with gradient effect
      const gradient = await sharp({
        create: {
          width: OG_WIDTH,
          height: OG_HEIGHT,
          channels: 4,
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        }
      })
      .composite([
        {
          input: Buffer.from(`
            <svg width="${OG_WIDTH}" height="${OG_HEIGHT}">
              <defs>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style="stop-color:#1e40af;stop-opacity:0.3" />
                  <stop offset="50%" style="stop-color:#7c3aed;stop-opacity:0.2" />
                  <stop offset="100%" style="stop-color:#dc2626;stop-opacity:0.3" />
                </linearGradient>
              </defs>
              <rect width="100%" height="100%" fill="url(#grad1)" />
            </svg>
          `),
          top: 0,
          left: 0
        }
      ])
      .png()
      .toBuffer();

      // Create text overlay
      const textSvg = `
        <svg width="${OG_WIDTH}" height="${OG_HEIGHT}">
          <style>
            .title {
              font-family: 'Noto Sans CJK JP', 'Inter', sans-serif;
              font-size: 64px;
              font-weight: bold;
              fill: white;
              text-anchor: middle;
              dominant-baseline: middle;
            }
            .subtitle {
              font-family: 'Inter', sans-serif;
              font-size: 28px;
              fill: #cbd5e1;
              text-anchor: middle;
              dominant-baseline: middle;
            }
            .logo {
              font-family: 'Noto Sans CJK JP', sans-serif;
              font-size: 48px;
              font-weight: bold;
              fill: #3b82f6;
              text-anchor: middle;
              dominant-baseline: middle;
            }
          </style>
          <text x="${OG_WIDTH / 2}" y="200" class="logo">旅</text>
          <text x="${OG_WIDTH / 2}" y="320" class="title">${title}</text>
          <text x="${OG_WIDTH / 2}" y="420" class="subtitle">Discover Japan Through Local Eyes</text>
        </svg>
      `;

      // Composite all layers
      const finalImage = await sharp(background)
        .composite([
          { input: gradient, top: 0, left: 0 },
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