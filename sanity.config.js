import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import deskStructure from './deskStructure.js'
import {visionTool} from '@sanity/vision'
import schemaTypes from './schema/index'

export default defineConfig({
  name: 'default',
  title: 'my-sanity-site',

  projectId: 'fcz6on8p',
  dataset: 'production',

  plugins: [
    structureTool({structure: deskStructure}),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
    templates: (prev) => [
      ...prev,
      {
        id: 'article-with-lang',
        title: 'Article with Language',
        schemaType: 'article',
        parameters: [{name: 'lang', type: 'string'}],
        value: (params) => ({
          lang: params.lang
        })
      }
    ]
  },
})
