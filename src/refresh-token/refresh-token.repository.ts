import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { RefreshToken } from '@/refresh-token/interfaces';

@Injectable()
export class RefreshTokenRepository {
  constructor(private readonly prismaService: PrismaService) { }

  async create(refreshToken: RefreshToken) {
    return await this.prismaService.refreshToken.create({
      data: refreshToken,
    });
  }

  async findAll() {
    return await this.prismaService.refreshToken.findMany();
  }

  async findById(id: number) {
    return await this.prismaService.refreshToken.findUnique({
      where: {
        id,
      },
    });
  }

  async findByUserId(userId: number) {
    return await this.prismaService.refreshToken.findMany({
      where: {
        userId,
      },
    });
  }

  async findByToken(token: string) {
    return await this.prismaService.refreshToken.findUnique({
      where: {
        tokenHash: token,
      },
    });
  }

  async updateTokenHashById(id: number, newHash: string, expiresAt: Date) {
    return await this.prismaService.refreshToken.update({
      where: {
        id,
      },
      data: {
        tokenHash: newHash,
        expiresAt,
      },
    });
  }

  async delete(id: number) {
    return await this.prismaService.refreshToken.delete({
      where: {
        id,
      },
    });
  }

  async deleteByUserId(userId: number) {
    return await this.prismaService.refreshToken.deleteMany({
      where: {
        userId,
      },
    });
  }

  async deleteByToken(token: string) {
    return await this.prismaService.refreshToken.delete({
      where: {
        tokenHash: token,
      },
    });
  }

  async deleteExpired() {
    return await this.prismaService.refreshToken.deleteMany({
      where: {
        expiresAt: {
          lte: new Date(),
        },
      },
    });
  }
}
