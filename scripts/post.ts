#!/usr/bin/env node

import 'dotenv/config'
import { createClient } from '@sanity/client'
import * as fs from 'fs'
import * as path from 'path'
import matter from 'gray-matter'
import { mdToPortableText } from './markdown.ts'

// Exit codes
const EXIT_CODES = {
  SUCCESS: 0,
  VALIDATION_ERROR: 10,
  SANITY_API_ERROR: 20,
  FILE_ERROR: 30,
  TIMEOUT: 40,
} as const

// Environment variables
interface Config {
  projectId: string
  dataset: string
  apiToken: string
}

// Front matter interface
interface FrontMatter {
  title: string
  slug: string
  publishedAt: string
  excerpt?: string
  tags?: string[]
  ogImage?: string
  author?: string
}

// CLI options
interface CLIOptions {
  filePath: string
  forceNew: boolean
  dataset: string
  json: boolean
  type: string
}

/**
 * Main execution function
 */
async function main() {
  try {
    const options = parseArgs()
    const config = loadConfig(options)
    
    await processMarkdownFile(options, config)
  } catch (error) {
    handleError(error)
  }
}

/**
 * Parse command line arguments
 */
function parseArgs(): CLIOptions {
  const args = process.argv.slice(2)
  
  if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    printUsage()
    process.exit(EXIT_CODES.SUCCESS)
  }

  const filePath = args[0]
  const forceNew = args.includes('--force-new')
  const datasetIndex = args.indexOf('--dataset')
  const dataset = datasetIndex !== -1 && args[datasetIndex + 1] ? args[datasetIndex + 1] : 'production'
  const json = args.includes('--json')
  const typeIndex = args.indexOf('--type')
  const type = typeIndex !== -1 && args[typeIndex + 1] ? args[typeIndex + 1] : 'article'

  if (!filePath) {
    console.error('❌ [30] File path is required')
    process.exit(EXIT_CODES.FILE_ERROR)
  }

  return { filePath, forceNew, dataset, json, type }
}

/**
 * Load configuration from environment variables
 */
function loadConfig(options: CLIOptions): Config {
  const projectId = process.env.SANITY_PROJECT_ID
  const dataset = process.env.SANITY_DATASET || options.dataset
  const apiToken = process.env.SANITY_API_TOKEN

  if (!projectId || !apiToken) {
    console.error('❌ [20] Missing required environment variables: SANITY_PROJECT_ID, SANITY_API_TOKEN')
    process.exit(EXIT_CODES.SANITY_API_ERROR)
  }

  return { projectId, dataset, apiToken }
}

/**
 * Process the markdown file and post to Sanity
 */
async function processMarkdownFile(options: CLIOptions, config: Config): Promise<void> {
  const timeout = setTimeout(() => {
    console.error('❌ [40] Operation timed out after 10 seconds')
    process.exit(EXIT_CODES.TIMEOUT)
  }, 10000)

  try {
    // Read and parse markdown file
    const { frontMatter, content } = await readMarkdownFile(options.filePath)
    
    // Validate front matter
    validateFrontMatter(frontMatter)
    
    // Convert markdown to Portable Text
    const portableTextBody = await mdToPortableText(content)
    
    // Create Sanity client
    const client = createClient({
      projectId: config.projectId,
      dataset: config.dataset,
      token: config.apiToken,
      useCdn: false,
      apiVersion: '2024-01-01',
    })
    
    // Check if document with slug already exists
    const existingDoc = await client.fetch(
      `*[_type == $type && slug.current == $slug][0]`,
      { type: options.type, slug: frontMatter.slug }
    )
    
    // Prepare document with schema-specific fields
    const docData: any = {
      _type: options.type,
      title: frontMatter.title,
      slug: { current: frontMatter.slug },
      publishedAt: frontMatter.publishedAt,
      body: portableTextBody,
    }

    // Add schema-specific fields
    if (options.type === 'article') {
      // Article schema requires lang and type fields
      docData.lang = 'ja' // Default to Japanese
      docData.type = 'note' // Default to note type for blog posts
    } else if (options.type === 'post') {
      // Post schema supports these optional fields
      if (frontMatter.excerpt) docData.excerpt = frontMatter.excerpt
      if (frontMatter.tags) docData.tags = frontMatter.tags
      if (frontMatter.author) docData.author = frontMatter.author
    }

    // Common optional fields
    if (frontMatter.ogImage) docData.ogImage = frontMatter.ogImage

    let result
    
    if (existingDoc && !options.forceNew) {
      // Update existing document
      result = await client.patch(existingDoc._id).set(docData).commit()
      
      if (options.json) {
        console.log(JSON.stringify({ 
          success: true, 
          action: 'updated', 
          id: result._id, 
          slug: frontMatter.slug,
          type: options.type
        }))
      } else {
        const studioUrl = `https://${config.projectId}.sanity.studio/desk/${options.type === 'article' ? 'articles' : options.type};${result._id}`
        console.log(`✅ ${options.type} updated   id=${result._id} slug=${frontMatter.slug} url=${studioUrl}`)
      }
    } else {
      // Create new document
      result = await client.create(docData)
      
      if (options.json) {
        console.log(JSON.stringify({ 
          success: true, 
          action: 'created', 
          id: result._id, 
          slug: frontMatter.slug,
          type: options.type
        }))
      } else {
        const studioUrl = `https://${config.projectId}.sanity.studio/desk/${options.type === 'article' ? 'articles' : options.type};${result._id}`
        console.log(`✅ ${options.type} created   id=${result._id} slug=${frontMatter.slug} url=${studioUrl}`)
      }
    }

    clearTimeout(timeout)
    
  } catch (error) {
    clearTimeout(timeout)
    throw error
  }
}

/**
 * Read and parse markdown file
 */
async function readMarkdownFile(filePath: string): Promise<{ frontMatter: FrontMatter; content: string }> {
  try {
    const absolutePath = path.resolve(filePath)
    
    if (!fs.existsSync(absolutePath)) {
      throw new Error(`File not found: ${absolutePath}`)
    }
    
    const fileContent = fs.readFileSync(absolutePath, 'utf-8')
    const { data: frontMatter, content } = matter(fileContent)
    
    return { frontMatter: frontMatter as FrontMatter, content }
  } catch (error) {
    console.error(`❌ [30] File Error: ${error}`)
    process.exit(EXIT_CODES.FILE_ERROR)
  }
}

/**
 * Validate front matter fields
 */
function validateFrontMatter(frontMatter: any): asserts frontMatter is FrontMatter {
  const requiredFields = ['title', 'slug', 'publishedAt']
  const missingFields = requiredFields.filter(field => !frontMatter[field])
  
  if (missingFields.length > 0) {
    console.error(`❌ [10] Front-Matter Validation Error: Missing required fields: ${missingFields.join(', ')}`)
    process.exit(EXIT_CODES.VALIDATION_ERROR)
  }
  
  // Validate publishedAt is valid ISO 8601 date
  const publishedAt = new Date(frontMatter.publishedAt)
  if (isNaN(publishedAt.getTime())) {
    console.error('❌ [10] Front-Matter Validation Error: publishedAt must be a valid ISO 8601 date')
    process.exit(EXIT_CODES.VALIDATION_ERROR)
  }
  
  // Validate tags is array if provided
  if (frontMatter.tags && !Array.isArray(frontMatter.tags)) {
    console.error('❌ [10] Front-Matter Validation Error: tags must be an array')
    process.exit(EXIT_CODES.VALIDATION_ERROR)
  }
  
  // Validate ogImage is URL if provided
  if (frontMatter.ogImage && !isValidUrl(frontMatter.ogImage)) {
    console.error('❌ [10] Front-Matter Validation Error: ogImage must be a valid URL')
    process.exit(EXIT_CODES.VALIDATION_ERROR)
  }
}

/**
 * Check if string is valid URL
 */
function isValidUrl(string: string): boolean {
  try {
    new URL(string)
    return true
  } catch {
    return false
  }
}

/**
 * Handle errors with appropriate exit codes
 */
function handleError(error: unknown): never {
  const errorMessage = error instanceof Error ? error.message : String(error)
  
  if (errorMessage.includes('401') || errorMessage.includes('Unauthorized')) {
    console.error('❌ [20] Sanity API Error: 401 Unauthorized - Check your SANITY_API_TOKEN')
    process.exit(EXIT_CODES.SANITY_API_ERROR)
  } else if (errorMessage.includes('403') || errorMessage.includes('Forbidden')) {
    console.error('❌ [20] Sanity API Error: 403 Forbidden - Insufficient permissions')
    process.exit(EXIT_CODES.SANITY_API_ERROR)
  } else if (errorMessage.includes('404') || errorMessage.includes('Not Found')) {
    console.error('❌ [20] Sanity API Error: 404 Not Found - Check project ID and dataset')
    process.exit(EXIT_CODES.SANITY_API_ERROR)
  } else if (errorMessage.toLowerCase().includes('sanity') || errorMessage.toLowerCase().includes('api')) {
    console.error(`❌ [20] Sanity API Error: ${errorMessage}`)
    process.exit(EXIT_CODES.SANITY_API_ERROR)
  } else {
    console.error(`❌ [30] Unexpected Error: ${errorMessage}`)
    process.exit(EXIT_CODES.FILE_ERROR)
  }
}

/**
 * Print usage information
 */
function printUsage(): void {
  console.log(`
Usage: npm run post <filePath> [options]

Arguments:
  filePath                    Path to markdown file with front matter

Options:
  --force-new                 Force creation of new document even if slug exists
  --dataset <name>            Override SANITY_DATASET environment variable
  --type <schema>             Document schema type (default: article)
  --json                      Output results in JSON format
  --help, -h                  Show this help message

Environment Variables:
  SANITY_PROJECT_ID           Sanity project ID (required)
  SANITY_DATASET              Sanity dataset (default: production)
  SANITY_API_TOKEN            Sanity API token with write permissions (required)

Examples:
  npm run post ./content/my-first-post.md
  npm run post ./content/draft.md --type article
  npm run post ./content/draft.md --force-new
  npm run post ./content/post.md --dataset development --json
  npm run post ./content/legacy.md --type post

Exit Codes:
  0   Success
  10  Front-Matter Validation Error
  20  Sanity API Error
  30  File/FS Error
  40  Timeout
`)
}

// Execute main function with async IIFE
(async () => {
  await main()
})().catch((error) => {
  handleError(error)
})