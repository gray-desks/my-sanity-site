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
                .title('🇯🇵 日本語')
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
                .title('🇨🇳 中文（简体）')
                .child(
                  S.documentTypeList('article')
                    .title('Chinese Simplified Articles')
                    .filter('_type == "article" && lang == "zh-cn"')
                ),
              S.listItem()
                .title('🇹🇼 中文（繁體）')
                .child(
                  S.documentTypeList('article')
                    .title('Chinese Traditional Articles')
                    .filter('_type == "article" && lang == "zh-tw"')
                ),
              S.listItem()
                .title('🇰🇷 한국어')
                .child(
                  S.documentTypeList('article')
                    .title('Korean Articles')
                    .filter('_type == "article" && lang == "ko"')
                ),
              S.listItem()
                .title('🇹🇭 ไทย')
                .child(
                  S.documentTypeList('article')
                    .title('Thai Articles')
                    .filter('_type == "article" && lang == "th"')
                ),
              S.listItem()
                .title('🇻🇳 Tiếng Việt')
                .child(
                  S.documentTypeList('article')
                    .title('Vietnamese Articles')
                    .filter('_type == "article" && lang == "vi"')
                ),
              S.listItem()
                .title('🇮🇩 Bahasa Indonesia')
                .child(
                  S.documentTypeList('article')
                    .title('Indonesian Articles')
                    .filter('_type == "article" && lang == "id"')
                ),
              S.listItem()
                .title('🇲🇾 Bahasa Melayu')
                .child(
                  S.documentTypeList('article')
                    .title('Malay Articles')
                    .filter('_type == "article" && lang == "ms"')
                ),
              S.listItem()
                .title('🇵🇭 Filipino')
                .child(
                  S.documentTypeList('article')
                    .title('Filipino Articles')
                    .filter('_type == "article" && lang == "tl"')
                ),
              S.listItem()
                .title('🇫🇷 Français')
                .child(
                  S.documentTypeList('article')
                    .title('French Articles')
                    .filter('_type == "article" && lang == "fr"')
                ),
              S.listItem()
                .title('🇩🇪 Deutsch')
                .child(
                  S.documentTypeList('article')
                    .title('German Articles')
                    .filter('_type == "article" && lang == "de"')
                ),
              S.listItem()
                .title('🇪🇸 Español')
                .child(
                  S.documentTypeList('article')
                    .title('Spanish Articles')
                    .filter('_type == "article" && lang == "es"')
                ),
              S.listItem()
                .title('🇮🇹 Italiano')
                .child(
                  S.documentTypeList('article')
                    .title('Italian Articles')
                    .filter('_type == "article" && lang == "it"')
                ),
              S.listItem()
                .title('🇵🇹 Português')
                .child(
                  S.documentTypeList('article')
                    .title('Portuguese Articles')
                    .filter('_type == "article" && lang == "pt"')
                ),
              S.listItem()
                .title('🇷🇺 Русский')
                .child(
                  S.documentTypeList('article')
                    .title('Russian Articles')
                    .filter('_type == "article" && lang == "ru"')
                ),
              S.listItem()
                .title('🇸🇦 العربية')
                .child(
                  S.documentTypeList('article')
                    .title('Arabic Articles')
                    .filter('_type == "article" && lang == "ar"')
                ),
              S.listItem()
                .title('🇮🇳 हिन्दी')
                .child(
                  S.documentTypeList('article')
                    .title('Hindi Articles')
                    .filter('_type == "article" && lang == "hi"')
                ),
              S.listItem()
                .title('🇹🇷 Türkçe')
                .child(
                  S.documentTypeList('article')
                    .title('Turkish Articles')
                    .filter('_type == "article" && lang == "tr"')
                ),
              S.listItem()
                .title('🇧🇷 Português (Brasil)')
                .child(
                  S.documentTypeList('article')
                    .title('Portuguese Brazil Articles')
                    .filter('_type == "article" && lang == "pt-br"')
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
