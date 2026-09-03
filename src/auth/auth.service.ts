import { Injectable } from '@nestjs/common';
import { RefreshTokenService } from '@/refresh-token/refresh-token.service';
import { PrismaService } from '../prisma/prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly refreshTokenService: RefreshTokenService,
    ) { }

    private generateRefreshTokenWithExpiry(expiryInDays: number) {
        const refreshToken = crypto.randomBytes(64).toString('hex');
        const expiresAt = new Date();
        const hashedRefreshToken = this.refreshTokenService.hashStringDeterministic(refreshToken);
        expiresAt.setDate(expiresAt.getDate() + expiryInDays);
        return { refreshToken, hashedRefreshToken, expiresAt };
    }


}
