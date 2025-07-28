/**
 * International Configuration for 旅ログ - Japan Travel Journal
 * 20言語対応の段階的ロールアウト設定
 */

// 言語定義
export interface Language {
  id: string
  title: string
  nativeName: string
  dir: 'ltr' | 'rtl'
  phase: 1 | 2 | 3
  enabled: boolean
}

// 全20言語の定義
export const ALL_LANGUAGES: Language[] = [
  // Phase 1: 基幹7言語 (ja, en, zh-CN, zh-TW, ko, th, vi)
  { id: 'ja', title: 'Japanese', nativeName: '日本語', dir: 'ltr', phase: 1, enabled: true },
  { id: 'en', title: 'English', nativeName: 'English', dir: 'ltr', phase: 1, enabled: true },
  { id: 'zh-cn', title: 'Chinese (Simplified)', nativeName: '中文（简体）', dir: 'ltr', phase: 1, enabled: true },
  { id: 'zh-tw', title: 'Chinese (Traditional)', nativeName: '中文（繁體）', dir: 'ltr', phase: 1, enabled: true },
  { id: 'ko', title: 'Korean', nativeName: '한국어', dir: 'ltr', phase: 1, enabled: true },
  { id: 'th', title: 'Thai', nativeName: 'ไทย', dir: 'ltr', phase: 1, enabled: true },
  { id: 'vi', title: 'Vietnamese', nativeName: 'Tiếng Việt', dir: 'ltr', phase: 1, enabled: true },

  // Phase 2: 拡張6言語 (id, ms, tl, fr, de, es)
  { id: 'id', title: 'Indonesian', nativeName: 'Bahasa Indonesia', dir: 'ltr', phase: 2, enabled: false },
  { id: 'ms', title: 'Malay', nativeName: 'Bahasa Melayu', dir: 'ltr', phase: 2, enabled: false },
  { id: 'tl', title: 'Filipino', nativeName: 'Filipino', dir: 'ltr', phase: 2, enabled: false },
  { id: 'fr', title: 'French', nativeName: 'Français', dir: 'ltr', phase: 2, enabled: false },
  { id: 'de', title: 'German', nativeName: 'Deutsch', dir: 'ltr', phase: 2, enabled: false },
  { id: 'es', title: 'Spanish', nativeName: 'Español', dir: 'ltr', phase: 2, enabled: false },

  // Phase 3: 多様化7言語 (it, pt, ru, ar, hi, tr, pt-BR)
  { id: 'it', title: 'Italian', nativeName: 'Italiano', dir: 'ltr', phase: 3, enabled: false },
  { id: 'pt', title: 'Portuguese', nativeName: 'Português', dir: 'ltr', phase: 3, enabled: false },
  { id: 'ru', title: 'Russian', nativeName: 'Русский', dir: 'ltr', phase: 3, enabled: false },
  { id: 'ar', title: 'Arabic', nativeName: 'العربية', dir: 'rtl', phase: 3, enabled: false },
  { id: 'hi', title: 'Hindi', nativeName: 'हिन्दी', dir: 'ltr', phase: 3, enabled: false },
  { id: 'tr', title: 'Turkish', nativeName: 'Türkçe', dir: 'ltr', phase: 3, enabled: false },
  { id: 'pt-br', title: 'Portuguese (Brazil)', nativeName: 'Português (Brasil)', dir: 'ltr', phase: 3, enabled: false },
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
    backToHome: 'กลับหน้าแรก',
    publishedOn: 'เผยแพร่เมื่อ',
    location: 'สถานที่',
    category: 'หมวดหมู่',
    language: 'ภาษา',
    switchLanguage: 'เปลี่ยนภาษา',
    siteTitle: 'บันทึกการเดินทาง',
    siteDescription: 'บันทึกการเดินทางทั่วญี่ปุ่นแบบหลายภาษา',
    home: 'หน้าแรก',
    english: 'English',
    privacy: 'ความเป็นส่วนตัว',
    allRightsReserved: 'สงวนลิขสิทธิ์.',
    heroTitle: 'เรื่องราวการเดินทางญี่ปุ่น',
    heroSubtitle: 'แบ่งปันสถานที่สวยงาม อาหารอร่อย และประสบการณ์ทางวัฒนธรรม',
    readStories: 'อ่านเรื่องราว',
    switchToEnglish: '日本語',
    search: 'ค้นหา',
    searchPlaceholder: 'ค้นหาด้วยคำสำคัญ...',
    allTypes: 'ทุกประเภท',
    spot: 'สถานที่',
    food: 'อาหาร',
    transport: 'การขนส่ง',
    hotel: 'โรงแรม',
    note: 'บันทึก',
    allPrefectures: 'จังหวัดทั้งหมด',
    reset: 'รีเซ็ต',
  },
  vi: {
    readMore: 'Đọc thêm',
    backToHome: 'Về trang chủ',
    publishedOn: 'Đăng ngày',
    location: 'Địa điểm',
    category: 'Danh mục',
    language: 'Ngôn ngữ',
    switchLanguage: 'Đổi ngôn ngữ',
    siteTitle: 'Nhật ký du lịch',
    siteDescription: 'Nhật ký du lịch đa ngôn ngữ khắp Nhật Bản',
    home: 'Trang chủ',
    english: 'English',
    privacy: 'Riêng tư',
    allRightsReserved: 'Mọi quyền được bảo lưu.',
    heroTitle: 'Câu chuyện du lịch Nhật Bản',
    heroSubtitle: 'Chia sẻ những địa điểm đẹp, món ăn ngon và trải nghiệm văn hóa',
    readStories: 'Đọc câu chuyện',
    switchToEnglish: '日本語',
    search: 'Tìm kiếm',
    searchPlaceholder: 'Tìm kiếm theo từ khóa...',
    allTypes: 'Tất cả loại',
    spot: 'Địa điểm',
    food: 'Ẩm thực',
    transport: 'Giao thông',
    hotel: 'Khách sạn',
    note: 'Ghi chú',
    allPrefectures: 'Tất cả tỉnh thành',
    reset: 'Đặt lại',
  },
} as const

// UI文言取得
export function getUILabel(langId: string, key: keyof typeof UI_LABELS.ja): string {
  const labels = UI_LABELS[langId as keyof typeof UI_LABELS] || UI_LABELS[FALLBACK_LANGUAGE as keyof typeof UI_LABELS]
  return labels[key] || UI_LABELS.ja[key]
}