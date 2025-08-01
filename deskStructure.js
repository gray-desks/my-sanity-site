export default function deskStructure(S) {
  return S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Articles')
        .id('articles')
        .child(
          S.documentTypeList('article')
            .title('All Articles')
            .filter('_type == "article"')
        ),
    ])
}