import sharp from 'sharp';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Generate only Japanese OGP assets per project preference
const languages = ['ja'];

// OG Image dimensions
const OG_WIDTH = 1200;
const OG_HEIGHT = 630;
const SQ_SIZE = 800; // for compact Twitter summary card

// Domain text from env (fallback to default preview domain)
const SITE_URL = process.env.PUBLIC_SITE_URL || 'https://my-sanity-site.vercel.app';
const DOMAIN_TEXT = (() => {
  try {
    return new URL(SITE_URL).hostname.replace(/^www\./, '');
  } catch {
    return 'my-sanity-site.vercel.app';
  }
})();

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

// Typography & wrapping helpers
const NO_SPACE_LANGS = new Set(['ja', 'zh-cn', 'zh-tw', 'ko', 'th']);
const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
const escapeXml = (s) => String(s)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;');

function wrapTextToLines(text, opts) {
  const { maxWidthPx, fontSize, isNoSpace, maxLines } = opts;
  const factor = isNoSpace ? 1.0 : 0.6; // rough width factor per char
  const capacity = Math.max(4, Math.floor(maxWidthPx / (fontSize * factor)));
  const tokens = isNoSpace ? Array.from(text) : text.split(/\s+/).filter(Boolean);
  const lines = [];
  let current = '';
  let truncated = false;

  for (const t of tokens) {
    const sep = isNoSpace ? '' : (current ? ' ' : '');
    const candidate = current + sep + t;
    if (candidate.length <= capacity) {
      current = candidate;
      continue;
    }
    if (current) {
      lines.push(current);
    } else {
      // Single token longer than capacity
      lines.push(t.slice(0, capacity));
    }
    current = '';
    if (lines.length >= maxLines) {
      truncated = true;
      break;
    }
    // Start new line with the token if it still fits; otherwise it will be handled next iteration
    if (!isNoSpace) {
      current = t.length > capacity ? t.slice(0, capacity) : t;
    }
  }
  if (current && lines.length < maxLines) lines.push(current);
  if (lines.length > maxLines) {
    lines.length = maxLines;
    truncated = true;
  }
  if (truncated && lines.length) {
    const last = lines[lines.length - 1];
    const capped = last.slice(0, Math.max(0, capacity - 1));
    lines[lines.length - 1] = capped + '…';
  }
  return { lines: lines.map(escapeXml), truncated, capacity };
}

function layoutTitle(title, lang, baseFontSize, minFontSize, maxWidthPx, maxLines) {
  let fontSize = baseFontSize;
  const isNoSpace = NO_SPACE_LANGS.has(lang);
  let result;
  do {
    result = wrapTextToLines(title, { maxWidthPx, fontSize, isNoSpace, maxLines });
    if (!result.truncated || fontSize <= minFontSize) break;
    fontSize -= 2;
  } while (true);
  const lineHeight = Math.round(fontSize * 1.22);
  return { fontSize, lineHeight, lines: result.lines };
}

async function generateOgImages() {
  console.log('🖼️  Generating OG images...');
  
  const publicDir = join(__dirname, '../public');
  const ogDir = join(publicDir, 'og');
  
  // Create og directory if it doesn't exist
  if (!existsSync(ogDir)) {
    mkdirSync(ogDir, { recursive: true });
  }

  const rectSvg = (title, domain, lang) => {
    const xLeft = 88;
    const xRight = OG_WIDTH - 88;
    const baseTitleSize = 56;
    const minTitleSize = 36;
    const titleStartY = 250;
    const maxWidth = xRight - xLeft;
    const { fontSize: titleFontSize, lineHeight, lines: titleLines } = layoutTitle(title, lang, baseTitleSize, minTitleSize, maxWidth, 2);
    const titleLinesSvg = titleLines
      .map((t, i) => `<text x="${xLeft}" y="${titleStartY + i * lineHeight}" font-family="'Noto Serif JP', Georgia, serif" font-size="${titleFontSize}" font-weight="700" fill="#111827">${t}</text>`) 
      .join('\n');
    const straplineY = titleStartY + titleLines.length * lineHeight + 28;
    const underlineY = straplineY + 18;

    return `
    <svg width="${OG_WIDTH}" height="${OG_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- Neutral paper-like background -->
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#FAF9F7"/>
          <stop offset="100%" style="stop-color:#F1EDE6"/>
        </linearGradient>
        <!-- Brand primary (akae) -->
        <linearGradient id="primary" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#B91C1C"/>
          <stop offset="100%" style="stop-color:#EF4444"/>
        </linearGradient>
        <!-- Elegant gold -->
        <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#E7CF9D"/>
          <stop offset="100%" style="stop-color:#C5A572"/>
        </linearGradient>
        <!-- Subtle hemp pattern path -->
        <pattern id="asanoha" patternUnits="userSpaceOnUse" width="60" height="60">
          <path d="M30 0 L45 15 L30 30 L15 15 Z M60 30 L45 45 L30 30 L45 15 Z M30 60 L15 45 L30 30 L45 45 Z M0 30 L15 15 L30 30 L15 45 Z" fill="none" stroke="#9CA3AF" stroke-width="0.6" opacity="0.18"/>
        </pattern>
        <!-- Soft shadow -->
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="8" result="blur"/>
          <feOffset dx="0" dy="6" result="offset"/>
          <feMerge>
            <feMergeNode in="offset"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <clipPath id="textClipRect">
          <rect x="40" y="28" width="${OG_WIDTH-80}" height="${OG_HEIGHT-56}" rx="24"/>
        </clipPath>
      </defs>
      <!-- Background -->
      <rect width="100%" height="100%" fill="url(#bg)"/>
      <!-- Inner framed card -->
      <g filter="url(#shadow)">
        <rect x="40" y="28" width="${OG_WIDTH-80}" height="${OG_HEIGHT-56}" rx="24" fill="#FFFFFF"/>
      </g>
      <rect x="40" y="28" width="${OG_WIDTH-80}" height="${OG_HEIGHT-56}" rx="24" fill="url(#asanoha)" opacity="0.07"/>
      <rect x="40" y="28" width="${OG_WIDTH-80}" height="${OG_HEIGHT-56}" rx="24" fill="none" stroke="#E5DED4" stroke-width="1.5"/>

      <!-- Left accent bar -->
      <rect x="40" y="28" width="8" height="${OG_HEIGHT-56}" rx="4" fill="url(#gold)"/>

      <!-- Brand lockup -->
      <g transform="translate(88, 110)">
        <!-- Header-style circular logo with white border and gold badge -->
        <circle cx="42" cy="32" r="36" fill="url(#primary)"/>
        <circle cx="42" cy="32" r="38" fill="none" stroke="#FFFFFF" stroke-width="4"/>
        <text x="42" y="44" text-anchor="middle" font-family="'Noto Serif JP', Georgia, serif" font-size="42" font-weight="700" fill="#fff">旅</text>
        <circle cx="78" cy="-2" r="7" fill="#d4af37" stroke="#fff" stroke-width="3"/>
      </g>
      <text x="192" y="150" font-family="'Noto Serif JP', Georgia, serif" font-size="44" font-weight="800" fill="#0F172A">旅ログ</text>

      <!-- Title (wrapped) and strapline -->
      <g clip-path="url(#textClipRect)">
        ${titleLinesSvg}
        <text x="${xLeft}" y="${straplineY}" font-family="'Noto Sans JP', system-ui, sans-serif" font-size="26" fill="#6B7280">Discover Japan Through Local Eyes</text>
        <rect x="${xLeft}" y="${underlineY}" width="420" height="4" rx="2" fill="url(#gold)"/>
      </g>

      <!-- Domain pill -->
      <g transform="translate(${xLeft}, ${OG_HEIGHT-120})">
        <rect x="0" y="-28" rx="18" width="${domain.length*12 + 48}" height="40" fill="#FFFFFF" stroke="#E5DED4"/>
        <text x="${(domain.length*12 + 48)/2}" y="-2" text-anchor="middle" font-family="'Noto Sans JP', system-ui, sans-serif" font-size="20" fill="#6B7280">${escapeXml(domain)}</text>
      </g>
    </svg>
    `;
  };

  const squareSvg = (title, domain, lang) => {
    const centerX = SQ_SIZE / 2;
    const innerPad = 64; // matches card padding visually
    const baseTitleSize = 38;
    const minTitleSize = 28;
    const titleStartY = 340;
    const maxWidth = SQ_SIZE - innerPad * 2;
    const { fontSize: titleFontSize, lineHeight, lines: titleLines } = layoutTitle(title, lang, baseTitleSize, minTitleSize, maxWidth, 2);
    const titleLinesSvg = titleLines
      .map((t, i) => `<text x="${centerX}" y="${titleStartY + i * lineHeight}" text-anchor="middle" font-family="'Noto Serif JP', Georgia, serif" font-size="${titleFontSize}" font-weight="700" fill="#111827">${t}</text>`) 
      .join('\n');
    const straplineY = titleStartY + titleLines.length * lineHeight + 30;
    const underlineY = straplineY - 16;

    return `
    <svg width="${SQ_SIZE}" height="${SQ_SIZE}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bgSq" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#FAF9F7"/>
          <stop offset="100%" style="stop-color:#F1EDE6"/>
        </linearGradient>
        <linearGradient id="primarySq" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#B91C1C"/>
          <stop offset="100%" style="stop-color:#EF4444"/>
        </linearGradient>
        <linearGradient id="goldSq" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#E7CF9D"/>
          <stop offset="100%" style="stop-color:#C5A572"/>
        </linearGradient>
        <pattern id="asanohaSq" patternUnits="userSpaceOnUse" width="60" height="60">
          <path d="M30 0 L45 15 L30 30 L15 15 Z M60 30 L45 45 L30 30 L45 15 Z M30 60 L15 45 L30 30 L45 45 Z M0 30 L15 15 L30 30 L15 45 Z" fill="none" stroke="#9CA3AF" stroke-width="0.6" opacity="0.18"/>
        </pattern>
        <filter id="shadowSq" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="6" result="blur"/>
          <feOffset dx="0" dy="4" result="offset"/>
          <feMerge>
            <feMergeNode in="offset"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <clipPath id="textClipSq">
          <rect x="32" y="32" width="${SQ_SIZE-64}" height="${SQ_SIZE-64}" rx="28"/>
        </clipPath>
      </defs>
      <rect width="100%" height="100%" fill="url(#bgSq)"/>
      <g filter="url(#shadowSq)">
        <rect x="32" y="32" width="${SQ_SIZE-64}" height="${SQ_SIZE-64}" rx="28" fill="#FFFFFF"/>
      </g>
      <rect x="32" y="32" width="${SQ_SIZE-64}" height="${SQ_SIZE-64}" rx="28" fill="url(#asanohaSq)" opacity="0.07"/>
      <rect x="32" y="32" width="${SQ_SIZE-64}" height="${SQ_SIZE-64}" rx="28" fill="none" stroke="#E5DED4" stroke-width="1.5"/>
      <rect x="32" y="32" width="8" height="${SQ_SIZE-64}" rx="4" fill="url(#goldSq)"/>

      <g transform="translate(${SQ_SIZE/2 - 42}, 120)">
        <circle cx="42" cy="42" r="36" fill="url(#primarySq)"/>
        <circle cx="42" cy="42" r="38" fill="none" stroke="#FFFFFF" stroke-width="4"/>
        <text x="42" y="54" text-anchor="middle" font-family="'Noto Serif JP', Georgia, serif" font-size="42" font-weight="700" fill="#fff">旅</text>
        <circle cx="82" cy="6" r="7" fill="#d4af37" stroke="#fff" stroke-width="3"/>
      </g>
      <text x="${centerX}" y="250" text-anchor="middle" font-family="'Noto Serif JP', Georgia, serif" font-size="42" font-weight="800" fill="#0F172A">旅ログ</text>
      <g clip-path="url(#textClipSq)">
        ${titleLinesSvg}
        <rect x="${centerX - 160}" y="${underlineY}" width="320" height="4" rx="2" fill="url(#goldSq)"/>
        <text x="${centerX}" y="${straplineY}" text-anchor="middle" font-family="'Noto Sans JP', system-ui, sans-serif" font-size="22" fill="#6B7280">Discover Japan Through Local Eyes</text>
      </g>
      <g transform="translate(${SQ_SIZE/2 - (domain.length*12 + 48)/2}, ${SQ_SIZE-120})">
        <rect x="0" y="-28" rx="18" width="${domain.length*12 + 48}" height="40" fill="#FFFFFF" stroke="#E5DED4"/>
        <text x="${(domain.length*12 + 48)/2}" y="-2" text-anchor="middle" font-family="'Noto Sans JP', system-ui, sans-serif" font-size="20" fill="#6B7280">${escapeXml(domain)}</text>
      </g>
    </svg>
    `;
  };

  for (const langId of languages) {
    const title = langTitles[langId] || langTitles['ja'];
    const rectOut = join(ogDir, `default-${langId}.webp`);
    const squareOut = join(ogDir, `default-square-${langId}.webp`);

    try {
      // Rectangular 1200x630
      const rectBuffer = await sharp(Buffer.from(rectSvg(title, DOMAIN_TEXT, langId)))
        .webp({ quality: 85 })
        .toBuffer();
      writeFileSync(rectOut, rectBuffer);
      console.log(`✅ Generated: default-${langId}.webp`);

      // Square 800x800 for compact Twitter card
      const squareBuffer = await sharp(Buffer.from(squareSvg(title, DOMAIN_TEXT, langId)))
        .webp({ quality: 85 })
        .toBuffer();
      writeFileSync(squareOut, squareBuffer);
      console.log(`✅ Generated: default-square-${langId}.webp`);

    } catch (error) {
      console.error(`❌ Failed to generate OG images for ${langId}:`, error);
    }
  }

  console.log('🎉 OG image generation completed!');
}

// Run the generation
generateOgImages().catch(console.error);