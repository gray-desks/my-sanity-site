# Sanity Blog Auto-Posting System

A command-line tool for automatically posting Markdown content to Sanity CMS with front-matter support and Portable Text conversion.

## 🚀 Quick Start

### 1. Setup Environment Variables

Copy the environment template:
```bash
cp .env.example .env
```

Configure your Sanity credentials in `.env`:
```bash
SANITY_PROJECT_ID=your-sanity-project-id
SANITY_DATASET=production
SANITY_API_TOKEN=your-sanity-api-token-with-write-permissions
```

### 2. Create a Markdown Post

Create a file `my-post.md`:
```markdown
---
title: "My First Blog Post"
slug: "my-first-blog-post"
publishedAt: "2024-01-15T10:00:00.000Z"
excerpt: "This is my first blog post using the automated posting system."
tags: ["blog", "markdown", "sanity"]
author: "John Doe"
ogImage: "https://example.com/image.jpg"
---

# Welcome to My Blog

This is the **first post** on my new blog. I'm excited to share my thoughts with you!

## What You'll Find Here

I'll be writing about:

- Technology trends
- Development tips
- Personal experiences

> "The best time to plant a tree was 20 years ago. The second best time is now." - Chinese Proverb

Here's a code example:

\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}
\`\`\`

You can also use inline code like \`console.log()\` in your writing.

For more information, visit [my website](https://example.com).

Thanks for reading!
```

### 3. Post to Sanity

```bash
# Default: Creates an article
npm run post my-post.md

# Explicit article creation
npm run post my-post.md --type article

# For legacy post schema
npm run post my-post.md --type post
```

## 📋 CLI Reference

### Basic Usage

```bash
npm run post <filePath> [options]
```

### Options

| Option | Description | Example |
|--------|-------------|---------|
| `--type <schema>` | Document schema type (default: article) | `npm run post post.md --type article` |
| `--force-new` | Force creation of new document even if slug exists | `npm run post post.md --force-new` |
| `--dataset <name>` | Override SANITY_DATASET environment variable | `npm run post post.md --dataset development` |
| `--json` | Output results in JSON format | `npm run post post.md --json` |
| `--help, -h` | Show help message | `npm run post --help` |

### Examples

```bash
# Basic usage (creates article)
npm run post ./content/my-first-post.md

# Explicit article creation
npm run post ./content/draft.md --type article

# Force new document creation
npm run post ./content/draft.md --force-new

# Use different dataset with JSON output
npm run post ./content/post.md --dataset development --json

# Legacy post schema support
npm run post ./content/legacy.md --type post
```

## 📝 Front Matter Schema

### Required Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `title` | string | Post title | `"My Blog Post"` |
| `slug` | string | URL slug (must be unique) | `"my-blog-post"` |
| `publishedAt` | string | ISO 8601 datetime | `"2024-01-15T10:00:00.000Z"` |

### Optional Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `excerpt` | string | Post summary/description | `"A brief summary of the post"` |
| `tags` | string[] | Array of tag strings | `["tech", "javascript", "tutorial"]` |
| `ogImage` | string | Open Graph image URL | `"https://example.com/image.jpg"` |
| `author` | string | Author name | `"John Doe"` |

## 🔧 Markdown Support

The system converts Markdown to Sanity's Portable Text format with support for:

### Text Formatting
- **Bold text** with `**bold**` or `__bold__`
- *Italic text* with `*italic*` or `_italic_`
- `Inline code` with backticks
- [Links](https://example.com) with `[text](url)`

### Structural Elements
- Headings (H1-H6) with `#` syntax
- Paragraphs (automatically converted)
- Unordered lists with `-` or `*`
- Ordered lists with `1.` syntax
- Blockquotes with `>`

### Code Blocks
```javascript
// Syntax highlighting support
function example() {
  return "Hello, World!";
}
```

### Fallback Behavior
If Markdown conversion fails, the system automatically falls back to plain text blocks with warning logs.

## 🔒 Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `SANITY_PROJECT_ID` | ✅ | - | Your Sanity project ID |
| `SANITY_DATASET` | ❌ | `production` | Target dataset |
| `SANITY_API_TOKEN` | ✅ | - | API token with write permissions |

### Getting Your Credentials

1. **Project ID**: Found in your Sanity project dashboard URL: `https://your-project-id.sanity.studio`
2. **API Token**: Create one at `https://sanity.io/manage` → Your Project → API → Tokens
   - Permissions: Editor or higher
   - Never commit tokens to version control

## 📤 Output Behavior

### Success Messages

**Standard Output:**
```
✅ post created   id=abc123 slug=my-first-post url=https://project.sanity.studio/desk/post;abc123
```

**JSON Output (with `--json` flag):**
```json
{
  "success": true,
  "action": "created",
  "id": "abc123",
  "slug": "my-first-post"
}
```

### Error Handling

The CLI uses specific exit codes for different error types:

| Exit Code | Meaning | Example |
|-----------|---------|---------|
| 0 | Success | Post created/updated successfully |
| 10 | Front-Matter Validation Error | Missing required field `title` |
| 20 | Sanity API Error | 401 Unauthorized, invalid token |
| 30 | File/FS Error | File not found |
| 40 | Timeout | Operation took longer than 10 seconds |

### Error Examples

```bash
❌ [10] Front-Matter Validation Error: Missing required fields: slug, publishedAt
❌ [20] Sanity API Error: 401 Unauthorized - Check your SANITY_API_TOKEN
❌ [30] File Error: File not found: /path/to/nonexistent.md
❌ [40] Operation timed out after 10 seconds
```

## 🔄 Update vs Create Behavior

- **By default**: If a post with the same `slug` exists, it will be updated
- **With `--force-new`**: Always creates a new post, even if slug exists
- **Slug uniqueness**: Sanity enforces unique slugs, so duplicates will fail without `--force-new`

## 🧪 Testing

### Run Tests
```bash
npm test
```

### Run with Coverage
```bash
npm run test:coverage
```

### Lint Code
```bash
npm run lint
```

### Type Check
```bash
npm run typecheck
```

## 🏗️ Architecture

### Project Structure
```
scripts/
├── post.ts           # Main CLI script
├── post-testable.ts  # Testable functions (for unit tests)
└── markdown.ts       # Markdown to Portable Text conversion

tests/
├── post.test.ts      # CLI integration tests
├── markdown.test.ts  # Markdown conversion tests
└── fixtures/         # Test data files
```

### Dependencies

**Production:**
- `@sanity/client` - Sanity API client
- `gray-matter` - Front matter parsing
- `remark` - Markdown parsing
- `remark-parse` - Remark parser
- `remark-rehype` - Markdown to HTML conversion
- `rehype-stringify` - HTML stringification

**Development:**
- `typescript` - Type checking
- `vitest` - Testing framework
- `eslint` - Code linting
- `prettier` - Code formatting
- `tsx` - TypeScript execution

## 🚨 Security Notes

- **Never commit API tokens** to version control
- Use `.env` files for local development
- Use environment variables or secrets management in production
- API tokens should have minimal required permissions (Editor level)
- Regularly rotate API tokens

## 🔍 Troubleshooting

### Common Issues

**"Missing required environment variables"**
- Ensure `.env` file exists with correct variables
- Check variable names match exactly (case-sensitive)

**"401 Unauthorized"**
- Verify API token is correct and has write permissions
- Check if token has expired
- Ensure project ID matches your Sanity project

**"File not found"**
- Use absolute paths or ensure relative paths are correct
- Check file exists and is readable

**"Front-Matter Validation Error"**
- Ensure all required fields are present: `title`, `slug`, `publishedAt`
- Check `publishedAt` follows ISO 8601 format
- Verify `tags` is an array if provided
- Ensure `ogImage` is a valid URL if provided

### Debug Mode

For detailed debugging, you can modify the timeout and add logging:

```typescript
// In scripts/post.ts, increase timeout from 10000 to 30000
const timeout = setTimeout(() => {
  console.error('❌ [40] Operation timed out after 30 seconds')
  process.exit(EXIT_CODES.TIMEOUT)
}, 30000)
```

## 📞 Support

For issues related to:
- **This CLI tool**: Check the troubleshooting section above
- **Sanity CMS**: Visit [Sanity Documentation](https://www.sanity.io/docs)
- **Project-specific**: Refer to the main repository README

---

**Version**: 1.0.0  
**Last Updated**: January 2024