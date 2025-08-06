import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import * as fs from 'fs'
import { createClient } from '@sanity/client'

// Mock dependencies
vi.mock('@sanity/client')
vi.mock('fs')
vi.mock('../scripts/markdown.ts', () => ({
  mdToPortableText: vi.fn().mockResolvedValue([
    {
      _type: 'block',
      _key: 'test123',
      style: 'normal',
      children: [
        {
          _type: 'span',
          _key: 'span123',
          text: 'Test content',
          marks: []
        }
      ],
      markDefs: []
    }
  ])
}))

const mockClient = {
  fetch: vi.fn(),
  create: vi.fn(),
  patch: vi.fn().mockReturnValue({
    set: vi.fn().mockReturnValue({
      commit: vi.fn()
    })
  })
}

vi.mocked(createClient).mockReturnValue(mockClient as any)

describe('Post CLI Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    
    // Reset environment variables
    process.env.SANITY_PROJECT_ID = 'test-project'
    process.env.SANITY_API_TOKEN = 'test-token'
    process.env.SANITY_DATASET = 'production'
    
    // Mock file system
    vi.mocked(fs.existsSync).mockReturnValue(true)
    vi.mocked(fs.readFileSync).mockReturnValue(`---
title: "Test Post"
slug: "test-post"
publishedAt: "2024-01-15T10:00:00.000Z"
lang: "ja"
type: "note"
prefecture: "tokyo"
tags: ["test"]
placeName: "Test Place"
---

# Test Content

This is test content.`)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('creates new post when slug does not exist', async () => {
    // Mock no existing post
    mockClient.fetch.mockResolvedValue(null)
    mockClient.create.mockResolvedValue({
      _id: 'new-post-id',
      slug: { current: 'test-post' }
    })

    // Import and execute the post script logic
    const { processMarkdownFile } = await import('../scripts/post-testable.ts')
    
    const options = {
      filePath: 'test.md',
      forceNew: false,
      dataset: 'production',
      json: false,
      type: 'article'
    }
    
    const config = {
      projectId: 'test-project',
      dataset: 'production',
      apiToken: 'test-token'
    }

    await processMarkdownFile(options, config)

    expect(mockClient.create).toHaveBeenCalledWith({
      _type: 'article',
      title: 'Test Post',
      slug: { current: 'test-post' },
      publishedAt: '2024-01-15T10:00:00.000Z',
      lang: 'ja',
      type: 'note',
      prefecture: 'tokyo',
      tags: ['test'],
      placeName: 'Test Place',
      content: expect.any(Array)
    })
  })

  it('updates existing post when slug exists', async () => {
    // Mock existing post
    const existingPost = {
      _id: 'existing-post-id',
      slug: { current: 'test-post' }
    }
    mockClient.fetch.mockResolvedValue(existingPost)
    
    const commitMock = vi.fn().mockResolvedValue({
      _id: 'existing-post-id',
      slug: { current: 'test-post' }
    })
    const setMock = vi.fn().mockReturnValue({ commit: commitMock })
    const patchMock = vi.fn().mockReturnValue({ set: setMock })
    
    // Ensure the client mock has all required methods
    const fullMockClient = {
      ...mockClient,
      patch: patchMock
    }
    vi.mocked(createClient).mockReturnValue(fullMockClient as any)

    const { processMarkdownFile } = await import('../scripts/post-testable.ts')
    
    const options = {
      filePath: 'test.md',
      forceNew: false,
      dataset: 'production',
      json: false,
      type: 'article'
    }
    
    const config = {
      projectId: 'test-project',
      dataset: 'production',
      apiToken: 'test-token'
    }

    await processMarkdownFile(options, config)

    expect(patchMock).toHaveBeenCalledWith('existing-post-id')
    expect(setMock).toHaveBeenCalled()
    expect(commitMock).toHaveBeenCalled()
  })

  it('validates required front matter fields', async () => {
    vi.mocked(fs.readFileSync).mockReturnValue(`---
title: "Test Post"
# Missing slug and publishedAt
---

Content here.`)

    const { validateFrontMatter } = await import('../scripts/post-testable.ts')
    
    expect(() => {
      validateFrontMatter({ title: 'Test Post' })
    }).toThrow()
  })

  it('validates publishedAt is valid ISO date', async () => {
    const { validateFrontMatter } = await import('../scripts/post-testable.ts')
    
    expect(() => {
      validateFrontMatter({
        title: 'Test',
        slug: 'test',
        publishedAt: 'invalid-date'
      })
    }).toThrow()
  })

  it('validates tags is array if provided', async () => {
    const { validateFrontMatter } = await import('../scripts/post-testable.ts')
    
    expect(() => {
      validateFrontMatter({
        title: 'Test',
        slug: 'test',
        publishedAt: '2024-01-15T10:00:00.000Z',
        tags: 'not-an-array'
      })
    }).toThrow()
  })

  it('validates ogImage is valid URL if provided', async () => {
    const { validateFrontMatter } = await import('../scripts/post-testable.ts')
    
    expect(() => {
      validateFrontMatter({
        title: 'Test',
        slug: 'test',
        publishedAt: '2024-01-15T10:00:00.000Z',
        ogImage: 'not-a-url'
      })
    }).toThrow()
    
    // Valid URL should not throw
    expect(() => {
      validateFrontMatter({
        title: 'Test',
        slug: 'test',
        publishedAt: '2024-01-15T10:00:00.000Z',
        ogImage: 'https://example.com/image.jpg'
      })
    }).not.toThrow()
  })

  it('creates article with correct lang field from front matter', async () => {
    // Mock English article front matter
    vi.mocked(fs.readFileSync).mockReturnValue(`---
title: "English Article"
slug: "english-article"
publishedAt: "2024-01-15T10:00:00.000Z"
lang: en
type: spot
prefecture: tokyo
---

# English Content

This is English content.`)

    // Reset and setup mock client properly
    vi.mocked(createClient).mockReturnValue(mockClient as any)
    mockClient.fetch.mockResolvedValue(null)
    mockClient.create.mockResolvedValue({
      _id: 'english-post-id',
      slug: { current: 'english-article' }
    })

    // Re-import the markdown module to ensure mock is applied
    const { mdToPortableText } = await import('../scripts/markdown.ts')
    vi.mocked(mdToPortableText).mockResolvedValue([
      {
        _type: 'block',
        _key: 'test123',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'span123',
            text: 'English content',
            marks: []
          }
        ],
        markDefs: []
      }
    ])

    const { processMarkdownFile } = await import('../scripts/post-testable.ts')
    
    const options = {
      filePath: 'english-test.md',
      forceNew: false,
      dataset: 'production',
      json: false,
      type: 'article'
    }
    
    const config = {
      projectId: 'test-project',
      dataset: 'production',
      apiToken: 'test-token'
    }

    await processMarkdownFile(options, config)

    expect(mockClient.create).toHaveBeenCalledWith({
      _type: 'article',
      title: 'English Article',
      slug: { current: 'english-article' },
      publishedAt: '2024-01-15T10:00:00.000Z',
      content: expect.any(Array),
      lang: 'en', // Should use front matter lang
      type: 'spot', // Should use front matter type
      prefecture: 'tokyo'
    })
  })

  it('handles file not found error', async () => {
    vi.mocked(fs.existsSync).mockReturnValue(false)
    
    const { readMarkdownFile } = await import('../scripts/post-testable.ts')
    
    await expect(readMarkdownFile('nonexistent.md')).rejects.toThrow('File not found')
  })

  it('parses command line arguments correctly', async () => {
    const { parseArgs } = await import('../scripts/post-testable.ts')
    
    const originalArgv = process.argv
    process.argv = ['node', 'post.js', 'test.md', '--force-new', '--dataset', 'development', '--json']
    
    const result = parseArgs()
    
    expect(result).toEqual({
      filePath: 'test.md',
      forceNew: true,
      dataset: 'development',
      json: true,
      type: 'article'
    })
    
    process.argv = originalArgv
  })
})