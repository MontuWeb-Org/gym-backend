import { Module } from '@nestjs/common';
import { RefreshTokenService } from './refresh-token.service';
import { RefreshTokenController } from './refresh-token.controller';
import { RefreshTokenRepository } from './refresh-token.repository';
import { ConfigModule } from '@nestjs/config';
import refreshTokenConfig from './refresh-token.config';

@Module({
  imports: [ConfigModule.forFeature(refreshTokenConfig)],
  controllers: [RefreshTokenController],
  providers: [RefreshTokenService, RefreshTokenRepository],
  exports: [RefreshTokenService],
})
export class RefreshTokenModule {}
