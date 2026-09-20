export class SimpleCache {
  private cache = new Map<string, { value: any; expiry: number }>();

  set(key: string, value: any, ttlSeconds: number) {
    this.cache.set(key, {
      value,
      expiry: Date.now() + ttlSeconds * 1000
    });
  }

  get(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }
    return item.value;
  }
}

export const globalCache = new SimpleCache();
