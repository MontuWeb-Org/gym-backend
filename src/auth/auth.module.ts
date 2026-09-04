import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '@/user/user.module';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from '@/jwt/jwt.config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy, LocalStrategy } from './strategies';
import { JwtAuthGuard, LocalAuthGuard } from './guards/auth.guard';
import { JwtModule } from '@/jwt/jwt.module';
import { RefreshTokenModule } from '@/refresh-token/refresh-token.module';
import { MailModule } from '@/mail/mail.module';
import { OtpModule } from '@/otp/otp.module';
import { TrainerRegisterService } from './trainer-register.service';
import { TrainerRegisterRepository } from './trainer-register.repository';
import { TraineeInviteService } from './trainee-invite.service';
import { TraineeInviteRepository } from './trainee-invite.repository';

@Module({
  imports: [
    UserModule,
    RefreshTokenModule,
    MailModule,
    OtpModule,
    ConfigModule.forFeature(jwtConfig),
    JwtModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    LocalStrategy,
    LocalAuthGuard,
    JwtAuthGuard,
    TrainerRegisterService,
    TrainerRegisterRepository,
    TraineeInviteService,
    TraineeInviteRepository,
  ],
})
export class AuthModule {}
