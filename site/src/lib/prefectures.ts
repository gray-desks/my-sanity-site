/**
 * 日本の都道府県データ
 * 47都道府県の多言語対応定義
 */

export interface Prefecture {
  code: string
  name: {
    ja: string
    en: string
    'zh-cn': string
    'zh-tw': string
    ko: string
    th: string
    vi: string
  }
  region: string
}

export const PREFECTURES: Prefecture[] = [
  // 北海道地方
  {
    code: 'hokkaido',
    name: {
      ja: '北海道',
      en: 'Hokkaido',
      'zh-cn': '北海道',
      'zh-tw': '北海道',
      ko: '홋카이도',
      th: 'ฮอกไกโด',
      vi: 'Hokkaido'
    },
    region: 'hokkaido'
  },
  
  // 東北地方
  {
    code: 'aomori',
    name: {
      ja: '青森県',
      en: 'Aomori',
      'zh-cn': '青森县',
      'zh-tw': '青森縣',
      ko: '아오모리현',
      th: 'อาโอโมริ',
      vi: 'Aomori'
    },
    region: 'tohoku'
  },
  {
    code: 'iwate',
    name: {
      ja: '岩手県',
      en: 'Iwate',
      'zh-cn': '岩手县',
      'zh-tw': '岩手縣',
      ko: '이와테현',
      th: 'อิวาเตะ',
      vi: 'Iwate'
    },
    region: 'tohoku'
  },
  {
    code: 'miyagi',
    name: {
      ja: '宮城県',
      en: 'Miyagi',
      'zh-cn': '宫城县',
      'zh-tw': '宮城縣',
      ko: '미야기현',
      th: 'มิยางิ',
      vi: 'Miyagi'
    },
    region: 'tohoku'
  },
  {
    code: 'akita',
    name: {
      ja: '秋田県',
      en: 'Akita',
      'zh-cn': '秋田县',
      'zh-tw': '秋田縣',
      ko: '아키타현',
      th: 'อากิตะ',
      vi: 'Akita'
    },
    region: 'tohoku'
  },
  {
    code: 'yamagata',
    name: {
      ja: '山形県',
      en: 'Yamagata',
      'zh-cn': '山形县',
      'zh-tw': '山形縣',
      ko: '야마가타현',
      th: 'ยามางาตะ',
      vi: 'Yamagata'
    },
    region: 'tohoku'
  },
  {
    code: 'fukushima',
    name: {
      ja: '福島県',
      en: 'Fukushima',
      'zh-cn': '福岛县',
      'zh-tw': '福島縣',
      ko: '후쿠시마현',
      th: 'ฟุกุชิมะ',
      vi: 'Fukushima'
    },
    region: 'tohoku'
  },
  
  // 関東地方
  {
    code: 'ibaraki',
    name: {
      ja: '茨城県',
      en: 'Ibaraki',
      'zh-cn': '茨城县',
      'zh-tw': '茨城縣',
      ko: '이바라키현',
      th: 'อิบาระกิ',
      vi: 'Ibaraki'
    },
    region: 'kanto'
  },
  {
    code: 'tochigi',
    name: {
      ja: '栃木県',
      en: 'Tochigi',
      'zh-cn': '栃木县',
      'zh-tw': '栃木縣',
      ko: '도치기현',
      th: 'โทชิงิ',
      vi: 'Tochigi'
    },
    region: 'kanto'
  },
  {
    code: 'gunma',
    name: {
      ja: '群馬県',
      en: 'Gunma',
      'zh-cn': '群马县',
      'zh-tw': '群馬縣',
      ko: '군마현',
      th: 'กุนมะ',
      vi: 'Gunma'
    },
    region: 'kanto'
  },
  {
    code: 'saitama',
    name: {
      ja: '埼玉県',
      en: 'Saitama',
      'zh-cn': '埼玉县',
      'zh-tw': '埼玉縣',
      ko: '사이타마현',
      th: 'ไซตามะ',
      vi: 'Saitama'
    },
    region: 'kanto'
  },
  {
    code: 'chiba',
    name: {
      ja: '千葉県',
      en: 'Chiba',
      'zh-cn': '千叶县',
      'zh-tw': '千葉縣',
      ko: '치바현',
      th: 'ชิบะ',
      vi: 'Chiba'
    },
    region: 'kanto'
  },
  {
    code: 'tokyo',
    name: {
      ja: '東京都',
      en: 'Tokyo',
      'zh-cn': '东京都',
      'zh-tw': '東京都',
      ko: '도쿄도',
      th: 'โตเกียว',
      vi: 'Tokyo'
    },
    region: 'kanto'
  },
  {
    code: 'kanagawa',
    name: {
      ja: '神奈川県',
      en: 'Kanagawa',
      'zh-cn': '神奈川县',
      'zh-tw': '神奈川縣',
      ko: '가나가와현',
      th: 'คานางาวะ',
      vi: 'Kanagawa'
    },
    region: 'kanto'
  },
  
  // 中部地方
  {
    code: 'niigata',
    name: {
      ja: '新潟県',
      en: 'Niigata',
      'zh-cn': '新潟县',
      'zh-tw': '新潟縣',
      ko: '니가타현',
      th: 'นีกาตะ',
      vi: 'Niigata'
    },
    region: 'chubu'
  },
  {
    code: 'toyama',
    name: {
      ja: '富山県',
      en: 'Toyama',
      'zh-cn': '富山县',
      'zh-tw': '富山縣',
      ko: '도야마현',
      th: 'โทยามะ',
      vi: 'Toyama'
    },
    region: 'chubu'
  },
  {
    code: 'ishikawa',
    name: {
      ja: '石川県',
      en: 'Ishikawa',
      'zh-cn': '石川县',
      'zh-tw': '石川縣',
      ko: '이시카와현',
      th: 'อิชิกาวะ',
      vi: 'Ishikawa'
    },
    region: 'chubu'
  },
  {
    code: 'fukui',
    name: {
      ja: '福井県',
      en: 'Fukui',
      'zh-cn': '福井县',
      'zh-tw': '福井縣',
      ko: '후쿠이현',
      th: 'ฟุกุอิ',
      vi: 'Fukui'
    },
    region: 'chubu'
  },
  {
    code: 'yamanashi',
    name: {
      ja: '山梨県',
      en: 'Yamanashi',
      'zh-cn': '山梨县',
      'zh-tw': '山梨縣',
      ko: '야마나시현',
      th: 'ยามานาชิ',
      vi: 'Yamanashi'
    },
    region: 'chubu'
  },
  {
    code: 'nagano',
    name: {
      ja: '長野県',
      en: 'Nagano',
      'zh-cn': '长野县',
      'zh-tw': '長野縣',
      ko: '나가노현',
      th: 'นางาโนะ',
      vi: 'Nagano'
    },
    region: 'chubu'
  },
  {
    code: 'gifu',
    name: {
      ja: '岐阜県',
      en: 'Gifu',
      'zh-cn': '岐阜县',
      'zh-tw': '岐阜縣',
      ko: '기후현',
      th: 'กิฟุ',
      vi: 'Gifu'
    },
    region: 'chubu'
  },
  {
    code: 'shizuoka',
    name: {
      ja: '静岡県',
      en: 'Shizuoka',
      'zh-cn': '静冈县',
      'zh-tw': '靜岡縣',
      ko: '시즈오카현',
      th: 'ชิซุโอะกะ',
      vi: 'Shizuoka'
    },
    region: 'chubu'
  },
  {
    code: 'aichi',
    name: {
      ja: '愛知県',
      en: 'Aichi',
      'zh-cn': '爱知县',
      'zh-tw': '愛知縣',
      ko: '아이치현',
      th: 'ไอจิ',
      vi: 'Aichi'
    },
    region: 'chubu'
  },
  
  // 近畿地方
  {
    code: 'mie',
    name: {
      ja: '三重県',
      en: 'Mie',
      'zh-cn': '三重县',
      'zh-tw': '三重縣',
      ko: '미에현',
      th: 'มิเอะ',
      vi: 'Mie'
    },
    region: 'kansai'
  },
  {
    code: 'shiga',
    name: {
      ja: '滋賀県',
      en: 'Shiga',
      'zh-cn': '滋贺县',
      'zh-tw': '滋賀縣',
      ko: '시가현',
      th: 'ชิงะ',
      vi: 'Shiga'
    },
    region: 'kansai'
  },
  {
    code: 'kyoto',
    name: {
      ja: '京都府',
      en: 'Kyoto',
      'zh-cn': '京都府',
      'zh-tw': '京都府',
      ko: '교토부',
      th: 'เกียวโต',
      vi: 'Kyoto'
    },
    region: 'kansai'
  },
  {
    code: 'osaka',
    name: {
      ja: '大阪府',
      en: 'Osaka',
      'zh-cn': '大阪府',
      'zh-tw': '大阪府',
      ko: '오사카부',
      th: 'โอซาก้า',
      vi: 'Osaka'
    },
    region: 'kansai'
  },
  {
    code: 'hyogo',
    name: {
      ja: '兵庫県',
      en: 'Hyogo',
      'zh-cn': '兵库县',
      'zh-tw': '兵庫縣',
      ko: '효고현',
      th: 'เฮียวโงะ',
      vi: 'Hyogo'
    },
    region: 'kansai'
  },
  {
    code: 'nara',
    name: {
      ja: '奈良県',
      en: 'Nara',
      'zh-cn': '奈良县',
      'zh-tw': '奈良縣',
      ko: '나라현',
      th: 'นาระ',
      vi: 'Nara'
    },
    region: 'kansai'
  },
  {
    code: 'wakayama',
    name: {
      ja: '和歌山県',
      en: 'Wakayama',
      'zh-cn': '和歌山县',
      'zh-tw': '和歌山縣',
      ko: '와카야마현',
      th: 'วาคายามะ',
      vi: 'Wakayama'
    },
    region: 'kansai'
  },
  
  // 中国地方
  {
    code: 'tottori',
    name: {
      ja: '鳥取県',
      en: 'Tottori',
      'zh-cn': '鸟取县',
      'zh-tw': '鳥取縣',
      ko: '돗토리현',
      th: 'ทตโตริ',
      vi: 'Tottori'
    },
    region: 'chugoku'
  },
  {
    code: 'shimane',
    name: {
      ja: '島根県',
      en: 'Shimane',
      'zh-cn': '岛根县',
      'zh-tw': '島根縣',
      ko: '시마네현',
      th: 'ชิมาเนะ',
      vi: 'Shimane'
    },
    region: 'chugoku'
  },
  {
    code: 'okayama',
    name: {
      ja: '岡山県',
      en: 'Okayama',
      'zh-cn': '冈山县',
      'zh-tw': '岡山縣',
      ko: '오카야마현',
      th: 'โอคายามะ',
      vi: 'Okayama'
    },
    region: 'chugoku'
  },
  {
    code: 'hiroshima',
    name: {
      ja: '広島県',
      en: 'Hiroshima',
      'zh-cn': '广岛县',
      'zh-tw': '廣島縣',
      ko: '히로시마현',
      th: 'ฮิโระชิมะ',
      vi: 'Hiroshima'
    },
    region: 'chugoku'
  },
  {
    code: 'yamaguchi',
    name: {
      ja: '山口県',
      en: 'Yamaguchi',
      'zh-cn': '山口县',
      'zh-tw': '山口縣',
      ko: '야마구치현',
      th: 'ยามากุจิ',
      vi: 'Yamaguchi'
    },
    region: 'chugoku'
  },
  
  // 四国地方
  {
    code: 'tokushima',
    name: {
      ja: '徳島県',
      en: 'Tokushima',
      'zh-cn': '德岛县',
      'zh-tw': '德島縣',
      ko: '도쿠시마현',
      th: 'โทคุชิมะ',
      vi: 'Tokushima'
    },
    region: 'shikoku'
  },
  {
    code: 'kagawa',
    name: {
      ja: '香川県',
      en: 'Kagawa',
      'zh-cn': '香川县',
      'zh-tw': '香川縣',
      ko: '가가와현',
      th: 'คางาวะ',
      vi: 'Kagawa'
    },
    region: 'shikoku'
  },
  {
    code: 'ehime',
    name: {
      ja: '愛媛県',
      en: 'Ehime',
      'zh-cn': '爱媛县',
      'zh-tw': '愛媛縣',
      ko: '에히메현',
      th: 'เอฮิเมะ',
      vi: 'Ehime'
    },
    region: 'shikoku'
  },
  {
    code: 'kochi',
    name: {
      ja: '高知県',
      en: 'Kochi',
      'zh-cn': '高知县',
      'zh-tw': '高知縣',
      ko: '고치현',
      th: 'โคจิ',
      vi: 'Kochi'
    },
    region: 'shikoku'
  },
  
  // 九州地方
  {
    code: 'fukuoka',
    name: {
      ja: '福岡県',
      en: 'Fukuoka',
      'zh-cn': '福冈县',
      'zh-tw': '福岡縣',
      ko: '후쿠오카현',
      th: 'ฟุกุโอกะ',
      vi: 'Fukuoka'
    },
    region: 'kyushu'
  },
  {
    code: 'saga',
    name: {
      ja: '佐賀県',
      en: 'Saga',
      'zh-cn': '佐贺县',
      'zh-tw': '佐賀縣',
      ko: '사가현',
      th: 'ซางะ',
      vi: 'Saga'
    },
    region: 'kyushu'
  },
  {
    code: 'nagasaki',
    name: {
      ja: '長崎県',
      en: 'Nagasaki',
      'zh-cn': '长崎县',
      'zh-tw': '長崎縣',
      ko: '나가사키현',
      th: 'นางาซากิ',
      vi: 'Nagasaki'
    },
    region: 'kyushu'
  },
  {
    code: 'kumamoto',
    name: {
      ja: '熊本県',
      en: 'Kumamoto',
      'zh-cn': '熊本县',
      'zh-tw': '熊本縣',
      ko: '구마모토현',
      th: 'คุมาโมโต',
      vi: 'Kumamoto'
    },
    region: 'kyushu'
  },
  {
    code: 'oita',
    name: {
      ja: '大分県',
      en: 'Oita',
      'zh-cn': '大分县',
      'zh-tw': '大分縣',
      ko: '오이타현',
      th: 'โอะอิตะ',
      vi: 'Oita'
    },
    region: 'kyushu'
  },
  {
    code: 'miyazaki',
    name: {
      ja: '宮崎県',
      en: 'Miyazaki',
      'zh-cn': '宫崎县',
      'zh-tw': '宮崎縣',
      ko: '미야자키현',
      th: 'มิยาซากิ',
      vi: 'Miyazaki'
    },
    region: 'kyushu'
  },
  {
    code: 'kagoshima',
    name: {
      ja: '鹿児島県',
      en: 'Kagoshima',
      'zh-cn': '鹿儿岛县',
      'zh-tw': '鹿兒島縣',
      ko: '가고시마현',
      th: 'คาโงชิมะ',
      vi: 'Kagoshima'
    },
    region: 'kyushu'
  },
  {
    code: 'okinawa',
    name: {
      ja: '沖縄県',
      en: 'Okinawa',
      'zh-cn': '冲绳县',
      'zh-tw': '沖繩縣',
      ko: '오키나와현',
      th: 'โอกินาวะ',
      vi: 'Okinawa'
    },
    region: 'kyushu'
  }
]

// 都道府県名を取得する関数
export function getPrefectureName(code: string, lang: string): string {
  const prefecture = PREFECTURES.find(p => p.code === code)
  if (!prefecture) return code
  
  const supportedLang = ['ja', 'en', 'zh-cn', 'zh-tw', 'ko', 'th', 'vi'].includes(lang) ? lang as keyof Prefecture['name'] : 'ja'
  return prefecture.name[supportedLang]
}

// 都道府県リストを言語別で取得
export function getPrefecturesForLanguage(lang: string): { code: string; name: string }[] {
  const supportedLang = ['ja', 'en', 'zh-cn', 'zh-tw', 'ko', 'th', 'vi'].includes(lang) ? lang as keyof Prefecture['name'] : 'ja'
  
  return PREFECTURES.map(prefecture => ({
    code: prefecture.code,
    name: prefecture.name[supportedLang]
  }))
}

// 都道府県コードから英語名を取得（Sanityスキーマ用）
export function getPrefectureEnglishCode(japaneseName: string): string | null {
  // 日本語名から都道府県を探す
  for (const prefecture of PREFECTURES) {
    if (prefecture.name.ja === japaneseName) {
      return prefecture.code
    }
  }
  return null
}