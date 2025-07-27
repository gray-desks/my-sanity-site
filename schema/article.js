// schemas/article.js
import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'article',
  title: 'Article',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
        slugify: input => input
          .toLowerCase()
          .replace(/\s+/g, '-')
          .slice(0, 96)
      },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'type',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          { title: 'スポット', value: 'spot' },
          { title: '食事', value: 'food' },
          { title: '交通', value: 'transport' },
          { title: 'ホテル', value: 'hotel' },
          { title: 'メモ', value: 'note' }
        ]
      },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'geopoint'
    }),
    defineField({
      name: 'placeName',
      title: 'Place Name',
      type: 'string',
      description: '場所名（オプション）'
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      initialValue: () => new Date().toISOString()
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: {
        hotspot: true
      },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      of: [{
        type: 'image',
        options: {
          hotspot: true
        }
      }],
      validation: Rule => Rule.max(12),
      description: '最大12枚まで'
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [
        {
          type: 'block'
        },
        {
          type: 'image',
          options: {
            hotspot: true
          }
        },
        {
          type: 'affiliate'
        }
      ]
    }),
    defineField({
      name: 'lang',
      title: 'Language',
      type: 'string',
      options: {
        list: [
          { title: '日本語', value: 'ja' },
          { title: 'English', value: 'en' },
          { title: '中文（简体）', value: 'zh-cn' },
          { title: 'Français', value: 'fr' },
          { title: 'Deutsch', value: 'de' },
          { title: 'Español', value: 'es' },
          { title: 'Italiano', value: 'it' },
          { title: 'Português', value: 'pt' },
          { title: 'Русский', value: 'ru' },
          { title: '한국어', value: 'ko' },
          { title: 'ไทย', value: 'th' },
          { title: 'Tiếng Việt', value: 'vi' },
          { title: 'Bahasa Indonesia', value: 'id' },
          { title: 'Bahasa Melayu', value: 'ms' },
          { title: 'Filipino', value: 'fil' },
          { title: 'हिन्दी', value: 'hi' },
          { title: 'العربية', value: 'ar' },
          { title: 'Türkçe', value: 'tr' },
          { title: 'Nederlands', value: 'nl' },
          { title: 'Svenska', value: 'sv' }
        ]
      },
      initialValue: 'ja',
      validation: Rule => Rule.required()
    })
  ],
  preview: {
    select: {
      title: 'title',
      media: 'coverImage',
      type: 'type',
      lang: 'lang'
    },
    prepare({ title, media, type, lang }) {
      return {
        title: title,
        subtitle: `${type} (${lang})`,
        media: media
      }
    }
  }
})