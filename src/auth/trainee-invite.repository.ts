import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { ActivationStatus, Gender, Role } from '@generated/prisma/enums';
import { randomUUID } from 'crypto';

@Injectable()
export class TraineeInviteRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findInviteCandidateByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: { trainee: true },
    });
  }

  async findInviteCandidateById(userId: number) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      include: { trainee: true },
    });
  }

  // Case 1: creates a bare pending trainee shell (the trainee row is only created at completeTraineeRegistration)
  async createPendingTrainee(email: string) {
    const user = await this.prisma.user.create({
      data: {
        name: email.split('@')[0] || 'trainee',
        email,
        phoneNumber: `pending:${randomUUID().slice(0, 8)}`,
        passwordHash: null,
        role: Role.TRAINEE,
        activationStatus: ActivationStatus.PENDING,
      },
    });
    return { ...user, trainee: null };
  }

  // Cases 1 & 2: trainee is setting a password for the first time (be it a new user or an existing one that never completed registration)
  async completeTraineeRegistration(
    userId: number,
    trainerId: number,
    dto: { name: string; passwordHash: string },
  ) {
    const [user] = await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: userId },
        data: {
          name: dto.name,
          passwordHash: dto.passwordHash,
          activationStatus: ActivationStatus.ACTIVATED,
        },
      }),
      this.prisma.trainee.create({
        data: {
          userId,
          gender: Gender.MALE,
          birthDate: new Date(0),
          bodyMetrics: {},
          trainerId,
        },
      }),
    ]);

    return user;
  }

  // Case 3: trainee already has a password/activation from a previous registration (previous trainer removed them)
  async assignTrainerToTrainee(userId: number, trainerId: number) {
    await this.prisma.trainee.update({
      where: { userId },
      data: { trainerId },
    });
  }
}
