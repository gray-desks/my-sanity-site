# Translation Setup Guide

## Overview

The Sanity Studio has been extended to support multi-language article management with:
- 20 supported languages (Japanese as master language)
- Translation relationship tracking via `translationOf` field
- i18n plugin integration for enhanced UI
- Webhook automation for translation pipeline

## Schema Changes

### New Field: `translationOf`
```javascript
{
  name: 'translationOf',
  title: 'Translation of',
  type: 'reference',
  to: [{type: 'article'}],
  weak: true,
  hidden: ({document}) => document?.lang === 'ja',
  description: 'Reference to the master article this is a translation of'
}
```

- **Hidden for Japanese articles**: Master articles (lang=ja) don't need this field
- **Weak reference**: Prevents deletion issues between translations
- **Reference to article**: Links to the master Japanese article

## Studio UI Features

### Master Articles (Japanese)
- `lang` defaults to 'ja'
- `translationOf` field is hidden
- Acts as the source for all translations

### Translation Articles
- `translationOf` field is visible and required
- Can reference the master Japanese article
- UI enhanced with i18n plugin features

## GROQ Queries

Use the translation fragment from `queries/translation.groq`:

```groq
*[_type=='article' && _id==$id][0]{ 
  ...articleTranslation 
}
```

This provides:
- Basic article data
- `translations[]` - all translations of this master
- `allTranslations[]` - all related translations (master + siblings)

## Webhook Setup

Create webhook for n8n translation pipeline:

```bash
# Usage
./scripts/create-webhook.sh <webhook-url>

# Example
./scripts/create-webhook.sh https://your-n8n-instance.com/webhook/translate-article
```

**Webhook Configuration:**
- **Filter**: `_type == "article" && lang == "ja"`
- **Triggers**: Create, Update of Japanese master articles only
- **Purpose**: Initiates automatic translation workflow

## Workflow

1. **Create Master Article**: Create article with `lang: 'ja'`
2. **Webhook Triggers**: n8n receives webhook when Japanese article is saved
3. **Translation Process**: n8n handles translation to other languages
4. **Create Translations**: n8n creates translated articles with `translationOf` reference

## Testing

1. **Studio Access**: https://travel-blog-jp.sanity.studio/
2. **Create Japanese Article**: Set lang=ja, translationOf field hidden
3. **Create Translation**: Set lang=en, translationOf field visible for master reference
4. **Verify Relationships**: Use GROQ queries to fetch translation groups

## Next Steps

1. Configure n8n workflow to handle webhook payload
2. Test translation creation flow
3. Monitor webhook logs in Sanity Dashboard → API → Webhooks