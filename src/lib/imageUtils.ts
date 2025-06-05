/**
 * Utility functions for handling both local and external images
 */

/**
 * Determines if an image URL is external (starts with http:// or https://)
 * or local (relative path or starts with /)
 */
export function isExternalImageUrl(url: string): boolean {
  return url.startsWith('http://') || url.startsWith('https://');
}

/**
 * Normalizes an image URL for proper display
 * - External URLs are returned as-is
 * - Local paths are ensured to start with / for proper public folder access
 * - Handles both absolute and relative local paths
 */
export function normalizeImageUrl(url: string): string {
  if (!url) return '';
  
  // If it's an external URL, return as-is
  if (isExternalImageUrl(url)) {
    return url;
  }
  
  // For local paths, ensure they start with / to reference public folder
  if (!url.startsWith('/')) {
    return `/${url}`;
  }
  
  return url;
}

/**
 * Validates if an image URL is properly formatted
 */
export function isValidImageUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  
  // Check for external URLs
  if (isExternalImageUrl(url)) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
  
  // For local paths, just check if it's a non-empty string
  // Could be enhanced to check file extensions if needed
  return url.trim().length > 0;
}

/**
 * Common image file extensions
 */
export const IMAGE_EXTENSIONS = [
  'jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico'
];

/**
 * Checks if a URL has a valid image extension
 */
export function hasValidImageExtension(url: string): boolean {
  if (!url) return false;
  
  // For external URLs, check the pathname
  if (isExternalImageUrl(url)) {
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname.toLowerCase();
      return IMAGE_EXTENSIONS.some(ext => pathname.endsWith(`.${ext}`));
    } catch {
      return false;
    }
  }
  
  // For local paths, check the file extension directly
  const lowercaseUrl = url.toLowerCase();
  return IMAGE_EXTENSIONS.some(ext => lowercaseUrl.endsWith(`.${ext}`));
}

/**
 * Gets placeholder image URL for broken/missing images
 */
export function getPlaceholderImageUrl(): string {
  return '/placeholder.svg'; // SVG placeholder that always works
}
