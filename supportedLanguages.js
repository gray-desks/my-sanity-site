// Central definition of supported languages for Sanity Studio
// Keep this list in sync with documentInternationalization and deskStructure
// Updated to use DeepL API-supported languages (19 languages + Japanese = 20 total)
export const supportedLanguages = [
  // 日本語（原文）
  { id: 'ja', title: '日本語', isDefault: true },

  // DeepL API対応の翻訳対象 19言語（タイ語含む）
  { id: 'en', title: 'English' },
  { id: 'es', title: 'Español' },
  { id: 'fr', title: 'Français' },
  { id: 'de', title: 'Deutsch' },
  { id: 'it', title: 'Italiano' },
  { id: 'pt-br', title: 'Português (Brasil)' },
  { id: 'ru', title: 'Русский' },
  { id: 'ko', title: '한국어' },
  { id: 'zh-cn', title: '中文（简体）' },
  { id: 'zh-tw', title: '中文（繁體）' },
  { id: 'ar', title: 'العربية' },
  { id: 'tr', title: 'Türkçe' },
  { id: 'th', title: 'ไทย' },
  { id: 'nl', title: 'Nederlands' },
  { id: 'pl', title: 'Polski' },
  { id: 'sv', title: 'Svenska' },
  { id: 'da', title: 'Dansk' },
  { id: 'fi', title: 'Suomi' },
  { id: 'id', title: 'Bahasa Indonesia' },
];
