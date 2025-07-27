// seed/seed-articles.js
import {createClient} from '@sanity/client'

const client = createClient({
  projectId: 'fcz6on8p',
  dataset: 'production',
  token: process.env.SANITY_TOKEN,
  apiVersion: '2023-08-01',
  useCdn: false
})

const articles = [
  {
    _id: 'article-asakusa-morning-ja',
    _type: 'article',
    title: '浅草寺で朝散歩',
    slug: { current: 'asakusa-morning', _type: 'slug' },
    type: 'spot',
    lang: 'ja',
    publishedAt: new Date().toISOString(),
    placeName: '浅草寺',
    location: {
      _type: 'geopoint',
      lat: 35.714838,
      lng: 139.796728
    },
    // coverImage will be added later via Studio
    gallery: [],
    body: [
      {
        _type: 'block',
        _key: 'block1',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'span1',
            text: '早朝の浅草寺を散歩してきました。観光客も少なく、静寂な雰囲気の中で歴史を感じることができました。雷門から本堂まで、ゆっくりと歩いて約30分。朝のお参りは心が洗われます。',
            marks: []
          }
        ]
      },
      {
        _type: 'affiliate',
        _key: 'affiliate1',
        service: 'booking',
        url: 'https://www.booking.com/hotel/jp/asakusa-example.html',
        title: '浅草周辺のホテル予約',
        description: '浅草観光に便利な立地のホテルをお探しの方におすすめです。'
      }
    ]
  },
  {
    _id: 'article-asakusa-morning-en',
    _type: 'article',
    title: 'Senso-ji Morning Walk',
    slug: { current: 'asakusa-morning', _type: 'slug' },
    type: 'spot',
    lang: 'en',
    publishedAt: new Date().toISOString(),
    placeName: 'Senso-ji Temple',
    location: {
      _type: 'geopoint',
      lat: 35.714838,
      lng: 139.796728
    },
    // coverImage will be added later via Studio
    gallery: [],
    body: [
      {
        _type: 'block',
        _key: 'block1',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'span1',
            text: 'I took an early morning walk at Senso-ji Temple. With fewer tourists around, I could feel the history in the quiet atmosphere. It takes about 30 minutes to walk slowly from Kaminarimon Gate to the main hall. Morning prayers cleanse the soul.',
            marks: []
          }
        ]
      },
      {
        _type: 'affiliate',
        _key: 'affiliate1',
        service: 'booking',
        url: 'https://www.booking.com/hotel/jp/asakusa-example.html',
        title: 'Book Hotels near Asakusa',
        description: 'Perfect location for exploring Asakusa area.'
      }
    ]
  },
  {
    _id: 'article-ginza-sushi-ja',
    _type: 'article',
    title: '銀座の寿司ランチ',
    slug: { current: 'ginza-sushi', _type: 'slug' },
    type: 'food',
    lang: 'ja',
    publishedAt: new Date().toISOString(),
    placeName: '銀座',
    location: {
      _type: 'geopoint',
      lat: 35.671347,
      lng: 139.763695
    },
    // coverImage will be added later via Studio
    gallery: [],
    body: [
      {
        _type: 'block',
        _key: 'block1',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'span1',
            text: '銀座の老舗寿司店でランチをいただきました。職人の技が光る極上の寿司に感動。ランチセットは2,500円からとリーズナブルで、夜は敷居が高いお店も昼間なら気軽に楽しめます。',
            marks: []
          }
        ]
      },
      {
        _type: 'affiliate',
        _key: 'affiliate1',
        service: 'rakuten',
        url: 'https://travel.rakuten.co.jp/ginza-restaurants/',
        title: '銀座グルメ予約',
        description: '銀座の高級レストランを楽天トラベルで予約できます。'
      }
    ]
  },
  {
    _id: 'article-ginza-sushi-en',
    _type: 'article',
    title: 'Sushi Lunch in Ginza',
    slug: { current: 'ginza-sushi', _type: 'slug' },
    type: 'food',
    lang: 'en',
    publishedAt: new Date().toISOString(),
    placeName: 'Ginza',
    location: {
      _type: 'geopoint',
      lat: 35.671347,
      lng: 139.763695
    },
    // coverImage will be added later via Studio
    gallery: [],
    body: [
      {
        _type: 'block',
        _key: 'block1',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'span1',
            text: 'Had lunch at a traditional sushi restaurant in Ginza. The master chef\'s skill shines through in every piece of exquisite sushi. Lunch sets start from ¥2,500, making high-end restaurants accessible during daytime.',
            marks: []
          }
        ]
      },
      {
        _type: 'affiliate',
        _key: 'affiliate1',
        service: 'klook',
        url: 'https://www.klook.com/activity/ginza-food-tour/',
        title: 'Ginza Food Tour',
        description: 'Experience the best of Ginza cuisine with guided tours.'
      }
    ]
  }
]

async function seedArticles() {
  console.log('🌱 Starting article seeding...')
  
  try {
    for (const article of articles) {
      console.log(`Creating article: ${article.title} (${article.lang})`)
      await client.createIfNotExists(article)
    }
    console.log('✅ Seed completed successfully!')
    console.log(`📊 Created ${articles.length} articles`)
  } catch (error) {
    console.error('❌ Seed failed:', error)
    process.exit(1)
  }
}

seedArticles()