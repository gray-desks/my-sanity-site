---
title: "Getting Started with Sanity Blog Auto-Posting"
slug: "getting-started-sanity-blog-posting"
publishedAt: "2024-01-15T12:00:00.000Z"
excerpt: "Learn how to use the automated blog posting system to publish Markdown content to Sanity CMS."
tags: ["sanity", "markdown", "automation", "cms"]
author: "Blog System"
---

# Getting Started with Sanity Blog Auto-Posting

Welcome to the automated blog posting system! This post demonstrates how to convert Markdown content into Sanity's Portable Text format automatically.

## Features

This system supports a wide range of Markdown features:

### Text Formatting

You can use **bold text**, *italic text*, and `inline code` in your posts. [Links](https://sanity.io) are also supported and will be converted properly.

### Lists

Unordered lists work great:
- Feature 1: Automatic Markdown conversion
- Feature 2: Front-matter validation
- Feature 3: Error handling with exit codes
- Feature 4: JSON output support

Ordered lists are supported too:
1. Install dependencies
2. Configure environment variables
3. Create your Markdown file
4. Run the post command

### Code Blocks

Here's a JavaScript example:

```javascript
// Example function
function createPost(markdown) {
  return {
    title: markdown.frontMatter.title,
    slug: markdown.frontMatter.slug,
    body: convertToPortableText(markdown.content)
  };
}
```

### Quotes

> "The best way to get started is to quit talking and begin doing." - Walt Disney

## How It Works

The system follows these steps:

1. **Parse** the Markdown file and extract front-matter
2. **Validate** required fields (title, slug, publishedAt)
3. **Convert** Markdown content to Portable Text blocks
4. **Check** if a post with the same slug already exists
5. **Create** or **update** the post in Sanity

## Next Steps

Try creating your own post by:

1. Copying this file
2. Updating the front-matter with your content
3. Writing your own Markdown content
4. Running: `npm run post your-file.md`

Happy blogging! 🚀