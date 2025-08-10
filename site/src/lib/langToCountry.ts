const langToCountryMap = {
  ja: 'JP',
  en: 'US',
  'zh-cn': 'CN',
  'zh-tw': 'TW',
  ko: 'KR',
  th: 'TH',
  id: 'ID',
  fr: 'FR',
  de: 'DE',
  es: 'ES',
  it: 'IT',
  'pt-br': 'BR',
  ru: 'RU',
  ar: 'SA',
  tr: 'TR',
  nl: 'NL',
  pl: 'PL',
  sv: 'SE',
  da: 'DK',
  fi: 'FI'
} as const;

export type SupportedLanguage = keyof typeof langToCountryMap;
export type CountryCode = typeof langToCountryMap[SupportedLanguage];

export function langToCountry(lang: SupportedLanguage): CountryCode {
  return langToCountryMap[lang];
}

export function getAllLanguages(): SupportedLanguage[] {
  return Object.keys(langToCountryMap) as SupportedLanguage[];
}