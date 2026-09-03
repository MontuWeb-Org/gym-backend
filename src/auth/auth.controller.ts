import { Controller, Inject, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from '@/auth/guards/auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { CustomJwtPayload } from '@/common/types';
import { Response } from 'express';
import refreshTokenConfig from '@/refresh-token/refresh-token.config';
import { ConfigType } from '@nestjs/config';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService,
    @Inject(refreshTokenConfig.KEY)
    private readonly config: ConfigType<typeof refreshTokenConfig>,
  ) { }


  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @CurrentUser() user: CustomJwtPayload,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.login(user);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      maxAge: this.config.refreshExpiresInDays * 24 * 60 * 60 * 1000,
    });
    return { accessToken };
  }
}
