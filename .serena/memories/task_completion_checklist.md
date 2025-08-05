# Task Completion Checklist

## Before Completing Any Development Task

### 1. Code Quality Checks
```bash
npm run lint        # Fix ESLint issues
npm run typecheck   # Ensure TypeScript compilation
```

### 2. Testing (if applicable)
```bash
npm run test        # Run unit tests
npm run test:coverage # Check test coverage
```

### 3. Build Verification
```bash
# For Sanity changes
npm run build

# For frontend changes  
cd site && npm run build

# Full pipeline test
npm run build && cd site && npm run build
```

### 4. Schema Changes Deployment
If you modified Sanity schemas:
```bash
npx sanity deploy
npm run deploy:studio
```

### 5. Frontend Preview
For Astro changes:
```bash
cd site && npm run preview
```

## Code Review Checklist

### General
- [ ] Code follows project conventions (prettier, eslint)
- [ ] TypeScript types are properly defined
- [ ] No console.log statements in production code
- [ ] Comments are in English, UI text in appropriate language

### Sanity Schema Changes
- [ ] Schema validation rules are appropriate
- [ ] Multi-language descriptions provided
- [ ] Preview configuration updated
- [ ] Related queries in `sanity.ts` updated

### Astro Components
- [ ] Props have TypeScript interfaces
- [ ] Responsive design implemented
- [ ] SEO meta tags included where appropriate
- [ ] Accessibility considerations addressed

### Multi-language Support
- [ ] New strings added to localization files
- [ ] Language-specific routing works correctly
- [ ] Hreflang links properly configured

## Pre-Commit Requirements
1. All linting passes without errors
2. TypeScript compiles without errors  
3. All tests pass (if tests exist)
4. Build completes successfully
5. No sensitive information committed (.env files, API keys)

## Deployment Notes
- Studio changes auto-deploy via `npm run deploy:studio`
- Frontend changes auto-deploy via Vercel on main branch push
- Use ISR webhook (`/api/revalidate`) for content updates
- Monitor Vercel deployment logs for any issues