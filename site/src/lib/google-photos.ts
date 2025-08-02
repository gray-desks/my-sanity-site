import axios from 'axios'
import { readFileSync } from 'fs';
import { join } from 'path';
import { validateEnvVars, createSafeErrorMessage, sanitizeAlbumId, secureLog } from './security';

// --- OAuth2 helper ---
let oauth2Client: any = null;

function getOAuthClient(tokens?: any) {
  if (!oauth2Client) {
    oauth2Client = new google.auth.OAuth2(
      import.meta.env.GOOGLE_CLIENT_ID,
      import.meta.env.GOOGLE_CLIENT_SECRET,
      import.meta.env.GOOGLE_REDIRECT_URI
    );
  }
  if (tokens) {
    oauth2Client.setCredentials(tokens);
    // Try service account authentication first (recommended for production)
    if (import.meta.env.GOOGLE_SERVICE_ACCOUNT_KEY_PATH) {
      const keyPath = join(process.cwd(), import.meta.env.GOOGLE_SERVICE_ACCOUNT_KEY_PATH);
      
      try {
        const credentials = JSON.parse(readFileSync(keyPath, 'utf8'));
        
        const auth = new google.auth.GoogleAuth({
          credentials,
          scopes: ['https://www.googleapis.com/auth/photoslibrary.readonly']
        });

        photosClient = google.photoslibrary({ version: 'v1', auth });
        secureLog('Google Photos client initialized', { method: 'service_account' });
        return photosClient;
      } catch (keyError) {
        secureLog('Service account key error, falling back to OAuth2', { error: keyError.message });
      }
    }

    // OAuth2 client with optional tokens
    if (import.meta.env.GOOGLE_CLIENT_ID && import.meta.env.GOOGLE_CLIENT_SECRET) {
      const oauth2Client = new google.auth.OAuth2(
        import.meta.env.GOOGLE_CLIENT_ID,
        import.meta.env.GOOGLE_CLIENT_SECRET,
        import.meta.env.GOOGLE_REDIRECT_URI
      );

      // Set credentials if tokens are provided
      if (tokens) {
        oauth2Client.setCredentials(tokens);
        secureLog('Google Photos client initialized', { method: 'oauth2_with_tokens' });
      } else {
        secureLog('Google Photos client initialized', { method: 'oauth2_no_tokens' });
      }

      photosClient = google.photoslibrary({ version: 'v1', auth: oauth2Client });
      return photosClient;
    }

    throw new Error('No valid Google Photos authentication method configured');
  } catch (error) {
    const safeError = createSafeErrorMessage(error, 'GooglePhotosClient');
    throw new Error(safeError);
  }
}

export async function getSpecificAlbum(albumId?: string, tokens?: any) {
  const client = getPhotosClient(tokens);
  const targetAlbumId = albumId || import.meta.env.GOOGLE_PHOTOS_ALBUM_ID;
  
  if (!targetAlbumId) {
    throw new Error('No album ID specified');
  }

  try {
    secureLog('Fetching album', { albumId: sanitizeAlbumId(targetAlbumId) });
    
    const response = await client.albums.get({
      albumId: targetAlbumId
    });

    secureLog('Album fetched successfully', { 
      title: response.data.title,
      mediaItemsCount: response.data.mediaItemsCount 
    });

    return response.data;
  } catch (error) {
    const safeError = createSafeErrorMessage(error, 'GetSpecificAlbum');
    throw new Error(safeError);
  }
}

export async function getAlbumMediaItems(albumId?: string, maxItems: number = 20, tokens?: any) {
  const client = getPhotosClient(tokens);
  const targetAlbumId = albumId || import.meta.env.GOOGLE_PHOTOS_ALBUM_ID;
  
  if (!targetAlbumId) {
    throw new Error('No album ID specified');
  }

  try {
    const limitedMaxItems = Math.min(maxItems, 100); // API limit is 100
    
    secureLog('Fetching media items', { 
      albumId: sanitizeAlbumId(targetAlbumId),
      maxItems: limitedMaxItems
    });
    
    const response = await client.mediaItems.search({
      requestBody: {
        albumId: targetAlbumId,
        pageSize: limitedMaxItems
      }
    });

    const mediaItems = response.data.mediaItems || [];
    
    secureLog('Media items fetched successfully', { 
      count: mediaItems.length,
      requestedMax: limitedMaxItems
    });

    return mediaItems;
  } catch (error) {
    const safeError = createSafeErrorMessage(error, 'GetAlbumMediaItems');
    throw new Error(safeError);
  }
}

export interface PhotoDownloadOptions {
  albumId?: string;
  maxPhotos?: number;
  imageSize?: 'original' | 'large' | 'medium';
  tokens?: any;
}

export async function downloadPhotosFromAlbum(options: PhotoDownloadOptions = {}) {
  const { albumId, maxPhotos = 20, imageSize = 'large', tokens } = options;
  
  try {
    secureLog('Preparing photo downloads', { 
      albumId: albumId ? sanitizeAlbumId(albumId) : '[ENV_DEFAULT]',
      maxPhotos,
      imageSize
    });

    const mediaItems = await getAlbumMediaItems(albumId, maxPhotos, tokens);
    const downloadUrls = [];

    for (const item of mediaItems) {
      let downloadUrl = item.baseUrl;
      
      // Add size parameters based on imageSize option
      switch (imageSize) {
        case 'original':
          downloadUrl += '=d'; // Download original
          break;
        case 'large':
          downloadUrl += '=w1920-h1080-d'; // Large size with download
          break;
        case 'medium':
          downloadUrl += '=w1200-h800-d'; // Medium size with download
          break;
      }

      downloadUrls.push({
        id: item.id,
        filename: item.filename || `photo_${item.id}.jpg`,
        downloadUrl,
        metadata: {
          mimeType: item.mimeType,
          creationTime: item.mediaMetadata?.creationTime,
          width: item.mediaMetadata?.width,
          height: item.mediaMetadata?.height
        }
      });
    }

    secureLog('Photo download URLs prepared', { 
      count: downloadUrls.length,
      imageSize
    });

    return downloadUrls;
  } catch (error) {
    const safeError = createSafeErrorMessage(error, 'DownloadPhotosFromAlbum');
    throw new Error(safeError);
  }
}