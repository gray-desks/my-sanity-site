import { remark } from 'remark'
import remarkParse from 'remark-parse'
import { PortableTextBlock } from '@sanity/types'

export interface MarkdownConversionOptions {
  fallbackToPlainText?: boolean
}

/**
 * Convert Markdown to Sanity Portable Text format
 * Uses remark ecosystem for parsing and conversion
 * Falls back to plain text if conversion fails and fallbackToPlainText is true
 */
export async function mdToPortableText(
  markdown: string,
  options: MarkdownConversionOptions = {}
): Promise<PortableTextBlock[]> {
  const { fallbackToPlainText = true } = options

  try {
    // Parse markdown using remark
    const processor = remark().use(remarkParse)
    const mdAST = processor.parse(markdown)

    // Convert to Portable Text blocks
    const portableTextBlocks: PortableTextBlock[] = []

    // Process each node in the markdown AST
    for (const node of mdAST.children) {
      const block = await convertNodeToPortableText(node)
      if (block) {
        portableTextBlocks.push(block)
      }
    }

    return portableTextBlocks
  } catch (error) {
    console.warn(`❌ Markdown conversion failed: ${error}`)
    
    if (fallbackToPlainText) {
      console.warn('📝 Falling back to plain text conversion')
      return createPlainTextBlocks(markdown)
    }
    
    throw error
  }
}

/**
 * Convert a single markdown AST node to Portable Text block
 */
async function convertNodeToPortableText(node: any): Promise<PortableTextBlock | null> {
  switch (node.type) {
    case 'heading':
      return {
        _type: 'block',
        _key: generateKey(),
        style: `h${node.depth}`,
        children: convertInlineNodes(node.children),
        markDefs: [],
      }

    case 'paragraph':
      return {
        _type: 'block',
        _key: generateKey(),
        style: 'normal',
        children: convertInlineNodes(node.children),
        markDefs: [],
      }

    case 'list': {
      // Convert list items
      const listItems: PortableTextBlock[] = []
      for (const listItem of node.children) {
        if (listItem.type === 'listItem') {
          for (const paragraph of listItem.children) {
            if (paragraph.type === 'paragraph') {
              listItems.push({
                _type: 'block',
                _key: generateKey(),
                style: node.ordered ? 'normal' : 'normal',
                listItem: node.ordered ? 'number' : 'bullet',
                children: convertInlineNodes(paragraph.children),
                markDefs: [],
              })
            }
          }
        }
      }
      return listItems.length > 0 ? listItems[0] : null
    }

    case 'code':
      return {
        _type: 'block',
        _key: generateKey(),
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: generateKey(),
            text: node.value,
            marks: ['code'],
          },
        ],
        markDefs: [],
      }

    case 'blockquote': {
      // Handle blockquote content
      const quoteChildren = node.children
        .filter((child: any) => child.type === 'paragraph')
        .flatMap((para: any) => convertInlineNodes(para.children))

      return {
        _type: 'block',
        _key: generateKey(),
        style: 'blockquote',
        children: quoteChildren,
        markDefs: [],
      }
    }

    default:
      // For unknown node types, try to extract text
      if (node.value && typeof node.value === 'string') {
        return {
          _type: 'block',
          _key: generateKey(),
          style: 'normal',
          children: [
            {
              _type: 'span',
              _key: generateKey(),
              text: node.value,
              marks: [],
            },
          ],
          markDefs: [],
        }
      }
      
      return null
  }
}

/**
 * Convert inline markdown nodes to Portable Text spans
 */
function convertInlineNodes(nodes: any[]): any[] {
  const spans: any[] = []

  for (const node of nodes) {
    switch (node.type) {
      case 'text':
        spans.push({
          _type: 'span',
          _key: generateKey(),
          text: node.value,
          marks: [],
        })
        break

      case 'strong':
        spans.push(...convertInlineNodes(node.children).map(span => ({
          ...span,
          marks: [...(span.marks || []), 'strong'],
        })))
        break

      case 'emphasis':
        spans.push(...convertInlineNodes(node.children).map(span => ({
          ...span,
          marks: [...(span.marks || []), 'em'],
        })))
        break

      case 'inlineCode':
        spans.push({
          _type: 'span',
          _key: generateKey(),
          text: node.value,
          marks: ['code'],
        })
        break

      case 'link': {
        const linkKey = generateKey()
        spans.push(...convertInlineNodes(node.children).map(span => ({
          ...span,
          marks: [...(span.marks || []), linkKey],
        })))
        
        // Add link definition to markDefs (this should be handled at block level)
        // For now, we'll create a simple text representation
        spans.push({
          _type: 'span',
          _key: generateKey(),
          text: ` (${node.url})`,
          marks: [],
        })
        break
      }

      default:
        // Extract text from unknown inline nodes
        if (node.value && typeof node.value === 'string') {
          spans.push({
            _type: 'span',
            _key: generateKey(),
            text: node.value,
            marks: [],
          })
        }
        break
    }
  }

  return spans
}

/**
 * Create simple plain text blocks as fallback
 */
function createPlainTextBlocks(text: string): PortableTextBlock[] {
  const paragraphs = text.split('\n\n').filter(p => p.trim())
  
  return paragraphs.map(paragraph => ({
    _type: 'block',
    _key: generateKey(),
    style: 'normal',
    children: [
      {
        _type: 'span',
        _key: generateKey(),
        text: paragraph.trim(),
        marks: [],
      },
    ],
    markDefs: [],
  }))
}

/**
 * Generate a unique key for Portable Text elements
 */
function generateKey(): string {
  return Math.random().toString(36).substring(2, 15)
}