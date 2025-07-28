import { supportedLanguages } from './supportedLanguages.js'

export default function deskStructure(S) {
  return S.list()
    .title('Content')
    .items(
      supportedLanguages.map(({ id, title }) =>
        S.listItem()
          .title(title)
          .id(`lang-${id}`)
          .child(
            S.documentTypeList('article')
              .title('Articles')
              .filter('_type == "article" && __i18n_lang == $lang')
              .params({ lang: id })
              .initialValueTemplates([
                S.initialValueTemplateItem('article', {lang: id})
              ])
          )
      )
    )
}
