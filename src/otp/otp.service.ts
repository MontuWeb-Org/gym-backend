import { Inject, Injectable } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { randomInt } from 'crypto';
import * as bcrypt from 'bcrypt';
import otpConfig from './otp.config';

@Injectable()
export class OtpService {
  constructor(
    @Inject(otpConfig.KEY)
    private readonly config: ConfigType<typeof otpConfig>,
  ) {}

  generate(): string {
    const range = 10 ** this.config.length;
    return randomInt(1, range).toString().padStart(this.config.length, '0');
  }

  async hash(otp: string): Promise<string> {
    return bcrypt.hash(otp, this.config.saltRounds);
  }

  async verify(otp: string, hash: string): Promise<boolean> {
    return bcrypt.compare(otp, hash);
  }
}
