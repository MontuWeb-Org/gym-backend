import { BadRequestException, Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';

import { AuthService } from './auth.service';
import { TrainerRegisterService } from './trainer-register.service';
import {
  RegisterInitDto,
  RegisterCompleteDto,
  registerInitSchema,
  registerCompleteSchema,
} from './dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly trainerRegisterService: TrainerRegisterService,
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
}
