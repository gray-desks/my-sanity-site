import axios from 'axios'
import { google } from 'googleapis'
import { sanitizeAlbumId, createSafeErrorMessage, secureLog } from './security'

const BASE = 'https://photoslibrary.googleapis.com/v1'

/**
 * Exchange stored OAuth2 refresh/access tokens for a valid access token string.
 */
export async function getAccessToken(tokens: any): Promise<string> {
  try {
    const oauth = new google.auth.OAuth2(
      import.meta.env.GOOGLE_CLIENT_ID,
      import.meta.env.GOOGLE_CLIENT_SECRET,
      import.meta.env.GOOGLE_REDIRECT_URI
    )
    oauth.setCredentials(tokens)
    const { token } = await oauth.getAccessToken()
    if (!token) throw new Error('Unable to obtain access token')
    return token
  } catch (err) {
    throw new Error(createSafeErrorMessage(err, 'GetAccessToken'))
  }
}

export interface PhotoDownloadInfo {
  id: string
  filename: string
  baseUrl: string
  mimeType?: string
  creationTime?: string
  width?: string
  height?: string
}

export async function fetchAlbum(albumId: string, tokens: any) {
  const id = albumId || import.meta.env.GOOGLE_PHOTOS_ALBUM_ID
  if (!id) throw new Error('No album ID specified')
  const access = await getAccessToken(tokens)
  const { data } = await axios.get(`${BASE}/albums/${id}`, {
    headers: { Authorization: `Bearer ${access}` }
  })
  return data
}

export async function fetchAlbumMediaItems(albumId: string, maxItems: number, tokens: any): Promise<PhotoDownloadInfo[]> {
  const id = albumId || import.meta.env.GOOGLE_PHOTOS_ALBUM_ID
  const pageSize = Math.min(maxItems, 100)
  const access = await getAccessToken(tokens)
  const { data } = await axios.post(
    `${BASE}/mediaItems:search`,
    { albumId: id, pageSize },
    { headers: { Authorization: `Bearer ${access}` } }
  )
  return (data.mediaItems || []).map((item: any) => ({
    id: item.id,
    filename: item.filename || `photo_${item.id}.jpg`,
    baseUrl: item.baseUrl,
    mimeType: item.mimeType,
    creationTime: item.mediaMetadata?.creationTime,
    width: item.mediaMetadata?.width,
    height: item.mediaMetadata?.height
  }))
}

export async function listAlbums(tokens: any) {
  try {
    const access = await getAccessToken(tokens)
    const { data } = await axios.get(`${BASE}/albums?pageSize=50`, {
      headers: { Authorization: `Bearer ${access}` }
    })
    return (data.albums || []).map((a: any) => ({
      id: a.id,
      title: a.title,
      productUrl: a.productUrl,
      mediaItemsCount: a.mediaItemsCount,
      coverPhotoBaseUrl: a.coverPhotoBaseUrl
    }))
  } catch (err) {
    throw new Error(createSafeErrorMessage(err, 'ListAlbums'))
  }
}

export async function prepareDownloadUrls(albumId: string, maxPhotos: number, size: 'original' | 'large' | 'medium', tokens: any) {
  try {
    secureLog('Preparing photo URLs', { albumId: sanitizeAlbumId(albumId), maxPhotos, size })
    const items = await fetchAlbumMediaItems(albumId, maxPhotos, tokens)
    return items.map(it => {
      let url = it.baseUrl
      switch (size) {
        case 'original':
          url += '=d'
          break
        case 'large':
          url += '=w1920-h1080-d'
          break
        case 'medium':
          url += '=w1200-h800-d'
          break
      }
      return { ...it, downloadUrl: url }
    })
  } catch (err) {
    throw new Error(createSafeErrorMessage(err, 'PrepareDownloadUrls'))
  }
}
