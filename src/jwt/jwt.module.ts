import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from './jwt.service';
import jwtConfig from './jwt.config';

@Module({
  imports: [ConfigModule.forFeature(jwtConfig)],
  providers: [JwtService],
  exports: [JwtService],
})
export class JwtModule {}
