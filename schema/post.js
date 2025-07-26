// schemas/post.js
import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'post',
  title: 'Blog Post',
  type: 'document',
  fields: [
    defineField({ name: 'title',      title: 'Title',      type: 'string' }),
    defineField({ name: 'slug',       title: 'Slug',       type: 'slug',   options: { source: 'title', maxLength: 96 } }),
    defineField({ name: 'publishedAt', title: 'Published at', type: 'datetime' }),
    defineField({ name: 'excerpt',    title: 'Excerpt',    type: 'text' }),
    defineField({ name: 'mainImage',  title: 'Main image', type: 'image' }),
    defineField({ name: 'content',    title: 'Content',    type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'tags',       title: 'Tags',       type: 'array', of: [{ type: 'string' }] }),
  ]
})
