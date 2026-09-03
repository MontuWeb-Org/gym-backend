import { Injectable, Logger } from '@nestjs/common';
import { RefreshTokenRepository } from './refresh-token.repository';
import { RefreshToken } from '@/refresh-token/interfaces';
import { PrismaService } from '@/prisma/prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class RefreshTokenService {
  private readonly logger = new Logger(RefreshTokenService.name);

  constructor(
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly prisma: PrismaService,
  ) {}

  hashStringDeterministic(str: string): string {
    const hash = crypto.createHash('sha256');
    hash.update(str);
    return hash.digest('hex');
  }

  async createRefreshToken(refreshToken: RefreshToken) {
    const token = await this.refreshTokenRepository.create(refreshToken);
    this.logger.log('Refresh token created successfully for user ID: ' + refreshToken.userId);
    return token;
  }

  async getTokenByHash(hash: string) {
    return await this.refreshTokenRepository.findByToken(hash);
  }

  async updateTokenHash(id: number, newHash: string, expiresAt: Date) {
    return await this.refreshTokenRepository.updateTokenHashById(id, newHash, expiresAt);
  }

  async deleteTokensById(id: number) {
    return await this.refreshTokenRepository.delete(id);
  }
}
