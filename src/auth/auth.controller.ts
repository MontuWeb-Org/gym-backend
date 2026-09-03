import {
  Controller,
  Inject,
  Logger,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard, LocalAuthGuard } from '@/auth/guards';
import { CurrentUser } from './decorators/current-user.decorator';
import { CustomJwtPayload } from '@/common/types';
import { Response } from 'express';
import refreshTokenConfig from '@/refresh-token/refresh-token.config';
import { ConfigType } from '@nestjs/config';
import { RequestWithCookies } from '@/common/types/request-with-cookies.type';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(
    private readonly authService: AuthService,
    @Inject(refreshTokenConfig.KEY)
    private readonly config: ConfigType<typeof refreshTokenConfig>,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@CurrentUser() user: CustomJwtPayload, @Res({ passthrough: true }) res: Response) {
    const { accessToken, refreshToken } = await this.authService.login(user);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      maxAge: this.config.refreshExpiresInDays * 24 * 60 * 60 * 1000,
    });
    return { accessToken };
  }

  @Post('refresh-token')
  async refreshAccessToken(
    @Req() req: RequestWithCookies,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh Token Not Provided');
    }

    const { accessToken, refreshToken: newRefreshToken } =
      await this.authService.refreshAccessToken(refreshToken);

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      maxAge: this.config.refreshExpiresInDays * 24 * 60 * 60 * 1000,
    });
    return { accessToken };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() req: RequestWithCookies, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies?.refreshToken;
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
    });

    if (refreshToken) {
      await this.authService.logout(refreshToken);
    }

    return { message: 'Logged out successfully' };
  }
}
