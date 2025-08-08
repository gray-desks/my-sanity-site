// utils/textParser.js

/**
 * 都道府県マッピング（表記揺れ対応）
 */
const PREFECTURE_MAPPING = {
  '北海道': 'hokkaido',
  '青森県': 'aomori', '青森': 'aomori',
  '岩手県': 'iwate', '岩手': 'iwate',
  '宮城県': 'miyagi', '宮城': 'miyagi',
  '秋田県': 'akita', '秋田': 'akita',
  '山形県': 'yamagata', '山形': 'yamagata',
  '福島県': 'fukushima', '福島': 'fukushima',
  '茨城県': 'ibaraki', '茨城': 'ibaraki',
  '栃木県': 'tochigi', '栃木': 'tochigi',
  '群馬県': 'gunma', '群馬': 'gunma',
  '埼玉県': 'saitama', '埼玉': 'saitama',
  '千葉県': 'chiba', '千葉': 'chiba',
  '東京都': 'tokyo', '東京': 'tokyo',
  '神奈川県': 'kanagawa', '神奈川': 'kanagawa',
  '新潟県': 'niigata', '新潟': 'niigata',
  '富山県': 'toyama', '富山': 'toyama',
  '石川県': 'ishikawa', '石川': 'ishikawa',
  '福井県': 'fukui', '福井': 'fukui',
  '山梨県': 'yamanashi', '山梨': 'yamanashi',
  '長野県': 'nagano', '長野': 'nagano',
  '岐阜県': 'gifu', '岐阜': 'gifu',
  '静岡県': 'shizuoka', '静岡': 'shizuoka',
  '愛知県': 'aichi', '愛知': 'aichi',
  '三重県': 'mie', '三重': 'mie',
  '滋賀県': 'shiga', '滋賀': 'shiga',
  '京都府': 'kyoto', '京都': 'kyoto',
  '大阪府': 'osaka', '大阪': 'osaka',
  '兵庫県': 'hyogo', '兵庫': 'hyogo',
  '奈良県': 'nara', '奈良': 'nara',
  '和歌山県': 'wakayama', '和歌山': 'wakayama',
  '鳥取県': 'tottori', '鳥取': 'tottori',
  '島根県': 'shimane', '島根': 'shimane',
  '岡山県': 'okayama', '岡山': 'okayama',
  '広島県': 'hiroshima', '広島': 'hiroshima',
  '山口県': 'yamaguchi', '山口': 'yamaguchi',
  '徳島県': 'tokushima', '徳島': 'tokushima',
  '香川県': 'kagawa', '香川': 'kagawa',
  '愛媛県': 'ehime', '愛媛': 'ehime',
  '高知県': 'kochi', '高知': 'kochi',
  '福岡県': 'fukuoka', '福岡': 'fukuoka',
  '佐賀県': 'saga', '佐賀': 'saga',
  '長崎県': 'nagasaki', '長崎': 'nagasaki',
  '熊本県': 'kumamoto', '熊本': 'kumamoto',
  '大分県': 'oita', '大分': 'oita',
  '宮崎県': 'miyazaki', '宮崎': 'miyazaki',
  '鹿児島県': 'kagoshima', '鹿児島': 'kagoshima',
  '沖縄県': 'okinawa', '沖縄': 'okinawa'
}

/**
 * 記事タイプ推定用キーワード
 */
const TYPE_KEYWORDS = {
  food: [
    'グルメ', '料理', 'レストラン', '食事', '食べ物', 'カフェ', '居酒屋', 
    '寿司', 'ラーメン', 'うどん', 'そば', '焼肉', '海鮮', '和食', '洋食',
    '中華', 'イタリアン', 'フレンチ', 'スイーツ', 'デザート', '名物',
    '特産', '郷土料理', '美味', 'おいしい', '味', 'メニュー', '食べる'
  ],
  hotel: [
    'ホテル', '旅館', '宿泊', '泊まる', '宿', 'リゾート', 'ペンション',
    'ゲストハウス', '民宿', '温泉宿', 'オーベルジュ', 'チェックイン',
    'チェックアウト', '部屋', 'ルーム', 'スイート', '露天風呂', '大浴場'
  ],
  transport: [
    '交通', 'アクセス', '電車', '新幹線', 'バス', '地下鉄', 'タクシー',
    '飛行機', '船', 'フェリー', '駅', '空港', '港', '乗り換え', '路線',
    '時刻表', '運賃', '切符', 'チケット', '移動', '行き方'
  ],
  spot: [
    '観光', '名所', 'スポット', '見どころ', '観る', '訪れる', '散策',
    '神社', '寺', '城', '公園', '美術館', '博物館', '記念館', '展望台',
    '景色', '絶景', 'パワースポット', '世界遺産', '国宝', '重要文化財'
  ]
}

/**
 * メイン解析関数
 * @param {string} rawText - 生のテキスト
 * @returns {Promise<Object>} 解析結果
 */
export async function parseTextToArticle(rawText) {
  if (!rawText || typeof rawText !== 'string') {
    throw new Error('有効なテキストを入力してください')
  }

  const lines = rawText.split('\n').map(line => line.trim()).filter(line => line)
  
  if (lines.length === 0) {
    throw new Error('テキストが空です')
  }

  try {
    const result = {
      lang: 'ja', // 固定値
      publishedAt: new Date().toISOString()
    }

    // タイトル抽出
    result.title = extractTitle(lines)
    
    // 記事タイプ推定
    result.type = inferArticleType(rawText)
    
    // 都道府県・場所名抽出
    const locationInfo = extractLocationInfo(rawText)
    result.prefecture = locationInfo.prefecture
    result.placeName = locationInfo.placeName
    
    // タグ抽出
    result.tags = extractTags(rawText)
    
    // 本文をPortable Text形式に変換
    result.content = convertToPortableText(rawText)

    return result
  } catch (error) {
    console.error('Parse error:', error)
    throw new Error(`テキスト解析エラー: ${error.message}`)
  }
}

/**
 * タイトル抽出
 * @param {string[]} lines - 行の配列
 * @returns {string} タイトル
 */
function extractTitle(lines) {
  // Markdown形式のヘッダーを優先
  for (const line of lines) {
    if (line.startsWith('#')) {
      return line.replace(/^#+\s*/, '').trim()
    }
  }
  
  // 最初の非空行をタイトルとして使用
  return lines[0] || '無題'
}

/**
 * 記事タイプ推定
 * @param {string} text - テキスト全体
 * @returns {string} 記事タイプ
 */
function inferArticleType(text) {
  const lowerText = text.toLowerCase()
  
  // 各タイプのスコア計算
  const scores = {}
  
  for (const [type, keywords] of Object.entries(TYPE_KEYWORDS)) {
    scores[type] = 0
    
    for (const keyword of keywords) {
      // キーワードの出現回数をカウント
      const regex = new RegExp(keyword, 'gi')
      const matches = text.match(regex)
      if (matches) {
        scores[type] += matches.length
      }
    }
  }
  
  // 最高スコアのタイプを返す
  const maxScore = Math.max(...Object.values(scores))
  if (maxScore === 0) {
    return 'spot' // デフォルト
  }
  
  return Object.keys(scores).find(type => scores[type] === maxScore) || 'spot'
}

/**
 * 都道府県・場所名抽出
 * @param {string} text - テキスト全体
 * @returns {Object} {prefecture, placeName}
 */
function extractLocationInfo(text) {
  const result = { prefecture: null, placeName: null }
  
  // より厳密な都道府県検出（文脈を考慮）
  for (const [prefName, prefValue] of Object.entries(PREFECTURE_MAPPING)) {
    // 都道府県名の前後に適切な文脈があるかチェック
    const prefPattern = new RegExp(`(?:^|[^一-龯])${prefName}(?:[一-龯]|[のにでを、。]|$)`, 'g')
    const prefMatch = prefPattern.exec(text)
    
    if (prefMatch) {
      result.prefecture = prefValue
      
      // 市区町村名を抽出（改良版）
      // パターン1: 都道府県名 + 地名 + 市区町村
      const cityPattern1 = new RegExp(`${prefName}([^。、\n]{1,15}?)(市|区|町|村)`, 'g')
      const cityMatch1 = cityPattern1.exec(text)
      
      if (cityMatch1) {
        result.placeName = cityMatch1[1] + cityMatch1[2]
      } else {
        // パターン2: 都道府県内の有名地名
        const famousPlaces = {
          'ishikawa': ['金沢', '輪島', '加賀', '小松'],
          'kyoto': ['京都市', '宇治', '嵐山', '祇園', '清水'],
          'tokyo': ['渋谷', '新宿', '浅草', '銀座', '原宿', '池袋'],
          'osaka': ['大阪市', '心斎橋', '難波', '梅田', '天王寺'],
          'kanagawa': ['横浜', '鎌倉', '箱根', '藤沢', '川崎']
        }
        
        const places = famousPlaces[prefValue]
        if (places) {
          for (const place of places) {
            if (text.includes(place)) {
              result.placeName = place
              break
            }
          }
        }
        
        // パターン3: 一般的な地名パターン
        if (!result.placeName) {
          const generalPattern = new RegExp(`${prefName}([^。、\n]{2,8})(?:[のでにを、。]|$)`, 'g')
          const generalMatch = generalPattern.exec(text)
          if (generalMatch && generalMatch[1]) {
            const candidate = generalMatch[1].trim()
            // 適切な地名候補かチェック
            if (/^[一-龯ひらがなカタカナ]{2,6}$/.test(candidate)) {
              result.placeName = candidate
            }
          }
        }
      }
      break
    }
  }
  
  // 都道府県が見つからなかった場合、有名観光地から推定
  if (!result.prefecture) {
    const landmarkToPrefecture = {
      '浅草寺': 'tokyo', '東京駅': 'tokyo', '新宿': 'tokyo', '渋谷': 'tokyo',
      '清水寺': 'kyoto', '金閣寺': 'kyoto', '嵐山': 'kyoto', '祇園': 'kyoto',
      '大阪城': 'osaka', '心斎橋': 'osaka', '道頓堀': 'osaka', '梅田': 'osaka',
      '金沢城': 'ishikawa', '兼六園': 'ishikawa', '21世紀美術館': 'ishikawa',
      '鎌倉大仏': 'kanagawa', '箱根': 'kanagawa', '中華街': 'kanagawa'
    }
    
    for (const [landmark, prefecture] of Object.entries(landmarkToPrefecture)) {
      if (text.includes(landmark)) {
        result.prefecture = prefecture
        if (!result.placeName) {
          result.placeName = landmark
        }
        break
      }
    }
  }
  
  return result
}

/**
 * タグ抽出
 * @param {string} text - テキスト全体
 * @returns {string[]} タグの配列
 */
function extractTags(text) {
  const tags = new Set()
  
  // 記事タイプ別の重み付きキーワード抽出
  for (const [type, keywords] of Object.entries(TYPE_KEYWORDS)) {
    for (const keyword of keywords) {
      if (text.includes(keyword) && keyword.length >= 2) {
        // 出現回数に基づく重み付け
        const occurrences = (text.match(new RegExp(keyword, 'gi')) || []).length
        if (occurrences >= 2 || keyword.length >= 3) {
          tags.add(keyword)
        }
        if (tags.size >= 5) break
      }
    }
    if (tags.size >= 5) break
  }
  
  // 地域関連の固有名詞を抽出
  const locationKeywords = [
    '金沢', '京都', '大阪', '東京', '横浜', '名古屋', '福岡', '札幌', 
    '仙台', '広島', '神戸', '千葉', '埼玉', '奈良', '鎌倉', '箱根'
  ]
  
  for (const location of locationKeywords) {
    if (text.includes(location) && tags.size < 5) {
      tags.add(location)
    }
  }
  
  // 観光関連の頻出語句を抽出
  const tourismPattern = /([一-龯]{2,6})(駅|城|寺|神社|公園|美術館|博物館|温泉|市場|通り|橋|山|湖|海|島|祭り)/g
  let match
  while ((match = tourismPattern.exec(text)) !== null && tags.size < 5) {
    const term = match[0]
    if (term.length >= 3 && term.length <= 8) {
      tags.add(term)
    }
  }
  
  return Array.from(tags).slice(0, 5)
}

/**
 * テキストをPortable Text形式に変換
 * @param {string} text - 生のテキスト
 * @returns {Array} Portable Text配列
 */
function convertToPortableText(text) {
  const blocks = []
  const lines = text.split('\n')
  
  let currentParagraph = []
  
  for (const line of lines) {
    const trimmedLine = line.trim()
    
    if (!trimmedLine) {
      // 空行の場合、現在の段落を終了
      if (currentParagraph.length > 0) {
        blocks.push(createTextBlockWithMarkdown(currentParagraph.join(' ')))
        currentParagraph = []
      }
      continue
    }
    
    // Markdown形式のヘッダー
    if (trimmedLine.startsWith('#')) {
      // 既存の段落を終了
      if (currentParagraph.length > 0) {
        blocks.push(createTextBlockWithMarkdown(currentParagraph.join(' ')))
        currentParagraph = []
      }
      
      // ヘッダーレベルを判定
      const level = Math.min(trimmedLine.match(/^#+/)[0].length, 6)
      const headerText = trimmedLine.replace(/^#+\s*/, '')
      
      blocks.push({
        _type: 'block',
        _key: generateKey(),
        style: `h${level}`,
        children: parseInlineMarkdown(headerText)
      })
    } 
    // 番号付きリスト
    else if (trimmedLine.match(/^\d+\.\s+/)) {
      // 既存の段落を終了
      if (currentParagraph.length > 0) {
        blocks.push(createTextBlockWithMarkdown(currentParagraph.join(' ')))
        currentParagraph = []
      }
      
      const listText = trimmedLine.replace(/^\d+\.\s+/, '')
      blocks.push({
        _type: 'block',
        _key: generateKey(),
        style: 'normal',
        listItem: 'number',
        level: 1,
        children: parseInlineMarkdown(listText)
      })
    }
    // 箇条書きリスト
    else if (trimmedLine.match(/^[-*+]\s+/)) {
      // 既存の段落を終了
      if (currentParagraph.length > 0) {
        blocks.push(createTextBlockWithMarkdown(currentParagraph.join(' ')))
        currentParagraph = []
      }
      
      const listText = trimmedLine.replace(/^[-*+]\s+/, '')
      blocks.push({
        _type: 'block',
        _key: generateKey(),
        style: 'normal',
        listItem: 'bullet',
        level: 1,
        children: parseInlineMarkdown(listText)
      })
    }
    else {
      // 通常のテキスト行
      currentParagraph.push(trimmedLine)
    }
  }
  
  // 最後の段落を追加
  if (currentParagraph.length > 0) {
    blocks.push(createTextBlockWithMarkdown(currentParagraph.join(' ')))
  }
  
  return blocks.length > 0 ? blocks : [createTextBlockWithMarkdown(text)]
}

/**
 * マークダウン対応のテキストブロックを作成
 * @param {string} text - テキスト
 * @returns {Object} ブロックオブジェクト
 */
function createTextBlockWithMarkdown(text) {
  return {
    _type: 'block',
    _key: generateKey(),
    style: 'normal',
    children: parseInlineMarkdown(text.trim())
  }
}

/**
 * インラインマークダウンをパース
 * @param {string} text - テキスト
 * @returns {Array} children配列
 */
function parseInlineMarkdown(text) {
  const children = []
  let currentText = text
  let position = 0
  
  // マークダウンパターンの定義（優先順位順）
  const patterns = [
    // リンク: [text](url)
    {
      regex: /\[([^\]]+)\]\(([^)]+)\)/g,
      type: 'link',
      parse: (match) => ({
        _type: 'span',
        _key: generateKey(),
        text: match[1],
        marks: ['link'],
        markDefs: [{
          _type: 'link',
          _key: generateKey(),
          href: match[2]
        }]
      })
    },
    // 太字: **text** または __text__
    {
      regex: /(\*\*|__)((?:(?!\1).)+)\1/g,
      type: 'strong',
      parse: (match) => ({
        _type: 'span',
        _key: generateKey(),
        text: match[2],
        marks: ['strong']
      })
    },
    // 斜体: *text* または _text_ (ただし太字の後でチェック)
    {
      regex: /(\*|_)((?:(?!\1).)+)\1/g,
      type: 'em',
      parse: (match) => ({
        _type: 'span',
        _key: generateKey(),
        text: match[2],
        marks: ['em']
      })
    },
    // インラインコード: `code`
    {
      regex: /`([^`]+)`/g,
      type: 'code',
      parse: (match) => ({
        _type: 'span',
        _key: generateKey(),
        text: match[1],
        marks: ['code']
      })
    }
  ]
  
  // マークダウンをパースして順次処理
  while (position < currentText.length) {
    let nearestMatch = null
    let nearestPattern = null
    let nearestIndex = currentText.length
    
    // 最も近いマークダウンパターンを検索
    for (const pattern of patterns) {
      pattern.regex.lastIndex = position
      const match = pattern.regex.exec(currentText)
      
      if (match && match.index < nearestIndex) {
        nearestMatch = match
        nearestPattern = pattern
        nearestIndex = match.index
      }
    }
    
    if (nearestMatch) {
      // マッチする前のテキストを追加
      if (nearestIndex > position) {
        const plainText = currentText.slice(position, nearestIndex)
        if (plainText) {
          children.push({
            _type: 'span',
            _key: generateKey(),
            text: plainText,
            marks: []
          })
        }
      }
      
      // マークダウンをパースして追加
      const parsedSpan = nearestPattern.parse(nearestMatch)
      
      // リンクの場合は markDefs を処理
      if (nearestPattern.type === 'link' && parsedSpan.markDefs) {
        // markDefsは後でブロックレベルで処理する必要があるため、
        // ここでは一時的にデータを保持
        parsedSpan.marks = [parsedSpan.markDefs[0]._key]
        children.push(parsedSpan)
      } else {
        children.push(parsedSpan)
      }
      
      position = nearestMatch.index + nearestMatch[0].length
    } else {
      // マッチしない残りのテキストを追加
      const remainingText = currentText.slice(position)
      if (remainingText) {
        children.push({
          _type: 'span',
          _key: generateKey(),
          text: remainingText,
          marks: []
        })
      }
      break
    }
  }
  
  // 空の場合はデフォルトのspanを返す
  if (children.length === 0) {
    children.push({
      _type: 'span',
      _key: generateKey(),
      text: text,
      marks: []
    })
  }
  
  return children
}

/**
 * テキストブロックを作成（後方互換性のため残す）
 * @param {string} text - テキスト
 * @returns {Object} ブロックオブジェクト
 */
function createTextBlock(text) {
  return createTextBlockWithMarkdown(text)
}

/**
 * ユニークキー生成
 * @returns {string} ランダムなキー
 */
function generateKey() {
  return Math.random().toString(36).substr(2, 9)
}