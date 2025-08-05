# Code Style & Conventions

## General Style Guidelines
- **Language**: Code comments and documentation in English, UI labels in Japanese
- **File Structure**: Organized by feature/component type
- **Naming**: camelCase for variables/functions, PascalCase for components/types

## TypeScript/JavaScript
- **Prettier Configuration**:
  - No semicolons (`"semi": false`)
  - Single quotes (`"singleQuote": true`)
  - 2-space indentation (`"tabWidth": 2`)
  - 100 character line width (`"printWidth": 100`)
  - ES5 trailing commas (`"trailingComma": "es5"`)

- **ESLint Rules**:
  - TypeScript parser with recommended rules
  - Console logs allowed (`'no-console': 'off'`)
  - Unused variables error with underscore prefix exception
  - TypeScript handles undefined variables

## Astro Components
- File extension: `.astro`
- Component props with TypeScript interfaces
- CSS scoped to components when needed
- Tailwind CSS for styling

## Sanity Schema
- JavaScript files in `/schemas/` directory
- Use `defineType` and `defineField` helpers
- Validation rules with `Rule => Rule.required()`
- Internationalized descriptions based on document language
- Preview configurations with title/subtitle/media

## File Organization
```
/
├── schemas/           # Sanity schema definitions
├── site/             # Astro frontend
│   ├── src/
│   │   ├── components/  # Reusable Astro components
│   │   ├── layouts/     # Page layouts
│   │   ├── lib/         # Utility functions & API clients
│   │   ├── pages/       # Route pages (file-based routing)
│   │   └── styles/      # Global CSS
├── scripts/          # CLI tools and utilities
└── content/          # Markdown content (drafts/published)
```

## Multi-language Support
- Master language: Japanese (ja)
- 20 supported languages via `supportedLanguages.js`
- Translation references using weak references
- Language-specific UI descriptions in schema fields