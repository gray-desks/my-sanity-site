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
    // 位置情報フィールド（Google Maps 連携用）
    defineField({
      name: 'location',
      title: 'Location',
      type: 'geopoint',
      description: '緯度経度（Google Maps 用）'
    }),
    defineField({
      name: 'placeName',
      title: 'Place Name',
      type: 'string',
      description: '場所名（オプション）'
    }),
    // 旅行記・経費フィールド
    defineField({ 
      name: 'tripDate', 
      title: '旅行日', 
      type: 'date',
      description: '旅行実施日（経費計上用）'
    }),
    defineField({ 
      name: 'travelCost', 
      title: '交通費', 
      type: 'number',
      description: '交通費（円）'
    }),
    defineField({ 
      name: 'lodgingCost', 
      title: '宿泊費', 
      type: 'number',
      description: '宿泊費（円）'
    }),
    defineField({ 
      name: 'lang', 
      title: '言語', 
      type: 'string',
      options: {
        list: [
          { title: '日本語', value: 'ja' },
          { title: 'English', value: 'en' }
        ]
      },
      initialValue: 'ja'
    }),
  ]
})
