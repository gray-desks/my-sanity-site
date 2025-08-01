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
      
      // Language-specific views for easy filtering
      S.divider(),
      
      S.listItem()
        .title('📊 By Language')
        .id('by-language')
        .child(
          S.list()
            .title('Articles by Language')
            .items([
              S.listItem()
                .title('🇯🇵 Japanese')
                .child(
                  S.documentTypeList('article')
                    .title('Japanese Articles')
                    .filter('_type == "article" && lang == "ja"')
                ),
              S.listItem()
                .title('🇺🇸 English')
                .child(
                  S.documentTypeList('article')
                    .title('English Articles')
                    .filter('_type == "article" && lang == "en"')
                ),
              S.listItem()
                .title('🇨🇳 Chinese')
                .child(
                  S.documentTypeList('article')
                    .title('Chinese Articles')
                    .filter('_type == "article" && lang == "zh-cn"')
                ),
              S.listItem()
                .title('🇰🇷 Korean')
                .child(
                  S.documentTypeList('article')
                    .title('Korean Articles')
                    .filter('_type == "article" && lang == "ko"')
                ),
            ])
        ),
      
      S.divider(),
      
      S.listItem()
        .title('📝 By Type')
        .id('by-type')
        .child(
          S.list()
            .title('Articles by Type')
            .items([
              S.listItem()
                .title('🏯 Spots')
                .child(
                  S.documentTypeList('article')
                    .title('Spot Articles')
                    .filter('_type == "article" && type == "spot"')
                ),
              S.listItem()
                .title('🍜 Food')
                .child(
                  S.documentTypeList('article')
                    .title('Food Articles')
                    .filter('_type == "article" && type == "food"')
                ),
              S.listItem()
                .title('🚇 Transport')
                .child(
                  S.documentTypeList('article')
                    .title('Transport Articles')
                    .filter('_type == "article" && type == "transport"')
                ),
              S.listItem()
                .title('🏨 Hotels')
                .child(
                  S.documentTypeList('article')
                    .title('Hotel Articles')
                    .filter('_type == "article" && type == "hotel"')
                ),
              S.listItem()
                .title('📋 Notes')
                .child(
                  S.documentTypeList('article')
                    .title('Note Articles')
                    .filter('_type == "article" && type == "note"')
                ),
            ])
        ),
    ])
}
