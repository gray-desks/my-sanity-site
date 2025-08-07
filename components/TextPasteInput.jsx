// components/TextPasteInput.jsx
import React, { useState, useCallback } from 'react'
import { set, unset } from 'sanity'
import { parseTextToArticle } from '../utils/textParser.js'

export default function TextPasteInput(props) {
  const { onChange, value = '' } = props
  const [rawText, setRawText] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const handleTextChange = useCallback((event) => {
    setRawText(event.target.value)
    setError(null)
    setSuccess(false)
  }, [])

  const handleParseText = useCallback(async () => {
    if (!rawText.trim()) {
      setError('記事テキストを入力してください')
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      // テキストを解析して構造化データに変換
      const parsedData = await parseTextToArticle(rawText)
      
      // 解析結果をSanityドキュメントに適用
      if (parsedData.title) {
        onChange(set(parsedData.title, ['title']))
      }
      
      if (parsedData.type) {
        onChange(set(parsedData.type, ['type']))
      }
      
      if (parsedData.prefecture) {
        onChange(set(parsedData.prefecture, ['prefecture']))
      }
      
      if (parsedData.placeName) {
        onChange(set(parsedData.placeName, ['placeName']))
      }
      
      if (parsedData.tags && parsedData.tags.length > 0) {
        onChange(set(parsedData.tags, ['tags']))
      }
      
      if (parsedData.content) {
        onChange(set(parsedData.content, ['content']))
      }

      // 処理完了後、このフィールドを非表示にする
      onChange(unset(['textPaste']))
      
      setSuccess(true)
      setRawText('')

    } catch (err) {
      console.error('Text parsing error:', err)
      setError(err.message || 'テキストの解析に失敗しました')
    } finally {
      setIsProcessing(false)
    }
  }, [rawText, onChange])

  const handleClear = useCallback(() => {
    setRawText('')
    setError(null)
    setSuccess(false)
  }, [])

  return (
    <div className="text-paste-container" style={{ 
      border: '1px solid #e1e5e9',
      borderRadius: '6px',
      padding: '16px',
      backgroundColor: '#f9fafb',
      marginBottom: '16px'
    }}>
      <div style={{ marginBottom: '12px' }}>
        <h3 className="text-paste-title" style={{ 
          margin: '0 0 8px 0',
          fontSize: '16px',
          fontWeight: '600',
          color: '#1f2937'
        }}>
          📝 記事テキスト一括入力
        </h3>
        <p className="text-paste-description" style={{
          margin: '0',
          fontSize: '14px',
          color: '#6b7280',
          lineHeight: '1.4'
        }}>
          ChatGPTで生成した記事をここに貼り付けて自動変換してください
        </p>
      </div>

      <textarea
        className="text-paste-textarea"
        value={rawText}
        onChange={handleTextChange}
        placeholder={`記事のテキストをここに貼り付けてください。例:

# 金沢21世紀美術館の魅力

石川県金沢市にある現代アートの殿堂、金沢21世紀美術館。
透明感あふれる円形の建物が特徴的で...

アクセス: JR金沢駅からバス20分
営業時間: 10:00-18:00`}
        rows={15}
        disabled={isProcessing}
        style={{
          width: '100%',
          fontFamily: 'Consolas, Monaco, "Courier New", monospace',
          fontSize: '14px',
          lineHeight: '1.5',
          padding: '12px',
          border: '1px solid #d1d5db',
          borderRadius: '4px',
          backgroundColor: '#ffffff',
          resize: 'vertical',
          marginBottom: '12px',
          boxSizing: 'border-box'
        }}
      />

      {error && (
        <div style={{
          padding: '12px',
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '4px',
          marginBottom: '12px'
        }}>
          <span style={{ color: '#dc2626', fontSize: '14px' }}>❌ {error}</span>
        </div>
      )}

      {success && (
        <div style={{
          padding: '12px',
          backgroundColor: '#f0fdf4',
          border: '1px solid #bbf7d0',
          borderRadius: '4px',
          marginBottom: '12px'
        }}>
          <span style={{ color: '#16a34a', fontSize: '14px' }}>✅ 記事データの自動生成が完了しました！</span>
        </div>
      )}

      <div className="text-paste-buttons" style={{ 
        display: 'flex', 
        gap: '8px', 
        alignItems: 'center',
        flexWrap: 'wrap'
      }}>
        <button
          className="text-paste-button-main"
          type="button"
          onClick={handleParseText}
          disabled={isProcessing || !rawText.trim()}
          style={{
            flex: '1 1 200px',
            minWidth: '200px',
            padding: '12px 20px',
            backgroundColor: isProcessing || !rawText.trim() ? '#9ca3af' : '#3b82f6',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            fontSize: '15px',
            fontWeight: '600',
            cursor: isProcessing || !rawText.trim() ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: isProcessing || !rawText.trim() ? 'none' : '0 2px 4px rgba(59, 130, 246, 0.2)',
            transform: isProcessing || !rawText.trim() ? 'none' : 'translateY(0)',
            ':hover': {
              backgroundColor: isProcessing || !rawText.trim() ? '#9ca3af' : '#2563eb',
              transform: 'translateY(-1px)',
              boxShadow: '0 4px 8px rgba(59, 130, 246, 0.3)'
            }
          }}
          onMouseEnter={(e) => {
            if (!isProcessing && rawText.trim()) {
              e.target.style.backgroundColor = '#2563eb'
              e.target.style.transform = 'translateY(-1px)'
              e.target.style.boxShadow = '0 4px 8px rgba(59, 130, 246, 0.3)'
            }
          }}
          onMouseLeave={(e) => {
            if (!isProcessing && rawText.trim()) {
              e.target.style.backgroundColor = '#3b82f6'
              e.target.style.transform = 'translateY(0)'
              e.target.style.boxShadow = '0 2px 4px rgba(59, 130, 246, 0.2)'
            }
          }}
        >
          {isProcessing ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <div style={{
                width: '16px',
                height: '16px',
                border: '2px solid rgba(255,255,255,0.3)',
                borderTop: '2px solid #ffffff',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
              解析中...
            </div>
          ) : (
            '🚀 記事データを自動生成'
          )}
        </button>

        <button
          className="text-paste-button-clear"
          type="button"
          onClick={handleClear}
          disabled={isProcessing}
          style={{
            flex: '0 0 auto',
            padding: '12px 16px',
            backgroundColor: '#ffffff',
            color: '#6b7280',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: isProcessing ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            if (!isProcessing) {
              e.target.style.backgroundColor = '#f3f4f6'
              e.target.style.borderColor = '#9ca3af'
            }
          }}
          onMouseLeave={(e) => {
            if (!isProcessing) {
              e.target.style.backgroundColor = '#ffffff'
              e.target.style.borderColor = '#d1d5db'
            }
          }}
        >
          🗑️ クリア
        </button>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          /* モバイル対応 */
          @media (max-width: 768px) {
            .text-paste-container {
              padding: 12px !important;
              margin: 8px !important;
            }
            
            .text-paste-title {
              font-size: 14px !important;
            }
            
            .text-paste-description {
              font-size: 12px !important;
            }
            
            .text-paste-textarea {
              font-size: 13px !important;
              padding: 10px !important;
            }
            
            .text-paste-buttons {
              flex-direction: column !important;
              gap: 12px !important;
            }
            
            .text-paste-button-main {
              min-width: 100% !important;
              padding: 14px 16px !important;
              font-size: 16px !important;
            }
            
            .text-paste-button-clear {
              width: 100% !important;
              padding: 12px 16px !important;
            }
          }
          
          /* タブレット対応 */
          @media (min-width: 769px) and (max-width: 1024px) {
            .text-paste-container {
              padding: 14px !important;
            }
            
            .text-paste-textarea {
              font-size: 13px !important;
            }
          }
        `
      }} />
    </div>
  )
}