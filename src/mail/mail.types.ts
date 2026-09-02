export interface TraineeInvitePayload {
  to: string;
  trainerName: string;
  inviteUrl: string;
}

export interface OtpEmailPayload {
  to: string;
  otp: string;
  expiresInMinutes: number;
}
