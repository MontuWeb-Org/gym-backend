import { Injectable } from '@nestjs/common';
import { RefreshTokenService } from '@/refresh-token/refresh-token.service';
import { PrismaService } from '../prisma/prisma.service';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import { UserService } from '@/user/user.service';
import { CustomJwtPayload } from '@/common/types';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly userService: UserService,
  ) {}

  private generateRefreshTokenWithExpiry(expiryInDays: number) {
    const refreshToken = crypto.randomBytes(64).toString('hex');
    const expiresAt = new Date();
    const hashedRefreshToken = this.refreshTokenService.hashStringDeterministic(refreshToken);
    expiresAt.setDate(expiresAt.getDate() + expiryInDays);
    return { refreshToken, hashedRefreshToken, expiresAt };
  }

  async validateUser(identifier: string, password: string): Promise<CustomJwtPayload | null> {
    const user = await this.userService.findUserByEmail(identifier);
    if (user && user.passwordHash) {
      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (isMatch) {
        return { sub: user.id.toString(), role: user.role };
      }
    }
    return null;
  }
}
