import { PrismaService } from "@/prisma/prisma.service";
import { Injectable } from "@nestjs/common";


@Injectable()
export class UserRepository {
    constructor(private readonly prismaService: PrismaService) { }

    async findById(id: number) {
        return await this.prismaService.user.findUnique({
            where: {
                id,
            },
        });
    }

    async findByEmail(email: string) {
        return await this.prismaService.user.findUnique({
            where: {
                email,
            },
        });
    }
}