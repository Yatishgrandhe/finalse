// Global cache for Yahoo Finance API calls
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

class YahooFinanceCache {
  private cache = new Map<string, CacheEntry<any>>();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes
  private readonly RATE_LIMIT_DELAY = 1000; // 1 second between requests
  private lastRequestTime = 0;
  private requestQueue: Array<() => void> = [];
  private requestCount = 0;
  private readonly MAX_REQUESTS_PER_MINUTE = 30; // Limit to 30 requests per minute
  private requestHistory: number[] = [];

  private async waitForRateLimit(): Promise<void> {
    const now = Date.now();
    
    // Clean up old request history (older than 1 minute)
    this.requestHistory = this.requestHistory.filter(time => now - time < 60000);
    
    // Check if we've exceeded the rate limit
    if (this.requestHistory.length >= this.MAX_REQUESTS_PER_MINUTE) {
      const oldestRequest = Math.min(...this.requestHistory);
      const waitTime = 60000 - (now - oldestRequest);
      if (waitTime > 0) {
        console.warn(`Rate limit exceeded. Waiting ${waitTime}ms before next request.`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
    
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < this.RATE_LIMIT_DELAY) {
      const waitTime = this.RATE_LIMIT_DELAY - timeSinceLastRequest;
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    this.lastRequestTime = Date.now();
    this.requestCount++;
    this.requestHistory.push(now);
  }

  private getCacheKey(url: string): string {
    return url;
  }

  private isExpired(entry: CacheEntry<any>): boolean {
    return Date.now() > entry.expiresAt;
  }

  async get<T>(url: string, ttl: number = this.DEFAULT_TTL): Promise<T | null> {
    const cacheKey = this.getCacheKey(url);
    const cached = this.cache.get(cacheKey);

    // Return cached data if it exists and is not expired
    if (cached && !this.isExpired(cached)) {
      console.log(`Cache hit for ${url}`);
      return cached.data;
    }

    // Wait for rate limiting
    await this.waitForRateLimit();

    try {
      console.log(`Fetching ${url}`);
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'API call failed');
      }

      // Cache the result
      const entry: CacheEntry<T> = {
        data: data.data,
        timestamp: Date.now(),
        expiresAt: Date.now() + ttl,
      };

      this.cache.set(cacheKey, entry);
      console.log(`Cached ${url} for ${ttl}ms`);

      return data.data;
    } catch (error) {
      console.error(`Error fetching ${url}:`, error);
      return null;
    }
  }

  // Clear expired entries
  cleanup(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];
    this.cache.forEach((entry, key) => {
      if (this.isExpired(entry)) {
        keysToDelete.push(key);
      }
    });
    keysToDelete.forEach(key => this.cache.delete(key));
  }

  // Clear all cache
  clear(): void {
    this.cache.clear();
  }

  // Get cache stats
  getStats(): { 
    size: number; 
    entries: Array<{ key: string; age: number; expiresIn: number }>;
    requestCount: number;
    requestsLastMinute: number;
  } {
    const now = Date.now();
    const entries = Array.from(this.cache.entries()).map(([key, entry]) => ({
      key,
      age: now - entry.timestamp,
      expiresIn: entry.expiresAt - now,
    }));

    // Clean up old request history
    this.requestHistory = this.requestHistory.filter(time => now - time < 60000);

    return {
      size: this.cache.size,
      entries,
      requestCount: this.requestCount,
      requestsLastMinute: this.requestHistory.length,
    };
  }
}

// Export singleton instance
export const yahooFinanceCache = new YahooFinanceCache();

// Cleanup expired entries every 5 minutes
setInterval(() => {
  yahooFinanceCache.cleanup();
}, 5 * 60 * 1000);
