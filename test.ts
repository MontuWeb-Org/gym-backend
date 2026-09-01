import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { OtpService } from './src/otp/otp.service';

async function testOtp() {
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    const otpService = app.get(OtpService);

    const otp = otpService.generate();

    console.log('Generated OTP:', otp);

    const hash = await otpService.hash(otp);

    console.log('Hash:', hash);

    const valid = await otpService.verify(otp, hash);

    console.log('Correct OTP:', valid);

    const invalid = await otpService.verify('000000', hash);

    console.log('Wrong OTP:', invalid);
  } finally {
    await app.close();
  }
}

testOtp();
