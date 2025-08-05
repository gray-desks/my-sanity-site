import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import deskStructure from './deskStructure.js'
import {visionTool} from '@sanity/vision'
import {documentInternationalization} from '@sanity/document-internationalization'
import schemaTypes from './schema/index'
import {supportedLanguages} from './supportedLanguages.js'

export default defineConfig({
  name: 'default',
  title: 'my-sanity-site',

  projectId: 'fcz6on8p',
  dataset: 'production',

  plugins: [
    structureTool({structure: deskStructure}),
    visionTool(),
    documentInternationalization({
      supportedLanguages,
      schemaTypes: ['article'],
      languageField: 'lang',
      idStructure: 'delimiter',
      referenceBehavior: 'weak'
    }),
  ],

  schema: {
    types: schemaTypes,
  },
})
