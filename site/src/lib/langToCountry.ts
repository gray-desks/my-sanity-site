const langToCountryMap = {
  ja: 'JP',
  en: 'US',
  'zh-cn': 'CN',
  'zh-tw': 'TW',
  ko: 'KR',
  th: 'TH',
  vi: 'VN',
  id: 'ID',
  ms: 'MY',
  tl: 'PH',
  fr: 'FR',
  de: 'DE',
  es: 'ES',
  it: 'IT',
  pt: 'PT',
  'pt-br': 'BR',
  ru: 'RU',
  ar: 'SA',
  hi: 'IN',
  tr: 'TR'
} as const;

export type SupportedLanguage = keyof typeof langToCountryMap;
export type CountryCode = typeof langToCountryMap[SupportedLanguage];

export function langToCountry(lang: SupportedLanguage): CountryCode {
  return langToCountryMap[lang];
}

export function getAllLanguages(): SupportedLanguage[] {
  return Object.keys(langToCountryMap) as SupportedLanguage[];
}