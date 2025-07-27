// schemas/affiliate.js
import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'affiliate',
  title: 'Affiliate Block',
  type: 'object',
  fields: [
    defineField({
      name: 'service',
      title: 'Service',
      type: 'string',
      options: {
        list: [
          { title: 'Booking.com', value: 'booking' },
          { title: 'Rakuten Travel', value: 'rakuten' },
          { title: 'Klook', value: 'klook' }
        ]
      },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'url',
      title: 'Affiliate URL',
      type: 'url',
      validation: Rule => Rule.required().uri({
        scheme: ['http', 'https']
      })
    }),
    defineField({
      name: 'title',
      title: 'Display Title',
      type: 'string',
      description: '表示タイトル（オプション）'
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      description: '説明文（オプション）'
    })
  ],
  preview: {
    select: {
      title: 'title',
      service: 'service',
      url: 'url'
    },
    prepare({ title, service, url }) {
      return {
        title: title || `${service} affiliate`,
        subtitle: url
      }
    }
  }
})