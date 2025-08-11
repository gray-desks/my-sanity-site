// schemas/article.js
import { defineType, defineField } from 'sanity'
import { supportedLanguages } from '../supportedLanguages.js'

// Fallback: ensure these languages are always present in the dropdown even if
// Studio picks up a stale supportedLanguages during deploy/cache.
const REQUIRED_LANG_IDS = ['fi', 'da', 'sv', 'pl', 'nl']
const uniqueLangIds = Array.from(new Set([
  ...supportedLanguages.map(l => l.id),
  ...REQUIRED_LANG_IDS,
]))
const languageOptions = uniqueLangIds.map((id) => {
  const hit = supportedLanguages.find(l => l.id === id)
  return { title: hit?.title || id, value: id }
})

export default defineType({
  name: 'article',
  title: 'Article',
  type: 'document',
  fields: [
    defineField({
      name: 'textPaste',
      title: '📝 記事テキスト一括入力',
      type: 'string',
      description: 'ChatGPTで生成した記事をここに貼り付けて自動変換',
      components: {
        input: () => import('../components/TextPasteInput.jsx').then(mod => mod.default)
      },
      hidden: ({ document }) => !!document?.title && !!document?.content
    }),
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
      name: 'lang',
      title: 'Language',
      type: 'string',
      options: {
        list: languageOptions,
        layout: 'dropdown'
      },
      validation: Rule => Rule.required(),
      initialValue: 'ja', // Default to Japanese
    }),
    defineField({
      name: 'translationOf',
      title: 'Translation of',
      type: 'reference',
      to: [{type: 'article'}],
      weak: true,
      hidden: ({document}) => document?.lang === 'ja',
      description: 'Reference to the master article this is a translation of'
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
      name: 'placeName',
      title: 'Place Name',
      type: 'string',
      description: ({ document }) => {
        const lang = document?.lang;
        switch (lang) {
          case 'ja': return '場所名（オプション）';
          case 'en': return 'Location name (optional)';
          case 'zh-cn': return '地点名（可选）';
          case 'ko': return '장소명 (선택)';
          default: return 'Place name (optional)';
        }
      }
    }),
    defineField({
      name: 'prefecture',
      title: 'Prefecture',
      type: 'string',
      options: {
        list: [
          { title: '北海道', value: 'hokkaido' },
          { title: '青森県', value: 'aomori' },
          { title: '岩手県', value: 'iwate' },
          { title: '宮城県', value: 'miyagi' },
          { title: '秋田県', value: 'akita' },
          { title: '山形県', value: 'yamagata' },
          { title: '福島県', value: 'fukushima' },
          { title: '茨城県', value: 'ibaraki' },
          { title: '栃木県', value: 'tochigi' },
          { title: '群馬県', value: 'gunma' },
          { title: '埼玉県', value: 'saitama' },
          { title: '千葉県', value: 'chiba' },
          { title: '東京都', value: 'tokyo' },
          { title: '神奈川県', value: 'kanagawa' },
          { title: '新潟県', value: 'niigata' },
          { title: '富山県', value: 'toyama' },
          { title: '石川県', value: 'ishikawa' },
          { title: '福井県', value: 'fukui' },
          { title: '山梨県', value: 'yamanashi' },
          { title: '長野県', value: 'nagano' },
          { title: '岐阜県', value: 'gifu' },
          { title: '静岡県', value: 'shizuoka' },
          { title: '愛知県', value: 'aichi' },
          { title: '三重県', value: 'mie' },
          { title: '滋賀県', value: 'shiga' },
          { title: '京都府', value: 'kyoto' },
          { title: '大阪府', value: 'osaka' },
          { title: '兵庫県', value: 'hyogo' },
          { title: '奈良県', value: 'nara' },
          { title: '和歌山県', value: 'wakayama' },
          { title: '鳥取県', value: 'tottori' },
          { title: '島根県', value: 'shimane' },
          { title: '岡山県', value: 'okayama' },
          { title: '広島県', value: 'hiroshima' },
          { title: '山口県', value: 'yamaguchi' },
          { title: '徳島県', value: 'tokushima' },
          { title: '香川県', value: 'kagawa' },
          { title: '愛媛県', value: 'ehime' },
          { title: '高知県', value: 'kochi' },
          { title: '福岡県', value: 'fukuoka' },
          { title: '佐賀県', value: 'saga' },
          { title: '長崎県', value: 'nagasaki' },
          { title: '熊本県', value: 'kumamoto' },
          { title: '大分県', value: 'oita' },
          { title: '宮崎県', value: 'miyazaki' },
          { title: '鹿児島県', value: 'kagoshima' },
          { title: '沖縄県', value: 'okinawa' }
        ]
      },
      validation: Rule => Rule.required(),
      description: ({ document }) => {
        const lang = document?.lang;
        switch (lang) {
          case 'ja': return '都道府県を選択してください';
          case 'en': return 'Select prefecture';
          case 'zh-cn': return '选择都道府县';
          case 'ko': return '도도부현을 선택하세요';
          default: return 'Select prefecture';
        }
      }
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: {
        hotspot: true
      },
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
      description: ({ document }) => {
        const lang = document?.lang;
        switch (lang) {
          case 'ja': return '最大12枚まで';
          case 'en': return 'Maximum 12 images';
          case 'zh-cn': return '最多12张图片';
          case 'ko': return '최대 12장';
          default: return 'Maximum 12 images';
        }
      }
    }),
    defineField({
      name: 'content',
      title: 'Content',
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
      ],
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags'
      },
      description: ({ document }) => {
        const lang = document?.lang;
        switch (lang) {
          case 'ja': return 'タグ（任意）';
          case 'en': return 'Tags (optional)';
          case 'zh-cn': return '标签（可選）';
          case 'ko': return '태그 (선택)';
          default: return 'Tags (optional)';
        }
      }
    })
  ],
  preview: {
    select: {
      title: 'title',
      media: 'coverImage',
      type: 'type',
      lang: '__i18n_lang'
    },
    prepare({ title, media, type, lang }) {
      return {
        title,
        subtitle: `${type} (${lang})`,
        media
      }
    }
  }
})