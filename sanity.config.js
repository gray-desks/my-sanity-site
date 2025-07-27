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
      ],
      schemaTypes: ['post'],
    }),
  ],

  schema: {
    types: schemaTypes,
  },
})
