import { Inject, Injectable, Logger } from '@nestjs/common';
import { RefreshTokenRepository } from './refresh-token.repository';
import * as crypto from 'crypto';
import refreshTokenConfig from './refresh-token.config';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class RefreshTokenService {
  private readonly logger = new Logger(RefreshTokenService.name);

  constructor(
    private readonly refreshTokenRepository: RefreshTokenRepository,
    @Inject(refreshTokenConfig.KEY)
    private readonly config: ConfigType<typeof refreshTokenConfig>,
  ) { }

  private generateRefreshTokenWithExpiry(expiryInDays: number) {
    const refreshToken = crypto.randomBytes(64).toString('hex');
    const expiresAt = new Date();
    const hashedRefreshToken = this.hashStringDeterministic(refreshToken);
    expiresAt.setDate(expiresAt.getDate() + expiryInDays);
    return { refreshToken, hashedRefreshToken, expiresAt };
  }

  hashStringDeterministic(str: string): string {
    const hash = crypto.createHash('sha256');
    hash.update(str);
    return hash.digest('hex');
  }

  async createRefreshToken(userId: number) {
    const { refreshToken, hashedRefreshToken, expiresAt } = this.generateRefreshTokenWithExpiry(
      this.config.refreshExpiresInDays,
    );
    const token = await this.refreshTokenRepository.create({
      userId,
      tokenHash: hashedRefreshToken,
      expiresAt,
    });
    this.logger.log('Refresh token created successfully for user ID: ' + userId);
    return { ...token, refreshToken };
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
