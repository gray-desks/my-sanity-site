import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {documentInternationalization} from '@sanity/document-internationalization'
import schemaTypes from './schema/index'

export default defineConfig({
  name: 'default',
  title: 'my-sanity-site',

  projectId: 'fcz6on8p',
  dataset: 'production',

  plugins: [
    structureTool(),
    visionTool(),
    documentInternationalization({
      supportedLanguages: [
        {id: 'ja', title: '日本語'},
        {id: 'en', title: 'English'},
        {id: 'zh-cn', title: '中文（简体）'},
        {id: 'fr', title: 'Français'},
        {id: 'de', title: 'Deutsch'},
        {id: 'es', title: 'Español'},
        {id: 'it', title: 'Italiano'},
        {id: 'pt', title: 'Português'},
        {id: 'ru', title: 'Русский'},
        {id: 'ko', title: '한국어'},
        {id: 'th', title: 'ไทย'},
        {id: 'vi', title: 'Tiếng Việt'},
        {id: 'id', title: 'Bahasa Indonesia'},
        {id: 'ms', title: 'Bahasa Melayu'},
        {id: 'fil', title: 'Filipino'},
        {id: 'hi', title: 'हिन्दी'},
        {id: 'ar', title: 'العربية'},
        {id: 'tr', title: 'Türkçe'},
        {id: 'nl', title: 'Nederlands'},
        {id: 'sv', title: 'Svenska'},
      ],
      schemaTypes: ['post', 'article'],
    }),
  ],

  schema: {
    types: schemaTypes,
  },
})
