// Testable functions extracted from post.ts for unit testing

import { createClient } from '@sanity/client'
import * as fs from 'fs'
import * as path from 'path'
import matter from 'gray-matter'
import { mdToPortableText } from './markdown.ts'

// Exit codes
export const EXIT_CODES = {
  SUCCESS: 0,
  VALIDATION_ERROR: 10,
  SANITY_API_ERROR: 20,  
  FILE_ERROR: 30,
  TIMEOUT: 40,
} as const

// Interfaces
export interface Config {
  projectId: string
  dataset: string
  apiToken: string
}

export interface FrontMatter {
  title: string
  slug: string
  publishedAt: string
  excerpt?: string
  tags?: string[]
  ogImage?: string
  author?: string
}

export interface CLIOptions {
  filePath: string
  forceNew: boolean
  dataset: string
  json: boolean
  type: string
}

/**
 * Parse command line arguments
 */
export function parseArgs(): CLIOptions {
  const args = process.argv.slice(2)
  
  if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    throw new Error('Help requested')
  }

  const filePath = args[0]
  const forceNew = args.includes('--force-new')
  const datasetIndex = args.indexOf('--dataset')
  const dataset = datasetIndex !== -1 && args[datasetIndex + 1] ? args[datasetIndex + 1] : 'production'
  const json = args.includes('--json')
  const typeIndex = args.indexOf('--type')
  const type = typeIndex !== -1 && args[typeIndex + 1] ? args[typeIndex + 1] : 'article'

  if (!filePath) {
    throw new Error('File path is required')
  }

  return { filePath, forceNew, dataset, json, type }
}

/**
 * Load configuration from environment variables
 */
export function loadConfig(options: CLIOptions): Config {
  const projectId = process.env.SANITY_PROJECT_ID
  const dataset = process.env.SANITY_DATASET || options.dataset
  const apiToken = process.env.SANITY_API_TOKEN

  if (!projectId || !apiToken) {
    throw new Error('Missing required environment variables: SANITY_PROJECT_ID, SANITY_API_TOKEN')
  }

  return { projectId, dataset, apiToken }
}

/**
 * Process the markdown file and post to Sanity
 */
export async function processMarkdownFile(options: CLIOptions, config: Config): Promise<void> {
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
}

/**
 * Read and parse markdown file
 */
export async function readMarkdownFile(filePath: string): Promise<{ frontMatter: FrontMatter; content: string }> {
  const absolutePath = path.resolve(filePath)
  
  if (!fs.existsSync(absolutePath)) {
    throw new Error(`File not found: ${absolutePath}`)
  }
  
  const fileContent = fs.readFileSync(absolutePath, 'utf-8')
  const { data: frontMatter, content } = matter(fileContent)
  
  return { frontMatter: frontMatter as FrontMatter, content }
}

/**
 * Validate front matter fields
 */
export function validateFrontMatter(frontMatter: any): asserts frontMatter is FrontMatter {
  const requiredFields = ['title', 'slug', 'publishedAt']
  const missingFields = requiredFields.filter(field => !frontMatter[field])
  
  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(', ')}`)
  }
  
  // Validate publishedAt is valid ISO 8601 date
  const publishedAt = new Date(frontMatter.publishedAt)
  if (isNaN(publishedAt.getTime())) {
    throw new Error('publishedAt must be a valid ISO 8601 date')
  }
  
  // Validate tags is array if provided
  if (frontMatter.tags && !Array.isArray(frontMatter.tags)) {
    throw new Error('tags must be an array')
  }
  
  // Validate ogImage is URL if provided
  if (frontMatter.ogImage && !isValidUrl(frontMatter.ogImage)) {
    throw new Error('ogImage must be a valid URL')
  }
}

/**
 * Check if string is valid URL
 */
export function isValidUrl(string: string): boolean {
  try {
    new URL(string)
    return true
  } catch {
    return false
  }
}