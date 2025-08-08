/**
 * Google AdSense 広告ユニット設定
 * 各広告枠のdata-ad-slot値を集中管理
 */
export const ADS_SLOTS = {
  // ホームページ広告
  HOME_HERO: "1903058190",
  HOME_INFEED: "", // 取得後差し替え：現在AdSense側でコード待ち
  HOME_FOOTER: "6102125837",
  
  // 記事ページ広告
  POST_TOP: "3219977470",
  POST_INARTICLE_1: "", // 取得後差し替え：現在未作成
  POST_BOTTOM: "5076016448",
  
  // サイドバー広告
  SIDEBAR_TOP: "3762934776",
} as const;

// 広告枠の種類を型定義
export type AdSlotKey = keyof typeof ADS_SLOTS;

/**
 * 広告枠名から対応するSlot IDを取得
 * @param slotKey 広告枠のキー
 * @returns Google AdSense のdata-ad-slot値
 */
export function getAdSlotId(slotKey: AdSlotKey): string {
  return ADS_SLOTS[slotKey];
}

/**
 * 広告表示条件の確認
 * @returns 広告を表示するかどうか
 */
export function shouldShowAds(): boolean {
  const adsenseClientId = import.meta.env?.PUBLIC_ADSENSE_CLIENT_ID;
  return !!(adsenseClientId && adsenseClientId !== "");
}