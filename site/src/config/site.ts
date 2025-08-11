/**
 * サイト全体の設定定数
 * ページネーション、表示件数、SEO関連の設定を管理
 */

import { SITE_TITLE, SITE_DESCRIPTION } from '../lib/env';

// ページネーション設定
export const PAGE_SIZE = 12; // 1ページあたりの記事表示数

// サイト基本情報
export const SITE_CONFIG = {
  // ページネーション設定
  articlesPerPage: PAGE_SIZE,
  
  // SEO設定
  defaultTitle: SITE_TITLE,
  defaultDescription: SITE_DESCRIPTION,
  
  // 多言語設定
  defaultLanguage: 'ja',
  
  // パフォーマンス設定
  imageLoadingStrategy: 'lazy' as const,
} as const;

// 型定義
export type SiteConfig = typeof SITE_CONFIG;

/**
 * ページネーション用のヘルパー関数
 */
export function calculateTotalPages(totalCount: number, pageSize: number = PAGE_SIZE): number {
  return Math.ceil(totalCount / pageSize);
}

/**
 * オフセット計算
 */
export function calculateOffset(page: number, pageSize: number = PAGE_SIZE): number {
  return (page - 1) * pageSize;
}

/**
 * ページ番号の妥当性チェック
 */
export function isValidPageNumber(page: number, totalPages: number): boolean {
  return page >= 1 && page <= Math.max(1, totalPages);
}