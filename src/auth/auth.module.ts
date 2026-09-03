import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '@/user/user.module';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from '@/jwt/jwt.config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy, LocalStrategy } from './strategies';
import { JwtAuthGuard, LocalAuthGuard } from './guards';
import { JwtModule } from '@/jwt/jwt.module';
import { RefreshTokenModule } from '@/refresh-token/refresh-token.module';
import refreshTokenConfig from '@/refresh-token/refresh-token.config';

@Module({
  imports: [
    UserModule,
    RefreshTokenModule,
    ConfigModule.forFeature(jwtConfig),
    ConfigModule.forFeature(refreshTokenConfig),
    JwtModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, LocalStrategy, LocalAuthGuard, JwtAuthGuard],
})
export class AuthModule {}
