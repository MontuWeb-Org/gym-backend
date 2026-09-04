import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { z } from 'zod';

import { CurrentUser } from './decorators/current-user.decorator';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/auth.guard';
import { TrainerRegisterService } from './trainer-register.service';
import { TraineeInviteService } from './trainee-invite.service';
import { CustomJwtPayload } from '@/common/types';
import {
  RegisterInitDto,
  RegisterCompleteDto,
  registerInitSchema,
  registerCompleteSchema,
  InviteInitDto,
  inviteInitSchema,
  InviteSetupDto,
  inviteSetupSchema,
  InviteAcceptDto,
  inviteAcceptSchema,
} from './dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly trainerRegisterService: TrainerRegisterService,
    private readonly traineeInviteService: TraineeInviteService,
  ) {}

  @Post('register/init')
  async registerInit(@Body() body: { data: RegisterInitDto }) {
    const parsed = registerInitSchema.safeParse(body.data);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.flatten());
    }

    const result = await this.trainerRegisterService.registerInit(parsed.data);
    return { data: result };
  }

  @Post('register/complete')
  async registerComplete(
    @Body() body: { data: RegisterCompleteDto },
    @Res({ passthrough: true }) res: Response,
  ) {
    const parsed = registerCompleteSchema.safeParse(body.data);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.flatten());
    }

    const { accessToken, refreshToken } = await this.trainerRegisterService.registerComplete(
      parsed.data,
    );

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });

    return { data: { accessToken } };
  }

  @Post('invite/init')
  @UseGuards(JwtAuthGuard)
  async inviteInit(
    @CurrentUser() currentUser: CustomJwtPayload,
    @Body() body: { data: InviteInitDto },
  ) {
    const parsed = inviteInitSchema.safeParse(body.data);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.flatten());
    }

    const result = await this.traineeInviteService.inviteInit(parsed.data, Number(currentUser.sub));
    return result;
  }

  @Get('invite/verify/:token')
  async inviteVerify(@Param('token') token: string) {
    const parsed = z.string().uuid().safeParse(token);
    if (!parsed.success) {
      throw new BadRequestException('Invalid creation token');
    }

    const result = await this.traineeInviteService.inviteVerify(parsed.data);
    return { data: result };
  }

  @Post('invite/accept')
  async inviteAccept(
    @Body() body: { data: InviteAcceptDto },
    @Res({ passthrough: true }) res: Response,
  ) {
    const parsed = inviteAcceptSchema.safeParse(body.data);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.flatten());
    }

    const result = await this.traineeInviteService.inviteAccept(parsed.data);

    if ('refreshToken' in result) {
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
      });

      return { data: { accessToken: result.accessToken } };
    }

    return result;
  }

  @Post('invite/setup')
  async inviteSetup(
    @Body() body: { data: InviteSetupDto },
    @Res({ passthrough: true }) res: Response,
  ) {
    const parsed = inviteSetupSchema.safeParse(body.data);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.flatten());
    }

    const { accessToken, refreshToken } = await this.traineeInviteService.inviteSetup(parsed.data);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });

    return { data: { accessToken } };
  }
}
