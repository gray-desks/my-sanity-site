// templates/articleWithLang.js
// Custom initial value template to pre-set language based on the
// selected folder in the custom Desk structure.
export default {
  id: 'articleWithLang',
  title: 'Article',
  schemaType: 'article',
  parameters: [{ name: 'lang', title: 'Language', type: 'string' }],
  value: (params) => ({
    __i18n_lang: params.lang,
    translationStatus: 'pending',
  }),
};
