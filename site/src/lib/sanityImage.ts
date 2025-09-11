/**
 * Sanity Image CDN optimization utilities for LCP improvement
 * Provides responsive images with WebP/AVIF support and preload generation
 */

import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

// Sanity client setup
const client = createClient({
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID || 'fcz6on8p',
  dataset: import.meta.env.PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
});

const builder = imageUrlBuilder(client);

/**
 * Generate optimized image URL from Sanity asset
 */
export function urlFor(source: any) {
  return builder.image(source);
}

/**
 * Generate LCP-optimized image with preload support
 */
export interface ImageOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'avif' | 'auto';
  fit?: 'clip' | 'crop' | 'fill' | 'fillmax' | 'max' | 'scale' | 'min';
}

export function generateLCPImage(
  source: any,
  options: ImageOptions = {}
) {
  const {
    width = 1200,
    height,
    quality = 85,
    format = 'webp',
    fit = 'clip'
  } = options;

  // Try builder first (works when source contains a valid asset ref)
  try {
    let chain = urlFor(source)
      .width(width)
      .quality(quality)
      .fit(fit);

    if (format && format !== 'auto') {
      chain = chain.format(format as any);
    }
    if (height) {
      chain = chain.height(height);
    }
    const built = chain.url();
    if (built) return built;
  } catch (_) {
    // no-op, fall back to raw asset url handling below
  }

  // Fallback: build from raw asset URL if provided by GROQ (asset-> url)
  const rawUrl: string | undefined =
    (source && source.asset && (source.asset.url as string)) ||
    (source && (source.url as string)) ||
    (typeof source === 'string' ? source : undefined);

  if (rawUrl) {
    try {
      const u = new URL(rawUrl);
      // Prefer auto=format for broad compatibility; use fm for explicit formats
      if (format === 'webp' || format === 'avif') {
        u.searchParams.set('fm', format);
      } else {
        u.searchParams.set('auto', 'format');
      }
      if (width) u.searchParams.set('w', String(width));
      if (height) u.searchParams.set('h', String(height));
      if (quality) u.searchParams.set('q', String(quality));
      if (fit) u.searchParams.set('fit', fit);
      return u.toString();
    } catch (_) {
      // If URL constructor fails, just return the raw string
      return rawUrl;
    }
  }

  // As a last resort, return empty string to avoid broken attribute
  return '';
}

/**
 * Generate responsive srcset for multiple screen sizes
 */
export function generateResponsiveSrcSet(
  source: any,
  options: ImageOptions = {}
) {
  const {
    quality = 85,
    format = 'webp',
    fit = 'clip'
  } = options;

  const breakpoints = [320, 640, 768, 1024, 1280, 1920];

  // Attempt builder path first; if it fails for any width, fall back to raw URL approach
  try {
    const urls = breakpoints.map(w => {
      let chain = urlFor(source)
        .width(w)
        .quality(quality)
        .fit(fit);
      if (format && format !== 'auto') {
        chain = chain.format(format as any);
      }
      const url = chain.url();
      return `${url} ${w}w`;
    });
    return urls.join(', ');
  } catch (_) {
    // Fallback using raw asset URL
    const rawUrl: string | undefined =
      (source && source.asset && (source.asset.url as string)) ||
      (source && (source.url as string)) ||
      (typeof source === 'string' ? source : undefined);
    if (!rawUrl) return '';
    const urls = breakpoints.map(w => {
      try {
        const u = new URL(rawUrl);
        if (format === 'webp' || format === 'avif') {
          u.searchParams.set('fm', format);
        } else {
          u.searchParams.set('auto', 'format');
        }
        u.searchParams.set('w', String(w));
        u.searchParams.set('q', String(quality));
        u.searchParams.set('fit', fit);
        return `${u.toString()} ${w}w`;
      } catch (_) {
        return `${rawUrl} ${w}w`;
      }
    });
    return urls.join(', ');
  }
}

/**
 * Generate preload link for LCP image
 */
export function generatePreloadLink(
  source: any,
  options: ImageOptions = {}
) {
  const url = generateLCPImage(source, options);
  const srcSet = generateResponsiveSrcSet(source, options);
  
  return {
    href: url,
    imagesrcset: srcSet,
    imagesizes: '100vw'
  };
}

/**
 * Get optimized image dimensions from Sanity asset
 */
export function getImageDimensions(asset: any) {
  if (!asset?.metadata?.dimensions) {
    return { width: 1200, height: 675 }; // Default 16:9 aspect ratio
  }
  
  const { width, height } = asset.metadata.dimensions;
  return { width, height };
}

/**
 * Generate blur placeholder for progressive loading
 */
export function generateBlurPlaceholder(source: any) {
  return urlFor(source)
    .width(20)
    .height(20)
    .blur(50)
    .quality(20)
    .format('webp')
    .url();
}