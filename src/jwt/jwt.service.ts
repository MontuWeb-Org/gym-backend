import { Inject, Injectable } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

import jwtConfig from './jwt.config';

interface AccessTokenPayload {
  sub: string;
  roles: string[];
}

@Injectable()
export class JwtService {
  constructor(
    @Inject(jwtConfig.KEY)
    private readonly config: ConfigType<typeof jwtConfig>,
  ) {}

  signAccessToken(payload: AccessTokenPayload): string {
    return jwt.sign(payload, this.config.accessSecret!, {
      expiresIn: this.config.accessExpiresIn,
    });
  }

  verifyAccessToken(token: string): AccessTokenPayload {
    return jwt.verify(token, this.config.accessSecret!) as AccessTokenPayload;
  }
}
