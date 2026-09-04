import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import * as bcrypt from 'bcrypt';
import { Redis } from 'ioredis';
import { Role } from '@generated/prisma/enums';

import { RedisService } from '@/redis/redis.service';
import { MailService } from '@/mail/mail.service';
import { UserService } from '@/user/user.service';
import { RefreshTokenService } from '@/refresh-token/refresh-token.service';
import { JwtService } from '@/jwt/jwt.service';
import { TraineeInviteRepository } from './trainee-invite.repository';
import { InviteInitDto, InviteSetupDto, InviteAcceptDto } from './dto';

const REDIS_PREFIX = 'trainee:invite:';

interface InviteRedisEntry {
  userId: number;
  trainerId: number;
  trainerName: string;
}

interface InvitableUser {
  id: number;
  email: string;
  role: Role;
  passwordHash: string | null;
  trainee: { trainerId: number | null } | null;
}

@Injectable()
export class TraineeInviteService {
  private readonly logger = new Logger(TraineeInviteService.name);
  private readonly redis: Redis;

  constructor(
    private readonly redisService: RedisService,
    private readonly mailService: MailService,
    private readonly traineeInviteRepository: TraineeInviteRepository,
    private readonly userService: UserService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly jwtService: JwtService,
  ) {
    this.redis = this.redisService.getClient();
  }

  // Cases 1, 2 & 3 all funnel through here
  async inviteInit(dto: InviteInitDto, trainerUserId: number) {
    const trainer = await this.getTrainerOrThrow(trainerUserId);
    const existingUser = await this.traineeInviteRepository.findInviteCandidateByEmail(dto.email);

    // Case 1: brand new trainee
    const user: { id: number; email: string } = existingUser
      ? existingUser
      : await this.traineeInviteRepository.createPendingTrainee(dto.email);

    if (existingUser) {
      this.assertInvitable(existingUser);
    }
    // send the invitation (all 3 cases)
    await this.initInvite(user, trainer);

    return { message: 'Trainee registration initialized successfully.' };
  }

  // Cases 1 & 2: trainee is setting a password for the first time (be it a new user or an existing one that never completed registration)
  async inviteSetup(dto: InviteSetupDto) {
    const entry = await this.loadInviteEntry(dto.creationToken);
    const inviteUser = await this.loadInviteUser(entry.userId);

    if (inviteUser.passwordHash) {
      throw new BadRequestException('Invite acceptance is required for this user');
    }
    const passwordHash = await bcrypt.hash(dto.password, 10);
    await this.traineeInviteRepository.completeTraineeRegistration(entry.userId, entry.trainerId, {
      name: dto.name,
      passwordHash,
    });
    const accessToken = this.jwtService.signAccessToken({
      sub: inviteUser.id.toString(),
      role: inviteUser.role,
    });
    const { refreshToken } = await this.refreshTokenService.createRefreshToken(inviteUser.id);
    this.logger.log(`Trainee invitation completed for user #${inviteUser.id}`);
    return { accessToken, refreshToken };
  }

  // verify the creation token (identify the invite status)
  async inviteVerify(token: string) {
    const entry = await this.loadInviteEntry(token);
    const user = await this.loadInviteUser(entry.userId);

    return {
      creationToken: token,
      trainerName: entry.trainerName,
      status: user.passwordHash ? ('ACCEPT_INVITATION' as const) : ('SETUP_PASSWORD' as const),
    };
  }

  // Case 3: trainee already has a password/activation from a previous registration (previous trainer removed them)
  async inviteAccept(dto: InviteAcceptDto) {
    const entry = await this.loadInviteEntry(dto.creationToken);
    const user = await this.loadInviteUser(entry.userId);

    if (!dto.accept) {
      await this.redis.del(this.redisKey(dto.creationToken));
      return { message: 'Trainee registration rejected.' };
    }

    if (!user.passwordHash) {
      throw new BadRequestException('Invite setup is required before acceptance');
    }
    await this.redis.del(this.redisKey(dto.creationToken));
    await this.traineeInviteRepository.assignTrainerToTrainee(user.id, entry.trainerId);
    const accessToken = this.jwtService.signAccessToken({
      sub: user.id.toString(),
      role: user.role,
    });

    const { refreshToken } = await this.refreshTokenService.createRefreshToken(user.id);
    return { accessToken, refreshToken };
  }

  ///////////////////////////////////////

  private async getTrainerOrThrow(trainerUserId: number) {
    const trainer = await this.userService.findUserById(trainerUserId);
    if (!trainer || trainer.role !== Role.TRAINER) {
      throw new NotFoundException('Trainer not found');
    }
    return trainer;
  }

  private assertInvitable(user: InvitableUser) {
    if (user.role !== Role.TRAINEE) {
      throw new ConflictException('User is not a trainee');
    }
    if (user.trainee?.trainerId) {
      throw new ConflictException('User already has a trainer');
    }
  }

  private async initInvite(
    user: { id: number; email: string },
    trainer: { id: number; name: string },
  ) {
    const creationToken = randomUUID();
    await this.storeInviteToken(creationToken, user.id, trainer.id, trainer.name);
    await this.sendInviteEmail(user.email, creationToken, trainer.name);
    this.logger.log(`Invite initiated for user #${user.id}`);
  }

  private redisKey(token: string) {
    return `${REDIS_PREFIX}${token}`;
  }

  private async loadInviteEntry(token: string) {
    const raw = await this.redis.get(this.redisKey(token));
    if (!raw) {
      throw new NotFoundException('Invalid or expired creation token');
    }
    return JSON.parse(raw) as InviteRedisEntry;
  }

  private async loadInviteUser(userId: number) {
    const user = await this.traineeInviteRepository.findInviteCandidateById(userId);
    if (!user) {
      throw new NotFoundException('Invalid or expired creation token');
    }
    return user;
  }

  private async storeInviteToken(
    creationToken: string,
    userId: number,
    trainerId: number,
    trainerName: string,
  ) {
    const entry: InviteRedisEntry = {
      userId,
      trainerId,
      trainerName,
    };
    await this.redis.set(this.redisKey(creationToken), JSON.stringify(entry), 'EX', 60 * 60);
  }

  private async sendInviteEmail(email: string, creationToken: string, trainerName: string) {
    const inviteBaseUrl =
      process.env.FRONTEND_URL ?? process.env.APP_URL ?? 'http://localhost:3000';

    const inviteUrl = `${inviteBaseUrl}/auth/invite/verify/${creationToken}`;

    await this.mailService.sendTraineeInvitation({
      to: email,
      trainerName,
      inviteUrl,
    });
  }
}
