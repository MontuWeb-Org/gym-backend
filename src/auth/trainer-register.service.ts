import { ActivationStatus } from '@generated/prisma/enums';
import { BadRequestException, ConflictException, Inject, Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import * as bcrypt from 'bcrypt';
import type { ConfigType } from '@nestjs/config';
import { Redis } from 'ioredis';

import { RedisService } from '@/redis/redis.service';
import { OtpService } from '@/otp/otp.service';
import otpConfig from '@/otp/otp.config';
import { MailService } from '@/mail/mail.service';
import { UserService } from '@/user/user.service';
import { TrainerRegisterRepository } from './trainer-register.repository';
import { RefreshTokenService } from '@/refresh-token/refresh-token.service';
import { JwtService } from '@/jwt/jwt.service';
import { RegisterInitDto, RegisterCompleteDto } from './dto';

const REDIS_PREFIX = 'trainer:reg:';

interface OtpRedisEntry {
  userId: number;
  otpHash: string;
}

@Injectable()
export class TrainerRegisterService {
  private readonly logger = new Logger(TrainerRegisterService.name);
  private readonly redis: Redis;

  constructor(
    private readonly redisService: RedisService,
    private readonly otpService: OtpService,
    @Inject(otpConfig.KEY)
    private readonly otpCfg: ConfigType<typeof otpConfig>,
    private readonly mailService: MailService,
    private readonly userService: UserService,
    private readonly trainerRegisterRepository: TrainerRegisterRepository,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly jwtService: JwtService,
  ) {
    this.redis = this.redisService.getClient();
  }

  async registerInit(dto: RegisterInitDto) {
    const existingUser = await this.userService.findUserByEmail(dto.email);

    if (existingUser && existingUser.activationStatus === ActivationStatus.ACTIVATED) {
      throw new ConflictException('Email is already registered');
    }

    let user = existingUser;
    if (!user) {
      const passwordHash = await bcrypt.hash(dto.password, 10);
      user = await this.trainerRegisterRepository.createPendingTrainer({
        ...dto,
        passwordHash,
      });
    }

    const otp = this.otpService.generate();
    const otpHash = await this.otpService.hash(otp);

    const creationToken = randomUUID();

    const entry: OtpRedisEntry = { userId: user.id, otpHash };
    const ttlSeconds = this.otpCfg.expiresInMinutes * 60;
    await this.redis.set(REDIS_PREFIX + creationToken, JSON.stringify(entry), 'EX', ttlSeconds);

    await this.mailService.sendRegistrationOtp({
      to: user.email,
      otp,
      expiresInMinutes: this.otpCfg.expiresInMinutes,
    });

    this.logger.log(`Trainer registration initiated for user #${user.id}`);

    return { creationToken };
  }

  async registerComplete(dto: RegisterCompleteDto) {
    const redisKey = REDIS_PREFIX + dto.creationToken;
    const raw = await this.redis.get(redisKey);
    if (!raw) {
      throw new BadRequestException('Invalid or expired creation token');
    }

    const entry: OtpRedisEntry = JSON.parse(raw) as OtpRedisEntry;

    const isValid = await this.otpService.verify(dto.otp, entry.otpHash);
    if (!isValid) {
      throw new BadRequestException('Invalid OTP');
    }

    await this.redis.del(redisKey);

    const user = await this.trainerRegisterRepository.activateUser(entry.userId);

    const accessToken = this.jwtService.signAccessToken({
      sub: user.id.toString(),
      role: user.role,
    });

    const { refreshToken } = await this.refreshTokenService.createRefreshToken(user.id);

    this.logger.log(`Trainer registration completed for user #${user.id}`);

    return { accessToken, refreshToken };
  }
}
