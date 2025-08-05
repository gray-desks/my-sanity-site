#!/bin/bash

# Script to create Sanity webhook for master articles (lang=ja)
# This webhook will trigger the n8n translation pipeline when Japanese articles are created/updated

set -e

# Check if webhook URL is provided
if [ -z "$1" ]; then
  echo "Usage: $0 <webhook-url>"
  echo "Example: $0 https://your-n8n-instance.com/webhook/translate-article"
  exit 1
fi

WEBHOOK_URL="$1"
PROJECT_ID="fcz6on8p"
DATASET="production"

echo "Creating webhook for project: $PROJECT_ID"
echo "Dataset: $DATASET"
echo "Webhook URL: $WEBHOOK_URL"
echo ""

# Create webhook using Sanity CLI
npx sanity hook create \
  --project-id "$PROJECT_ID" \
  --dataset "$DATASET" \
  --url "$WEBHOOK_URL" \
  --filter '_type == "article" && lang == "ja"' \
  --name "Master Article Translation Trigger" \
  --description "Triggers n8n translation pipeline when Japanese (master) articles are created or updated"

echo ""
echo "✅ Webhook created successfully!"
echo ""
echo "The webhook will trigger on:"
echo "- Document type: article"
echo "- Language: ja (Japanese master articles only)"
echo "- Events: create, update"
echo ""
echo "Next steps:"
echo "1. Configure your n8n workflow to handle the webhook payload"
echo "2. Test by creating/updating a Japanese article in Sanity Studio"
echo "3. Monitor webhook logs in Sanity Dashboard → API → Webhooks"