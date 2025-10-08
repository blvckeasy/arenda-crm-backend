import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { GoogleUser } from '@blvckeasy/arenda-crm-core';
import { Cache } from 'cache-manager';

@Injectable()
export class AuthService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async handleGoogleLogin(creditorData: GoogleUser): Promise<{ verified: boolean; data: GoogleUser }> {
    const cacheKey = `google_oauth_${creditorData.email}`;
    const foundEmailData = await this.cacheManager.get<GoogleUser>(cacheKey);

    if (foundEmailData?.email) {
      await this.cacheManager.del(cacheKey);
    } else {
      await this.cacheManager.set(cacheKey, creditorData);
    }

    return {
      verified: true,
      data: creditorData,
    };
  }

  async getCreditorFromCache(cacheKey: string): Promise<any> {
    return await this.cacheManager.get(cacheKey)
  }
}