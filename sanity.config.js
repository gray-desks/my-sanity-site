import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import deskStructure from './deskStructure.js'
import {visionTool} from '@sanity/vision'
import {documentInternationalization} from '@sanity/document-internationalization'
import schemaTypes from './schema/index'
import articleWithLang from './templates/articleWithLang.js'

export default defineConfig({
  name: 'default',
  title: 'my-sanity-site',

  projectId: 'fcz6on8p',
  dataset: 'production',

  plugins: [
    structureTool({structure: deskStructure}),
    visionTool(),
    documentInternationalization({
      supportedLanguages: [
        // Phase 1: 基幹7言語
        {id: 'ja', title: '日本語'},
        {id: 'en', title: 'English'},
        {id: 'zh-cn', title: '中文（简体）'},
        {id: 'zh-tw', title: '中文（繁體）'},
        {id: 'ko', title: '한국어'},
        {id: 'th', title: 'ไทย'},
        {id: 'vi', title: 'Tiếng Việt'},
        
        // Phase 2: 拡張6言語
        {id: 'id', title: 'Bahasa Indonesia'},
        {id: 'ms', title: 'Bahasa Melayu'},
        {id: 'tl', title: 'Filipino'},
        {id: 'fr', title: 'Français'},
        {id: 'de', title: 'Deutsch'},
        {id: 'es', title: 'Español'},
        
        // Phase 3: 多様化7言語
        {id: 'it', title: 'Italiano'},
        {id: 'pt', title: 'Português'},
        {id: 'ru', title: 'Русский'},
        {id: 'ar', title: 'العربية'},
        {id: 'hi', title: 'हिन्दी'},
        {id: 'tr', title: 'Türkçe'},
        {id: 'pt-br', title: 'Português (Brasil)'},
      ],
      schemaTypes: ['post', 'article'],
    }),
  ],


  studio: {
    templates: [articleWithLang],
  },
  schema: {
    types: schemaTypes,
  },
})
