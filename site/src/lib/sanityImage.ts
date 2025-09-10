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
  apiVersion: import.meta.env.PUBLIC_SANITY_API_VERSION || '2024-01-01',
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

  const baseUrl = urlFor(source)
    .width(width)
    .quality(quality)
    .fit(fit)
    .format(format);

  if (height) {
    baseUrl.height(height);
  }

  return baseUrl.url();
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
  
  return breakpoints
    .map(width => {
      const url = urlFor(source)
        .width(width)
        .quality(quality)
        .fit(fit)
        .format(format)
        .url();
      return `${url} ${width}w`;
    })
    .join(', ');
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