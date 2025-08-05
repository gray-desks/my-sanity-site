# 旅ログ – Japan Travel Journal Project Overview

## Purpose
A Japan travel journal website with the following key goals:
- Minimal revenue generation with near-zero operational costs
- Automated posting through n8n integration
- Multi-language support (20 languages including JA, EN, ZH-CN, etc.)
- Revenue streams through Booking.com affiliate and Google AdSense

## Tech Stack
- **CMS**: Sanity v4 (Studio: travel-blog-jp.sanity.studio)
- **Frontend**: Astro 5 + Tailwind CSS 3
- **Hosting**: Vercel Hobby (https://my-sanity-site.vercel.app)
- **Automation**: n8n workflows for content translation and posting
- **Internationalization**: @sanity/document-internationalization

## Core Data Model
The project uses a single `article` document type with the following key fields:
- `title` (required string)
- `slug` (auto-generated, unique)
- `type` (enum: spot, food, transport, hotel, note)
- `lang` (20 language codes)
- `location` (geopoint, optional)
- `placeName` (optional string)
- `prefecture` (Japanese prefectures dropdown)
- `publishedAt` (datetime)
- `coverImage` (image with hotspot)
- `gallery` (max 12 images with hotspot)
- `body` (Portable Text with blocks, images, affiliate blocks)

## Key Features
- Multi-language content with translation pipeline
- Article auto-posting CLI tool
- Gallery with lazy loading
- Affiliate block support (Booking.com, Rakuten, Klook)
- ISR (Incremental Static Regeneration) via Vercel
- SEO optimization with sitemap and i18n support