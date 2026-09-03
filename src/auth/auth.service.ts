import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { RefreshTokenService } from '@/refresh-token/refresh-token.service';
import * as bcrypt from 'bcrypt';
import { UserService } from '@/user/user.service';
import { CustomJwtPayload } from '@/common/types';
import { JwtService } from '@/jwt/jwt.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly refreshTokenService: RefreshTokenService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
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

  async login(user: CustomJwtPayload) {
    const accessToken = this.jwtService.signAccessToken({ sub: user.sub, role: user.role });

    const { refreshToken } = await this.refreshTokenService.createRefreshToken(user.id);
    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshAccessToken(refreshToken: string) {
    const hashedRefreshToken = this.refreshTokenService.hashStringDeterministic(refreshToken);
    const oldToken = await this.refreshTokenService.getTokenByHash(hashedRefreshToken);

    if (!oldToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (oldToken.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token expired');
    }

    const user: CustomJwtPayload = { sub: oldToken.userId.toString(), role: oldToken.user.role };
    const accessToken = this.jwtService.signAccessToken(user);

    const { refreshToken: newRefreshToken } = await this.refreshTokenService.updateTokenHash(
      oldToken.id,
    );

    return { refreshToken: newRefreshToken, accessToken };
  }

  async logout(refreshToken: string) {
    const hashedRefreshToken = this.refreshTokenService.hashStringDeterministic(refreshToken);
    const token = await this.refreshTokenService.getTokenByHash(hashedRefreshToken);
    if (token) {
      await this.refreshTokenService.deleteTokensById(token.id);
      this.logger.log(`Refresh token with ID: ${token.id} deleted during logout`);
    }
  }
}
