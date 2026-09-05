import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { ActivationStatus, Role } from '@generated/prisma/enums';
import { RegisterInitDto } from '@/auth/dto';

@Injectable()
export class TrainerRegisterRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createPendingTrainer(dto: RegisterInitDto & { passwordHash: string }) {
    return await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name: dto.name,
          email: dto.email,
          phoneNumber: dto.phoneNumber,
          passwordHash: dto.passwordHash,
          role: Role.TRAINER,
          activationStatus: ActivationStatus.PENDING,
        },
      });

      await tx.trainer.create({
        data: {
          userId: user.id,
        },
      });

      return user;
    });
  }

  async activateUser(userId: number) {
    return await this.prisma.user.update({
      where: { id: userId },
      data: { activationStatus: ActivationStatus.ACTIVATED },
    });
  }

  async findById(userId: number) {
    return await this.prisma.user.findUnique({ where: { id: userId } });
  }
}
