/**
 * Cookie utility functions for session management
 */

export const cookieUtils = {
  /**
   * Set a cookie with the given name, value, and options
   */
  set(name: string, value: string, options: {
    maxAge?: number; // in seconds
    path?: string;
    domain?: string;
    secure?: boolean;
    sameSite?: 'Strict' | 'Lax' | 'None';
  } = {}) {
    if (typeof document === 'undefined') return;
    
    const {
      maxAge = 7 * 24 * 60 * 60, // 7 days default
      path = '/',
      domain,
      secure = false,
      sameSite = 'Lax'
    } = options;
    
    let cookieString = `${name}=${value}; path=${path}; max-age=${maxAge}; SameSite=${sameSite}`;
    
    if (domain) {
      cookieString += `; domain=${domain}`;
    }
    
    if (secure) {
      cookieString += '; secure';
    }
    
    document.cookie = cookieString;
  },

  /**
   * Get a cookie value by name
   */
  get(name: string): string | null {
    if (typeof document === 'undefined') return null;
    
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    
    if (parts.length === 2) {
      return parts.pop()?.split(';').shift() || null;
    }
    
    return null;
  },

  /**
   * Delete a cookie by name
   */
  delete(name: string, options: { path?: string; domain?: string } = {}) {
    if (typeof document === 'undefined') return;
    
    const { path = '/', domain } = options;
    let cookieString = `${name}=; path=${path}; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    
    if (domain) {
      cookieString += `; domain=${domain}`;
    }
    
    document.cookie = cookieString;
  },

  /**
   * Check if a cookie exists
   */
  exists(name: string): boolean {
    return this.get(name) !== null;
  }
};
