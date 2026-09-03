import { Inject, Injectable, Logger } from '@nestjs/common';
import { RefreshTokenService } from '@/refresh-token/refresh-token.service';
import { PrismaService } from '../prisma/prisma.service';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import { UserService } from '@/user/user.service';
import { CustomJwtPayload } from '@/common/types';
import { JwtService } from '@/jwt/jwt.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) { }
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

}
