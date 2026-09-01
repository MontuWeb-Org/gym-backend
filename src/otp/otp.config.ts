import { registerAs } from '@nestjs/config';

export default registerAs('otp', () => ({
  length: Number(process.env.OTP_LENGTH ?? 6),
  saltRounds: Number(process.env.OTP_SALT_ROUNDS ?? 10),
}));