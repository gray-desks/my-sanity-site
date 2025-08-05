import { describe, it, expect } from 'vitest'
import { mdToPortableText } from '../scripts/markdown.ts'

describe('mdToPortableText', () => {
  it('converts simple paragraph to portable text', async () => {
    const markdown = 'This is a simple paragraph.'
    const result = await mdToPortableText(markdown)
    
    expect(result).toHaveLength(1)
    expect(result[0]).toMatchObject({
      _type: 'block',
      style: 'normal',
      children: [
        {
          _type: 'span',
          text: 'This is a simple paragraph.',
          marks: []
        }
      ]
    })
  })

  it('converts headings to portable text with correct styles', async () => {
    const markdown = `# Heading 1

## Heading 2

### Heading 3`
    
    const result = await mdToPortableText(markdown)
    
    expect(result).toHaveLength(3)
    expect(result[0].style).toBe('h1')
    expect(result[1].style).toBe('h2')
    expect(result[2].style).toBe('h3')
  })

  it('converts multiple paragraphs', async () => {
    const markdown = `First paragraph.

Second paragraph.`
    
    const result = await mdToPortableText(markdown)
    
    expect(result).toHaveLength(2)
    expect(result[0].children[0].text).toBe('First paragraph.')
    expect(result[1].children[0].text).toBe('Second paragraph.')
  })

  it('handles strong and emphasis text', async () => {
    const markdown = 'This is **bold** and *italic* text.'
    const result = await mdToPortableText(markdown)
    
    expect(result).toHaveLength(1)
    const spans = result[0].children
    
    // Should have spans for: "This is ", "bold", " and ", "italic", " text."
    expect(spans.length).toBeGreaterThan(1)
    
    // Check that bold span has strong mark
    const boldSpan = spans.find((span: any) => span.marks?.includes('strong'))
    expect(boldSpan).toBeDefined()
    expect(boldSpan.text).toBe('bold')
    
    // Check that italic span has em mark  
    const italicSpan = spans.find((span: any) => span.marks?.includes('em'))
    expect(italicSpan).toBeDefined()
    expect(italicSpan.text).toBe('italic')
  })

  it('converts code blocks', async () => {
    const markdown = '```\nconst x = 1;\n```'
    const result = await mdToPortableText(markdown)
    
    expect(result).toHaveLength(1)
    expect(result[0].children[0].text).toBe('const x = 1;')
    expect(result[0].children[0].marks).toContain('code')
  })

  it('handles inline code', async () => {
    const markdown = 'Use `console.log()` to debug.'
    const result = await mdToPortableText(markdown)
    
    expect(result).toHaveLength(1)
    const spans = result[0].children
    
    const codeSpan = spans.find((span: any) => span.marks?.includes('code'))
    expect(codeSpan).toBeDefined()
    expect(codeSpan.text).toBe('console.log()')
  })

  it('handles blockquotes', async () => {
    const markdown = '> This is a quote.'
    const result = await mdToPortableText(markdown)
    
    expect(result).toHaveLength(1)
    expect(result[0].style).toBe('blockquote')
    expect(result[0].children[0].text).toBe('This is a quote.')
  })

  it('falls back to plain text on conversion failure', async () => {
    // Mock console.warn to avoid noise in tests
    const originalWarn = console.warn
    console.warn = () => {}
    
    try {
      const markdown = 'Simple text'
      const result = await mdToPortableText(markdown, { fallbackToPlainText: true })
      
      expect(result).toHaveLength(1)
      expect(result[0]._type).toBe('block')
      expect(result[0].style).toBe('normal')
    } finally {
      console.warn = originalWarn
    }
  })

  it('generates unique keys for elements', async () => {
    const markdown = `# Heading

Paragraph text.`
    
    const result = await mdToPortableText(markdown)
    
    // Check that all blocks have unique _key values
    const keys = result.map(block => block._key)
    const uniqueKeys = new Set(keys)
    expect(uniqueKeys.size).toBe(keys.length)
    
    // Check that spans also have keys
    for (const block of result) {
      const spanKeys = block.children.map((span: any) => span._key)
      const uniqueSpanKeys = new Set(spanKeys)
      expect(uniqueSpanKeys.size).toBe(spanKeys.length)
    }
  })

  it('handles empty markdown', async () => {
    const markdown = ''
    const result = await mdToPortableText(markdown)
    
    expect(result).toHaveLength(0)
  })

  it('handles links in markdown', async () => {
    const markdown = 'Visit [OpenAI](https://openai.com) for more info.'
    const result = await mdToPortableText(markdown)
    
    expect(result).toHaveLength(1)
    const spans = result[0].children
    
    // Should include the link text and URL
    const textContent = spans.map((span: any) => span.text).join('')
    expect(textContent).toContain('OpenAI')
    expect(textContent).toContain('https://openai.com')
  })
})