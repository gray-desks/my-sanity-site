import type { APIRoute } from 'astro'
import sharp from 'sharp'
import { getArticleById } from '../../../../lib/sanity'
import { SITE_URL } from '../../../../lib/env'

// Dimensions for Instagram Stories
const WIDTH = 1080
const HEIGHT = 1920

// Japanese strapline (short and descriptive)
const JP_STRAPLINE = '日本各地の魅力を写真と文章で発信'

function getDomain(hostUrl: string): string {
  try {
    const host = new URL(hostUrl).hostname.toLowerCase()
    // Normalize to official www domain
    if (host === 'japantravellog.com' || host.endsWith('.japantravellog.com')) {
      return 'www.japantravellog.com'
    }
    return host
  } catch {
    return 'www.japantravellog.com'
  }
}

// Basic JP-friendly line wrapping for SVG text
function wrapTextToLines(text: string, {
  maxWidthPx,
  fontSize,
  isNoSpace,
  maxLines,
}: { maxWidthPx: number; fontSize: number; isNoSpace: boolean; maxLines: number }) {
  const factor = isNoSpace ? 1.0 : 0.6 // rough width factor per char
  const capacity = Math.max(4, Math.floor(maxWidthPx / (fontSize * factor)))
  const tokens = isNoSpace ? Array.from(text ?? '') : String(text ?? '').split(/\s+/).filter(Boolean)
  const lines: string[] = []
  let current = ''
  let truncated = false

  for (const t of tokens) {
    const sep = isNoSpace ? '' : (current ? ' ' : '')
    const candidate = current + sep + t
    if (candidate.length <= capacity) {
      current = candidate
      continue
    }
    if (current) {
      lines.push(current)
    } else {
      lines.push(t.slice(0, capacity))
    }
    current = ''
    if (lines.length >= maxLines) {
      truncated = true
      break
    }
    if (!isNoSpace) {
      current = t.length > capacity ? t.slice(0, capacity) : t
    }
  }

  if (current && lines.length < maxLines) lines.push(current)
  if (lines.length > maxLines) {
    lines.length = maxLines
    truncated = true
  }
  if (truncated && lines.length) {
    const last = lines[lines.length - 1]
    const capped = last.slice(0, Math.max(0, capacity - 1))
    lines[lines.length - 1] = capped + '…'
  }
  return { lines }
}

function escapeXml(s: string) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function buildOverlaySvg(title: string, displayUrl: string, straplineText: string) {
  const padX = 96
  const titleMaxWidth = WIDTH - padX * 2
  const baseTitleSize = 72
  const minTitleSize = 48
  const isNoSpace = true // Japanese primary
  let fontSize = baseTitleSize
  let lines: string[] = []

  // Try shrinking until fits 3 lines
  for (let fs = baseTitleSize; fs >= minTitleSize; fs -= 2) {
    const { lines: ls } = wrapTextToLines(title, { maxWidthPx: titleMaxWidth, fontSize: fs, isNoSpace, maxLines: 3 })
    if (ls.length <= 3) {
      fontSize = fs
      lines = ls
      break
    }
  }
  if (lines.length === 0) {
    lines = [title.slice(0, 24) + (title.length > 24 ? '…' : '')]
    fontSize = minTitleSize
  }
  const lineHeight = Math.round(fontSize * 1.22)
  const startY = 740 // visual center-ish

  const titleLinesSvg = lines
    .map((t, i) => `<text x="${padX}" y="${startY + i * lineHeight}" font-family="'Noto Serif JP', Georgia, serif" font-size="${fontSize}" font-weight="700" fill="#F9FAFB" stroke="#111827" stroke-opacity="0.6" stroke-width="5" paint-order="stroke fill" text-rendering="optimizeLegibility">${escapeXml(t)}</text>`)
    .join('\n')

  const straplineY = startY + lines.length * lineHeight + 32
  const panelY = startY - 72
  const panelHeight = lines.length * lineHeight + 140

  return `
  <svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style="stop-color:#E7CF9D"/>
        <stop offset="100%" style="stop-color:#C5A572"/>
      </linearGradient>
      <linearGradient id="primary" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#B91C1C"/>
        <stop offset="100%" style="stop-color:#EF4444"/>
      </linearGradient>
      <linearGradient id="panel" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#000" stop-opacity="0.6" />
        <stop offset="100%" stop-color="#000" stop-opacity="0.25" />
      </linearGradient>
    </defs>

    <!-- Safe area frame (for readability over blurred bg) -->
    <rect x="40" y="40" width="${WIDTH - 80}" height="${HEIGHT - 80}" rx="28" fill="rgba(0,0,0,0.15)" />

    <!-- Brand lockup -->
    <g transform="translate(${padX}, 220)">
      <circle cx="42" cy="32" r="36" fill="url(#primary)"/>
      <circle cx="42" cy="32" r="38" fill="none" stroke="#FFFFFF" stroke-width="4"/>
      <text x="42" y="44" text-anchor="middle" font-family="'Noto Serif JP', Georgia, serif" font-size="42" font-weight="700" fill="#fff">旅</text>
      <circle cx="78" cy="-2" r="7" fill="#d4af37" stroke="#fff" stroke-width="3"/>
    </g>
    <text x="${padX + 98}" y="252" font-family="'Noto Serif JP', Georgia, serif" font-size="54" font-weight="800" fill="#F9FAFB">旅ログ</text>

    <!-- Title backdrop panel for readability -->
    <rect x="${padX - 32}" y="${panelY}" width="${titleMaxWidth + 64}" height="${panelHeight}" rx="24" fill="url(#panel)" />

    <!-- Title and strapline -->
    ${titleLinesSvg}
    <text x="${padX}" y="${straplineY}" font-family="'Noto Sans JP', system-ui, sans-serif" font-size="28" fill="#E5E7EB">${escapeXml(straplineText)}</text>
    <rect x="${padX}" y="${straplineY + 12}" width="420" height="4" rx="2" fill="url(#gold)"/>

    <!-- URL pill bottom center -->
    <g transform="translate(${WIDTH / 2 - (displayUrl.length * 12 + 48) / 2}, ${HEIGHT - 160})">
      <rect x="0" y="-28" rx="18" width="${displayUrl.length * 12 + 48}" height="40" fill="rgba(255,255,255,0.92)" />
      <text x="${(displayUrl.length * 12 + 48) / 2}" y="-2" text-anchor="middle" font-family="'Noto Sans JP', system-ui, sans-serif" font-size="20" fill="#374151">${escapeXml(displayUrl)}</text>
    </g>
  </svg>
  `
}

export const GET: APIRoute = async ({ params }) => {
  const id = params.id as string | undefined
  if (!id) {
    return new Response('Missing id', { status: 400 })
  }

  const article = await getArticleById(id)
  if (!article) {
    return new Response('Not found', { status: 404 })
  }

  const domain = getDomain(SITE_URL)
  const displayUrl = 'https://www.japantravellog.com'
  const title = article.title || '旅ログ'
  const coverUrl = article.coverImage?.asset?.url

  try {
    // Build background
    let background: Buffer
    if (coverUrl) {
      const bgResp = await fetch(`${coverUrl}?w=${WIDTH}&h=${HEIGHT}&fit=crop&auto=format`)
      const bgBuf = Buffer.from(await bgResp.arrayBuffer())
      background = await sharp(bgBuf)
        .resize({ width: WIDTH, height: HEIGHT, fit: 'cover' })
        .blur(1.2)
        .modulate({ brightness: 0.85, saturation: 1.0 })
        .toBuffer()
    } else {
      background = await sharp({
        create: { width: WIDTH, height: HEIGHT, channels: 3, background: '#1F2937' },
      })
        .png()
        .toBuffer()
    }

    const overlaySvg = buildOverlaySvg(title, displayUrl, JP_STRAPLINE)

    const out = await sharp(background)
      .composite([{ input: Buffer.from(overlaySvg), top: 0, left: 0 }])
      .webp({ quality: 88 })
      .toBuffer()

    return new Response(out, {
      status: 200,
      headers: {
        'Content-Type': 'image/webp',
        'Cache-Control': 'public, max-age=0, s-maxage=31536000, stale-while-revalidate=86400',
      },
    })
  } catch (error) {
    console.error('Story OG generation failed:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}
