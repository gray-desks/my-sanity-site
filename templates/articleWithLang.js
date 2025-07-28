// templates/articleWithLang.js
// Custom initial value template to pre-set language based on the
// selected folder in the custom Desk structure.
export default {
  id: 'article',
  title: 'Article',
  schemaType: 'article',
  parameters: [{ name: 'lang', title: 'Language', type: 'string' }],
  value: (params) => ({
    __i18n_lang: params.lang,
    __i18n_base: undefined,
    __i18n_refs: [],
  }),
};
