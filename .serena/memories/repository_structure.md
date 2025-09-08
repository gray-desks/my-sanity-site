# Repository Structure

## Root Level
```
my-sanity-site/
├── CLAUDE.md                    # AI assistant guidelines (this file)
├── README.md                    # Project documentation
├── package.json                 # Root package config for Sanity
├── sanity.config.js            # Sanity Studio configuration
├── sanity.cli.js               # Sanity CLI configuration
├── supportedLanguages.js       # 20-language configuration
├── deskStructure.js            # Sanity Studio structure
├── tsconfig.json               # TypeScript configuration
├── .eslintrc.js                # ESLint configuration
├── .prettierrc                 # Prettier configuration
```

## Schema Directory
```
schemas/
├── index.js              # Schema exports
├── article.js           # Main article document type
├── affiliate.js         # Affiliate block type
└── post.js             # Legacy post type (backwards compatibility)
```

## Astro Site Directory
```
site/
├── package.json              # Frontend dependencies
├── astro.config.mjs         # Astro configuration
├── tailwind.config.mjs      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript config for site
├── src/
│   ├── components/         # Reusable Astro components
│   │   ├── ArticleCard.astro
│   │   ├── Gallery.astro
│   │   ├── Navbar.astro
│   │   └── ui/            # UI components
│   ├── layouts/           # Page layouts
│   │   └── Layout.astro
│   ├── lib/              # Utilities and API clients
│   │   ├── sanity.ts     # Sanity client & queries
│   │   ├── i18n.ts       # Internationalization
│   │   └── env.ts        # Environment variables
│   ├── pages/            # File-based routing
│   │   ├── index.astro   # Homepage (Japanese)
│   │   ├── [lang]/       # Language-specific pages
│   │   ├── api/          # API endpoints
│   │   └── article/      # Article pages
│   └── styles/
│       └── global.css    # Global styles
└── public/               # Static assets
```

## Scripts Directory
```
scripts/
├── post.ts              # Article posting CLI tool
└── markdown.ts          # Markdown to Portable Text converter
```

## Content Directory
```
content/
├── drafts/              # Draft markdown files
├── published/           # Published articles (organized by date)
│   └── {YYYY}/
│       └── {MM}-{slug}.md
└── images/              # Article images
    └── {slug}/
```

## Configuration Files
- **Environment**: `.env.example` templates for both root and site
- **Git**: `.gitignore` excludes node_modules, .env, build artifacts
- **Vercel**: `vercel.json` for deployment configuration
- **GitHub**: `.github/` directory (planned for CI/CD)