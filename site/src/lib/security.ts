/**
 * Security utilities for protecting sensitive information
 */

/**
 * Mask sensitive information for logging
 */
export function maskCredentials(input: string): string {
  if (!input || input.length < 8) return '***';
  
  return input.slice(0, 4) + '*'.repeat(input.length - 8) + input.slice(-4);
}

/**
 * Validate environment variables are properly set
 */
export function validateEnvVars(): { valid: boolean; missing: string[] } {
  const required = [
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET'
  ];
  
  const missing = required.filter(key => !import.meta.env[key]);
  
  return {
    valid: missing.length === 0,
    missing
  };
}

/**
 * Safe error messages that don't leak sensitive information
 */
export function createSafeErrorMessage(error: any, context: string): string {
  // Log full error for debugging (server-side only)
  if (typeof process !== 'undefined') {
    console.error(`[${context}] Full error:`, error);
  }
  
  // Return safe message to client
  if (error?.message?.includes('Invalid credentials')) {
    return 'Authentication failed. Please check your configuration.';
  }
  
  if (error?.message?.includes('403')) {
    return 'Access denied. Please check your permissions.';
  }
  
  if (error?.message?.includes('404')) {
    return 'Resource not found. Please check your album ID.';
  }
  
  return 'An unexpected error occurred. Please try again later.';
}

/**
 * Sanitize album ID for logging
 */
export function sanitizeAlbumId(albumId: string): string {
  if (!albumId) return '[NOT_PROVIDED]';
  return maskCredentials(albumId);
}

/**
 * Check if running in development mode
 */
export function isDevelopment(): boolean {
  return import.meta.env.MODE === 'development' || import.meta.env.DEV;
}

/**
 * Log sensitive operations safely
 */
export function secureLog(operation: string, details?: Record<string, any>) {
  if (!isDevelopment()) return;
  
  const safeDetails = details ? Object.entries(details).reduce((acc, [key, value]) => {
    if (typeof value === 'string' && (
      key.toLowerCase().includes('secret') ||
      key.toLowerCase().includes('key') ||
      key.toLowerCase().includes('token') ||
      key.toLowerCase().includes('password')
    )) {
      acc[key] = maskCredentials(value);
    } else {
      acc[key] = value;
    }
    return acc;
  }, {} as Record<string, any>) : {};
  
  console.log(`[SECURE_LOG] ${operation}`, safeDetails);
}