// schemas/post.js
import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  fields: [
    defineField({
      name: 'translationStatus',
      title: 'Translation Status',
      type: 'string',
      initialValue: 'pending',
      options: {
        list: [
          { title: 'Pending', value: 'pending' },
          { title: 'In Progress', value: 'inProgress' },
          { title: 'Done', value: 'done' },
        ],
        layout: 'dropdown',
      },
      description: '翻訳の進行状況 (n8n が自動更新)'
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
        slugify: input => input.toLowerCase().replace(/\s+/g, '-').slice(0, 96),
      },
      hidden: true,
      readOnly: true,
      validation: Rule => Rule.required(),
    }),
  ],
})
