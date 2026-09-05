import { registerAs } from '@nestjs/config';

export default registerAs('otp', () => ({
  length: Number(process.env.OTP_LENGTH ?? 6),
  saltRounds: Number(process.env.OTP_SALT_ROUNDS ?? 10),
  expiresInMinutes: Number(process.env.OTP_EXPIRES_IN_MINUTES ?? 5),
}));