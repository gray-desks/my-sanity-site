/**
 * International Configuration for 旅ログ - Japan Travel Journal
 * 20言語対応の段階的ロールアウト設定
 */

// 言語定義
export interface Language {
  id: string
  title: string
  nativeName: string
  shortName: string
  dir: 'ltr' | 'rtl'
  phase: 1 | 2 | 3
  enabled: boolean
}

// 全20言語の定義（すべて有効化）
export const ALL_LANGUAGES: Language[] = [
  // Phase 1: 基幹7言語 (ja, en, zh-CN, zh-TW, ko, th, vi)
  { id: 'ja', title: 'Japanese', nativeName: '日本語', shortName: 'JA', dir: 'ltr', phase: 1, enabled: true },
  { id: 'en', title: 'English', nativeName: 'English', shortName: 'EN', dir: 'ltr', phase: 1, enabled: true },
  { id: 'zh-cn', title: 'Chinese (Simplified)', nativeName: '中文（简体）', shortName: '中', dir: 'ltr', phase: 1, enabled: true },
  { id: 'zh-tw', title: 'Chinese (Traditional)', nativeName: '中文（繁體）', shortName: '繁', dir: 'ltr', phase: 1, enabled: true },
  { id: 'ko', title: 'Korean', nativeName: '한국어', shortName: '한', dir: 'ltr', phase: 1, enabled: true },
  { id: 'th', title: 'Thai', nativeName: 'ไทย', shortName: 'TH', dir: 'ltr', phase: 1, enabled: true },
  { id: 'vi', title: 'Vietnamese', nativeName: 'Tiếng Việt', shortName: 'VI', dir: 'ltr', phase: 1, enabled: true },

  // Phase 2: 拡張6言語 (id, ms, tl, fr, de, es)
  { id: 'id', title: 'Indonesian', nativeName: 'Bahasa Indonesia', shortName: 'ID', dir: 'ltr', phase: 2, enabled: true },
  { id: 'ms', title: 'Malay', nativeName: 'Bahasa Melayu', shortName: 'MS', dir: 'ltr', phase: 2, enabled: true },
  { id: 'tl', title: 'Filipino', nativeName: 'Filipino', shortName: 'TL', dir: 'ltr', phase: 2, enabled: true },
  { id: 'fr', title: 'French', nativeName: 'Français', shortName: 'FR', dir: 'ltr', phase: 2, enabled: true },
  { id: 'de', title: 'German', nativeName: 'Deutsch', shortName: 'DE', dir: 'ltr', phase: 2, enabled: true },
  { id: 'es', title: 'Spanish', nativeName: 'Español', shortName: 'ES', dir: 'ltr', phase: 2, enabled: true },

  // Phase 3: 多様化7言語 (it, pt, ru, ar, hi, tr, pt-BR)
  { id: 'it', title: 'Italian', nativeName: 'Italiano', shortName: 'IT', dir: 'ltr', phase: 3, enabled: true },
  { id: 'pt', title: 'Portuguese', nativeName: 'Português', shortName: 'PT', dir: 'ltr', phase: 3, enabled: true },
  { id: 'ru', title: 'Russian', nativeName: 'Русский', shortName: 'RU', dir: 'ltr', phase: 3, enabled: true },
  { id: 'ar', title: 'Arabic', nativeName: 'العربية', shortName: 'AR', dir: 'rtl', phase: 3, enabled: true },
  { id: 'hi', title: 'Hindi', nativeName: 'हिन्दी', shortName: 'HI', dir: 'ltr', phase: 3, enabled: true },
  { id: 'tr', title: 'Turkish', nativeName: 'Türkçe', shortName: 'TR', dir: 'ltr', phase: 3, enabled: true },
  { id: 'pt-br', title: 'Portuguese (Brazil)', nativeName: 'Português (Brasil)', shortName: 'BR', dir: 'ltr', phase: 3, enabled: true },
]

// 現在有効な言語のみを取得
export const ENABLED_LANGUAGES = ALL_LANGUAGES.filter(lang => lang.enabled)

// デフォルト言語
export const DEFAULT_LANGUAGE = 'ja'
export const FALLBACK_LANGUAGE = 'en'

// x-default (SEO用)
export const X_DEFAULT_LANGUAGE = 'en'

// 現在のフェーズ設定 (環境変数で制御可能)
export const CURRENT_PHASE = parseInt(process.env.I18N_PHASE || '1') as 1 | 2 | 3

// フェーズ別言語取得
export function getLanguagesByPhase(phase: number): Language[] {
  return ALL_LANGUAGES.filter(lang => lang.phase <= phase && lang.enabled)
}

// 言語情報取得
export function getLanguageInfo(langId: string): Language | undefined {
  return ALL_LANGUAGES.find(lang => lang.id === langId)
}

// 言語が有効かチェック
export function isLanguageEnabled(langId: string): boolean {
  const lang = getLanguageInfo(langId)
  return lang ? lang.enabled : false
}

// RTL言語かチェック
export function isRTL(langId: string): boolean {
  const lang = getLanguageInfo(langId)
  return lang ? lang.dir === 'rtl' : false
}

// 言語コード正規化
export function normalizeLanguageCode(langId: string): string {
  const lang = getLanguageInfo(langId)
  return lang ? lang.id : DEFAULT_LANGUAGE
}

// ルーティング用のパス生成
export function getLocalizedPath(path: string, langId: string): string {
  const normalizedLang = normalizeLanguageCode(langId)
  
  // デフォルト言語（日本語）はパスプレフィックスなし
  if (normalizedLang === DEFAULT_LANGUAGE) {
    return path
  }
  
  // 他の言語は /{lang}/path 形式
  return `/${normalizedLang}${path}`
}

// hreflang用の言語コード変換
export function getHreflangCode(langId: string): string {
  const hreflangMap: Record<string, string> = {
    'zh-cn': 'zh-Hans',
    'zh-tw': 'zh-Hant',
    'pt-br': 'pt-BR',
  }
  
  return hreflangMap[langId] || langId
}

// フォント設定（言語別）
export const LANGUAGE_FONTS = {
  // Latin scripts
  latin: ['en', 'fr', 'de', 'es', 'it', 'pt', 'pt-br', 'id', 'ms', 'tl'],
  
  // CJK scripts
  cjk: ['ja', 'zh-cn', 'zh-tw', 'ko'],
  
  // Thai-Vietnamese scripts
  thaiViet: ['th', 'vi'],
  
  // Arabic-Indic scripts
  arabicIndic: ['ar', 'hi'],
  
  // Cyrillic scripts
  cyrillic: ['ru'],
  
  // Turkish (special case)
  turkish: ['tr'],
}

// 言語のフォントファミリー取得
export function getFontFamily(langId: string): string {
  for (const [fontType, languages] of Object.entries(LANGUAGE_FONTS)) {
    if (languages.includes(langId)) {
      switch (fontType) {
        case 'latin':
          return 'Inter var, ui-sans-serif, system-ui, sans-serif'
        case 'cjk':
          return 'Noto Sans JP, Noto Sans SC, Noto Sans TC, Noto Sans KR, ui-sans-serif, system-ui, sans-serif'
        case 'thaiViet':
          return 'Noto Sans Thai, Noto Sans Vietnamese, ui-sans-serif, system-ui, sans-serif'
        case 'arabicIndic':
          return 'Noto Sans Arabic, Noto Sans Devanagari, ui-sans-serif, system-ui, sans-serif'
        case 'cyrillic':
          return 'Noto Sans Cyrillic, ui-sans-serif, system-ui, sans-serif'
        case 'turkish':
          return 'Noto Sans Turkish, ui-sans-serif, system-ui, sans-serif'
        default:
          return 'ui-sans-serif, system-ui, sans-serif'
      }
    }
  }
  
  return 'ui-sans-serif, system-ui, sans-serif'
}

// 多言語UI文言
export const UI_LABELS = {
  ja: {
    readMore: '記事を読む',
    backToHome: 'ホームに戻る',
    publishedOn: '公開日',
    location: '場所',
    category: 'カテゴリ',
    language: '言語',
    switchLanguage: '言語を切り替え',
    siteTitle: '旅ログ',
    siteDescription: '日本全国の旅記録を多言語で発信',
    home: 'ホーム',
    english: 'English',
    privacy: 'プライバシー',
    allRightsReserved: 'All rights reserved.',
    heroTitle: '日本全国の旅ログを発信',
    heroSubtitle: '美しい景色、美味しい食べ物、文化体験を多言語で共有',
    readStories: '記事を読む',
    switchToEnglish: 'English',
    search: '検索',
    searchPlaceholder: 'キーワードで検索...',
    allTypes: 'すべて',
    spot: '観光地',
    food: 'グルメ',
    transport: '交通',
    hotel: '宿泊',
    note: 'メモ',
    allPrefectures: 'すべての都道府県',
    reset: 'リセット',
    noArticlesTitle: 'まだ記事がありません',
    noArticlesSubtitle: 'Sanity Studio で最初の記事を作成してください',
  },
  en: {
    readMore: 'Read More',
    backToHome: 'Back to Home',
    publishedOn: 'Published on',
    location: 'Location',
    category: 'Category',
    language: 'Language',
    switchLanguage: 'Switch Language',
    siteTitle: 'Travel Log',
    siteDescription: 'Multilingual travel journal across Japan',
    home: 'Home',
    english: 'English',
    privacy: 'Privacy',
    allRightsReserved: 'All rights reserved.',
    heroTitle: 'Japan Travel Stories',
    heroSubtitle: 'Beautiful places, delicious food, and cultural experiences shared in multiple languages',
    readStories: 'Read Stories',
    switchToEnglish: '日本語',
    search: 'Search',
    searchPlaceholder: 'Search by keyword...',
    allTypes: 'All Types',
    spot: 'Spot',
    food: 'Food',
    transport: 'Transport',
    hotel: 'Hotel',
    note: 'Note',
    allPrefectures: 'All Prefectures',
    reset: 'Reset',
    noArticlesTitle: 'No articles yet',
    noArticlesSubtitle: 'Please create the first article in Sanity Studio',
  },
  'zh-cn': {
    readMore: '阅读更多',
    backToHome: '返回首页',
    publishedOn: '发布于',
    location: '地点',
    category: '分类',
    language: '语言',
    switchLanguage: '切换语言',
    siteTitle: '旅行日志',
    siteDescription: '多语言日本全国旅行记录',
    home: '首页',
    english: 'English',
    privacy: '隐私政策',
    allRightsReserved: '版权所有。',
    heroTitle: '日本旅行故事',
    heroSubtitle: '分享美丽的地方、美味的食物和文化体验',
    readStories: '阅读故事',
    switchToEnglish: '日本語',
    search: '搜索',
    searchPlaceholder: '通过关键词搜索...',
    allTypes: '所有类型',
    spot: '景点',
    food: '美食',
    transport: '交通',
    hotel: '住宿',
    note: '笔记',
    allPrefectures: '所有省份',
    reset: '重置',
  },
  'zh-tw': {
    readMore: '閱讀更多',
    backToHome: '返回首頁',
    publishedOn: '發布於',
    location: '地點',
    category: '分類',
    language: '語言',
    switchLanguage: '切換語言',
    siteTitle: '旅行日誌',
    siteDescription: '多語言日本全國旅行記錄',
    home: '首頁',
    english: 'English',
    privacy: '隱私政策',
    allRightsReserved: '版權所有。',
    heroTitle: '日本旅行故事',
    heroSubtitle: '分享美麗的地方、美味的食物和文化體驗',
    readStories: '閱讀故事',
    switchToEnglish: '日本語',
    search: '搜索',
    searchPlaceholder: '通過關鍵詞搜索...',
    allTypes: '所有類型',
    spot: '景點',
    food: '美食',
    transport: '交通',
    hotel: '住宿',
    note: '筆記',
    allPrefectures: '所有県市',
    reset: '重置',
  },
  ko: {
    readMore: '더 읽기',
    backToHome: '홈으로 돌아가기',
    publishedOn: '게시일',
    location: '위치',
    category: '카테고리',
    language: '언어',
    switchLanguage: '언어 전환',
    siteTitle: '여행 로그',
    siteDescription: '일본 전국 여행 기록을 다국어로 발신',
    home: '홈',
    english: 'English',
    privacy: '개인정보처리방침',
    allRightsReserved: '모든 권리 보유.',
    heroTitle: '일본 여행 이야기',
    heroSubtitle: '아름다운 장소, 맛있는 음식, 문화 체험을 다국어로 공유',
    readStories: '이야기 읽기',
    switchToEnglish: '日本語',
    search: '검색',
    searchPlaceholder: '키워드로 검색...',
    allTypes: '모든 유형',
    spot: '명소',
    food: '음식',
    transport: '교통',
    hotel: '호텔',
    note: '노트',
    allPrefectures: '모든 도도부현',
    reset: '초기화',
  },
  th: {
    readMore: 'อ่านเพิ่มเติม',
    backToHome: 'กลับหน้าหลัก',
    publishedOn: 'เผยแพร่เมื่อ',
    location: 'สถานที่',
    category: 'หมวดหมู่',
    language: 'ภาษา',
    switchLanguage: 'เปลี่ยนภาษา',
    siteTitle: 'บันทึกการเดินทาง',
    siteDescription: 'Multilingual travel journal across Japan',
    home: 'หน้าแรก',
    english: 'English',
    privacy: 'Privacy',
    allRightsReserved: 'All rights reserved.',
    heroTitle: 'Japan Travel Stories',
    heroSubtitle: 'Beautiful places, delicious food, and cultural experiences shared in multiple languages',
    readStories: 'Read Stories',
    switchToEnglish: '日本語',
    search: 'Search',
    searchPlaceholder: 'Search by keyword...',
    allTypes: 'All Types',
    spot: 'Spot',
    food: 'Food',
    transport: 'Transport',
    hotel: 'Hotel',
    note: 'Note',
    allPrefectures: 'All Prefectures',
    reset: 'Reset',
  },
  vi: {
    readMore: 'Đọc thêm',
    backToHome: 'Trở về trang chủ',
    publishedOn: 'Xuất bản',
    location: 'Địa điểm',
    category: 'Danh mục',
    language: 'Ngôn ngữ',
    switchLanguage: 'Thay đổi ngôn ngữ',
    siteTitle: 'Nhật ký Du lịch',
    siteDescription: 'Nhật ký du lịch khắp Nhật Bản với nhiều ngôn ngữ',
    home: 'Trang chủ',
    english: 'English',
    privacy: 'Chính sách bảo mật',
    allRightsReserved: 'Bảo lưu mọi quyền.',
    heroTitle: 'Câu chuyện du lịch Nhật Bản',
    heroSubtitle: 'Chia sẻ cảnh đẹp, món ăn ngon và trải nghiệm văn hoá với nhiều ngôn ngữ',
    readStories: 'Đọc câu chuyện',
    switchToEnglish: '日本語',
    search: 'Tìm kiếm',
    searchPlaceholder: 'Tìm kiếm bằng từ khóa...',
    allTypes: 'Tất cả',
    spot: 'Địa danh',
    food: 'Ẩm thực',
    transport: 'Di chuyển',
    hotel: 'Khách sạn',
    note: 'Ghi chú',
    allPrefectures: 'Tất cả tỉnh',
    reset: 'Đặt lại',
  },

  id: {
    readMore: 'Baca selengkapnya',
    backToHome: 'Kembali ke Beranda',
    publishedOn: 'Diterbitkan',
    location: 'Lokasi',
    category: 'Kategori',
    language: 'Bahasa',
    switchLanguage: 'Ganti Bahasa',
    siteTitle: 'Catatan Perjalanan',
    siteDescription: 'Catatan perjalanan lintas Jepang dalam berbagai bahasa',
    home: 'Beranda',
    english: 'English',
    privacy: 'Privasi',
    allRightsReserved: 'Hak cipta dilindungi.',
    heroTitle: 'Kisah Perjalanan Jepang',
    heroSubtitle: 'Berbagi tempat indah, makanan lezat, dan pengalaman budaya dalam berbagai bahasa',
    readStories: 'Baca Kisah',
    switchToEnglish: '日本語',
    search: 'Cari',
    searchPlaceholder: 'Cari dengan kata kunci...',
    allTypes: 'Semua Jenis',
    spot: 'Tempat',
    food: 'Makanan',
    transport: 'Transportasi',
    hotel: 'Hotel',
    note: 'Catatan',
    allPrefectures: 'Semua Prefektur',
    reset: 'Reset',
  },

  // 残りの言語（英語ベース）- 後で詳細翻訳を追加可能
  ms: {
    readMore: 'Baca',
    backToHome: 'Kembali ke Laman Utama',
    publishedOn: 'Diterbitkan pada',
    location: 'Lokasi',
    category: 'Kategori',
    language: 'Bahasa',
    switchLanguage: 'Tukar Bahasa',
    siteTitle: 'Log Perjalanan',
    siteDescription: 'Catatan perjalanan merentasi Jepun dalam pelbagai bahasa',
    home: 'Laman Utama',
    english: 'English',
    privacy: 'Privasi',
    allRightsReserved: 'Hak cipta terpelihara.',
    heroTitle: 'Kisah Perjalanan Jepun',
    heroSubtitle: 'Pemandangan indah, makanan lazat, dan pengalaman budaya dikongsi dalam pelbagai bahasa',
    readStories: 'Baca Cerita',
    switchToEnglish: '日本語',
    search: 'Cari',
    searchPlaceholder: 'Cari dengan kata kunci...',
    allTypes: 'Semua Jenis',
    spot: 'Tempat',
    food: 'Makanan',
    transport: 'Pengangkutan',
    hotel: 'Hotel',
    note: 'Nota',
    allPrefectures: 'Semua Wilayah',
    reset: 'Tetapkan semula',
  },

  tl: {
    readMore: 'Magbasa pa',
    backToHome: 'Bumalik sa Home',
    publishedOn: 'Nailathala',
    location: 'Lokasyon',
    category: 'Kategorya',
    language: 'Wika',
    switchLanguage: 'Palitan ang Wika',
    siteTitle: 'Travel Log',
    siteDescription: 'Tala ng paglalakbay sa Japan sa maraming wika',
    home: 'Home',
    english: 'English',
    privacy: 'Pribasiya',
    allRightsReserved: 'Lahat ng karapatan ay nakalaan.',
    heroTitle: 'Mga Kuwento sa Paglalakbay sa Japan',
    heroSubtitle: 'Magandang tanawin, masarap na pagkain, at karanasang kultural na ibinabahagi sa maraming wika',
    readStories: 'Magbasa ng mga Kuwento',
    switchToEnglish: '日本語',
    search: 'Maghanap',
    searchPlaceholder: 'Maghanap gamit ang keyword...',
    allTypes: 'Lahat ng Uri',
    spot: 'Lugar',
    food: 'Pagkain',
    transport: 'Transportasyon',
    hotel: 'Hotel',
    note: 'Tala',
    allPrefectures: 'Lahat ng Prepektura',
    reset: 'I-reset',
  },
  fr: {
    readMore: 'Lire plus',
    backToHome: "Retour à l'accueil",
    publishedOn: 'Publié le',
    location: 'Emplacement',
    category: 'Catégorie',
    language: 'Langue',
    switchLanguage: 'Changer de langue',
    siteTitle: 'Journal de Voyage',
    siteDescription: 'Journal de voyage multilingue à travers le Japon',
    home: 'Accueil',
    english: 'Anglais',
    privacy: 'Confidentialité',
    allRightsReserved: 'Tous droits réservés.',
    heroTitle: 'Histoires de voyage au Japon',
    heroSubtitle: 'Beaux endroits, délicieuse nourriture et expériences culturelles partagées en plusieurs langues',
    readStories: 'Lire des histoires',
    switchToEnglish: '日本語',
    search: 'Rechercher',
    searchPlaceholder: 'Rechercher par mot-clé...',
    allTypes: 'Tous types',
    spot: 'Lieu',
    food: 'Nourriture',
    transport: 'Transport',
    hotel: 'Hôtel',
    note: 'Note',
    allPrefectures: 'Toutes les préfectures',
    reset: 'Réinitialiser',
  },
  de: {
    readMore: 'Mehr lesen',
    backToHome: 'Zur Startseite',
    publishedOn: 'Veröffentlicht am',
    location: 'Ort',
    category: 'Kategorie',
    language: 'Sprache',
    switchLanguage: 'Sprache wechseln',
    siteTitle: 'Reisetagebuch',
    siteDescription: 'Mehrsprachiges Reisetagebuch durch Japan',
    home: 'Startseite',
    english: 'Englisch',
    privacy: 'Datenschutz',
    allRightsReserved: 'Alle Rechte vorbehalten.',
    heroTitle: 'Japan Reisegeschichten',
    heroSubtitle: 'Schöne Orte, köstliches Essen und kulturelle Erlebnisse in mehreren Sprachen geteilt',
    readStories: 'Geschichten lesen',
    switchToEnglish: '日本語',
    search: 'Suchen',
    searchPlaceholder: 'Nach Stichwort suchen...',
    allTypes: 'Alle Typen',
    spot: 'Ort',
    food: 'Essen',
    transport: 'Transport',
    hotel: 'Hotel',
    note: 'Notiz',
    allPrefectures: 'Alle Präfekturen',
    reset: 'Zurücksetzen',
  },
  es: {
    readMore: 'Leer más',
    backToHome: 'Volver al inicio',
    publishedOn: 'Publicado el',
    location: 'Ubicación',
    category: 'Categoría',
    language: 'Idioma',
    switchLanguage: 'Cambiar idioma',
    siteTitle: 'Diario de Viaje',
    siteDescription: 'Diario de viaje multilingüe por Japón',
    home: 'Inicio',
    english: 'Inglés',
    privacy: 'Privacidad',
    allRightsReserved: 'Todos los derechos reservados.',
    heroTitle: 'Historias de viaje por Japón',
    heroSubtitle: 'Lugares hermosos, comida deliciosa y experiencias culturales compartidas en varios idiomas',
    readStories: 'Leer historias',
    switchToEnglish: '日本語',
    search: 'Buscar',
    searchPlaceholder: 'Buscar por palabra clave...',
    allTypes: 'Todos los tipos',
    spot: 'Lugar',
    food: 'Comida',
    transport: 'Transporte',
    hotel: 'Hotel',
    note: 'Nota',
    allPrefectures: 'Todas las prefecturas',
    reset: 'Restablecer',
  },
  it: {
    readMore: 'Leggi di più',
    backToHome: 'Torna alla home',
    publishedOn: 'Pubblicato il',
    location: 'Località',
    category: 'Categoria',
    language: 'Lingua',
    switchLanguage: 'Cambia lingua',
    siteTitle: 'Diario di Viaggio',
    siteDescription: 'Diario di viaggio multilingue in Giappone',
    home: 'Home',
    english: 'Inglese',
    privacy: 'Privacy',
    allRightsReserved: 'Tutti i diritti riservati.',
    heroTitle: 'Storie di viaggio in Giappone',
    heroSubtitle: 'Luoghi splendidi, cibo delizioso ed esperienze culturali condivise in più lingue',
    readStories: 'Leggi storie',
    switchToEnglish: '日本語',
    search: 'Cerca',
    searchPlaceholder: 'Cerca per parola chiave...',
    allTypes: 'Tutti i tipi',
    spot: 'Luogo',
    food: 'Cibo',
    transport: 'Trasporto',
    hotel: 'Hotel',
    note: 'Nota',
    allPrefectures: 'Tutte le prefetture',
    reset: 'Reimposta',
  },
  pt: {
    readMore: 'Ler mais',
    backToHome: 'Voltar ao início',
    publishedOn: 'Publicado em',
    location: 'Localização',
    category: 'Categoria',
    language: 'Idioma',
    switchLanguage: 'Mudar idioma',
    siteTitle: 'Diário de Viagem',
    siteDescription: 'Diário de viagem multilíngue pelo Japão',
    home: 'Início',
    english: 'Inglês',
    privacy: 'Privacidade',
    allRightsReserved: 'Todos os direitos reservados.',
    heroTitle: 'Histórias de viagem no Japão',
    heroSubtitle: 'Lugares lindos, comida deliciosa e experiências culturais compartilhadas em vários idiomas',
    readStories: 'Ler histórias',
    switchToEnglish: '日本語',
    search: 'Pesquisar',
    searchPlaceholder: 'Pesquisar por palavra-chave...',
    allTypes: 'Todos os tipos',
    spot: 'Local',
    food: 'Comida',
    transport: 'Transporte',
    hotel: 'Hotel',
    note: 'Nota',
    allPrefectures: 'Todas as prefeituras',
    reset: 'Redefinir',
  },
  ru: {
    readMore: 'Читать далее',
    backToHome: 'На главную',
    publishedOn: 'Опубликовано',
    location: 'Место',
    category: 'Категория',
    language: 'Язык',
    switchLanguage: 'Сменить язык',
    siteTitle: 'Дневник путешествий',
    siteDescription: 'Многоязычный дневник путешествий по Японии',
    home: 'Главная',
    english: 'Английский',
    privacy: 'Конфиденциальность',
    allRightsReserved: 'Все права защищены.',
    heroTitle: 'Истории путешествий по Японии',
    heroSubtitle: 'Красивые места, вкусная еда и культурный опыт на разных языках',
    readStories: 'Читать истории',
    switchToEnglish: '日本語',
    search: 'Поиск',
    searchPlaceholder: 'Поиск по ключевому слову...',
    allTypes: 'Все типы',
    spot: 'Место',
    food: 'Еда',
    transport: 'Транспорт',
    hotel: 'Отель',
    note: 'Заметка',
    allPrefectures: 'Все префектуры',
    reset: 'Сброс',
  },
  ar: {
    readMore: 'اقرأ المزيد',
    backToHome: 'العودة إلى الصفحة الرئيسية',
    publishedOn: 'نشر في',
    location: 'الموقع',
    category: 'الفئة',
    language: 'اللغة',
    switchLanguage: 'تغيير اللغة',
    siteTitle: 'مذكرات السفر',
    siteDescription: 'مجلة سفر متعددة اللغات عبر اليابان',
    home: 'الرئيسية',
    english: 'الإنجليزية',
    privacy: 'الخصوصية',
    allRightsReserved: 'جميع الحقوق محفوظة.',
    heroTitle: 'قصص السفر في اليابان',
    heroSubtitle: 'أماكن جميلة وطعام لذيذ وتجارب ثقافية بلغات متعددة',
    readStories: 'اقرأ القصص',
    switchToEnglish: '日本語',
    search: 'بحث',
    searchPlaceholder: 'ابحث بكلمة مفتاحية...',
    allTypes: 'جميع الأنواع',
    spot: 'مكان',
    food: 'طعام',
    transport: 'مواصلات',
    hotel: 'فندق',
    note: 'ملاحظة',
    allPrefectures: 'جميع المحافظات',
    reset: 'إعادة تعيين',
  },
  hi: {
    readMore: 'और पढ़ें',
    backToHome: 'मुख्य पृष्ठ पर लौटें',
    publishedOn: 'प्रकाशित',
    location: 'स्थान',
    category: 'श्रेणी',
    language: 'भाषा',
    switchLanguage: 'भाषा बदलें',
    siteTitle: 'यात्रा डायरी',
    siteDescription: 'जापान यात्रा की बहुभाषी डायरी',
    home: 'होम',
    english: 'English',
    privacy: 'गोपनीयता',
    allRightsReserved: 'सर्वाधिकार सुरक्षित।',
    heroTitle: 'जापान यात्रा कहानियाँ',
    heroSubtitle: 'सुंदर स्थान, स्वादिष्ट भोजन और बहुभाषी सांस्कृतिक अनुभव',
    readStories: 'कहानियाँ पढ़ें',
    switchToEnglish: '日本語',
    search: 'खोज',
    searchPlaceholder: 'कीवर्ड से खोजें...',
    allTypes: 'सभी प्रकार',
    spot: 'स्थान',
    food: 'भोजन',
    transport: 'परिवहन',
    hotel: 'होटल',
    note: 'नोट',
    allPrefectures: 'सभी प्रान्त',
    reset: 'रीसेट',
  },
  tr: {
    readMore: 'Daha fazla oku',
    backToHome: 'Ana sayfaya dön',
    publishedOn: 'Yayınlanma tarihi',
    location: 'Konum',
    category: 'Kategori',
    language: 'Dil',
    switchLanguage: 'Dili değiştir',
    siteTitle: 'Seyahat Günlüğü',
    siteDescription: 'Japonya çapında çok dilli seyahat günlüğü',
    home: 'Ana Sayfa',
    english: 'İngilizce',
    privacy: 'Gizlilik',
    allRightsReserved: 'Tüm hakları saklıdır.',
    heroTitle: 'Japonya Seyahat Hikayeleri',
    heroSubtitle: 'Güzel yerler, lezzetli yemekler ve çok dilli kültürel deneyimler',
    readStories: 'Hikayeleri oku',
    switchToEnglish: '日本語',
    search: 'Ara',
    searchPlaceholder: 'Anahtar kelime ile ara...',
    allTypes: 'Tüm Türler',
    spot: 'Yer',
    food: 'Yemek',
    transport: 'Ulaşım',
    hotel: 'Otel',
    note: 'Not',
    allPrefectures: 'Tüm Eyaletler',
    reset: 'Sıfırla',
  },
  'pt-br': {
    readMore: 'Leia mais',
    backToHome: 'Voltar para início',
    publishedOn: 'Publicado em',
    location: 'Local',
    category: 'Categoria',
    language: 'Idioma',
    switchLanguage: 'Trocar idioma',
    siteTitle: 'Diário de Viagem',
    siteDescription: 'Diário de viagem multilíngue pelo Japão',
    home: 'Início',
    english: 'Inglês',
    privacy: 'Privacidade',
    allRightsReserved: 'Todos os direitos reservados.',
    heroTitle: 'Histórias de Viagem no Japão',
    heroSubtitle: 'Lugares lindos, comida deliciosa e experiências culturais em vários idiomas',
    readStories: 'Ler histórias',
    switchToEnglish: '日本語',
    search: 'Buscar',
    searchPlaceholder: 'Buscar por palavra-chave...',
    allTypes: 'Todos os tipos',
    spot: 'Local',
    food: 'Comida',
    transport: 'Transporte',
    hotel: 'Hotel',
    note: 'Nota',
    allPrefectures: 'Todos os estados',
    reset: 'Redefinir',
  },
} as const

// 言語別UI文言マップ -------------------------
// en.json など静的JSONを取り込み（将来拡張用）
// 現状は UI_LABELS オブジェクト + 英語自動マージ

const EN_LABELS = UI_LABELS.en

// 全言語分を英語ラベルにマージして完成させる
export const COMPLETE_LABELS: Record<string, typeof EN_LABELS> = {}
for (const { id } of ENABLED_LANGUAGES) {
  COMPLETE_LABELS[id] = {
    ...EN_LABELS,
    ...(UI_LABELS[id as keyof typeof UI_LABELS] ?? {})
  } as any
}

// UI文言取得（多言語対応）
type UILabelKeys = keyof typeof EN_LABELS;

export function getUILabel(langId: string, key: UILabelKeys): string {
  const allLabels = UI_LABELS as Record<string, Partial<Record<UILabelKeys, string>>>;
  const labels = allLabels[langId] ?? allLabels[FALLBACK_LANGUAGE];
  return labels?.[key] ?? EN_LABELS[key] ?? UI_LABELS.ja[key];
}

// シンプル版（現在の使用向け）
export function getUILabelSimple(key: UILabelKeys): string {
  return EN_LABELS[key] ?? UI_LABELS.ja[key];
}