# Essential Commands for 旅ログ Project

## Development Commands

### Sanity Studio
```bash
npm run dev                # Start Sanity Studio on localhost:3333
npm run deploy:studio      # Deploy Studio to production
```

### Astro Frontend  
```bash
cd site && npm run dev     # Start Astro dev server on localhost:4321
cd site && npm run build   # Build Astro site for production
cd site && npm run preview # Preview built site
```

### Article Auto-Post CLI
```bash
npm run post content/drafts/my-article.md    # Post single markdown file
npm run post content/drafts/**/*.md          # Batch post multiple files
```

CLI Options:
- `--type <schema>` - Specify document type
- `--json` - Output JSON format
- `--dry-run` - Preview without posting

### Code Quality
```bash
npm run lint        # ESLint for TypeScript files
npm run typecheck   # TypeScript type checking
```

### Full Build Pipeline
```bash
npm run build && cd site && npm run build   # Complete build verification
```

## Content Management

### Content Structure
- Drafts: `content/drafts/{slug}.md`
- Published: `content/published/{YYYY}/{MM}-{slug}.md`
- Images: `content/images/{slug}/...`

### Schema Changes
1. Edit `/schema/article.js`
2. Update `site/src/lib/sanity.ts` types and GROQ queries
3. Update related Astro components
4. Deploy: `npx sanity deploy` → `npm run deploy:studio`

## Deployment
- **Studio**: Automatically deploys via `npm run deploy:studio`
- **Frontend**: Automatic Vercel deployment on main branch push
- **ISR**: Webhook triggers available at `/api/revalidate`