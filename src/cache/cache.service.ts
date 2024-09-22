import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}
  async get(
    key: string,
    fallback?: () => Promise<any>,
    ttl: number = 0,
  ): Promise<any> {
    const result = await this.cacheManager.get(key);
    if (result) {
      console.log('FROM CACHE', key);
      return result;
    }
    const resultFromFallback = await fallback();
    if (resultFromFallback) {
      console.log('FROM FALLBACK', key);
      await this.cacheManager.set(key, resultFromFallback, ttl);
      return resultFromFallback;
    }
    return null;
  }

  del(key: string) {
    return this.cacheManager.del(key);
  }

  reset() {
    return this.cacheManager.reset();
  }
}
