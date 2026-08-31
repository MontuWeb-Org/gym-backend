namespace App.Models;

model CoachRegisterInitRequest {
  name: string;
  phoneNumber: string;
  email: string;
  password: string;
  confirmPassword: string;
}

model CoachRegisterInitResponse {
  creationToken: string;
}

model CoachRegisterCompleteRequest {
  otp: string;
  creationToken: string;
}

model AuthResponse {
  accessToken: string;
}

model TraineeRegisterInitRequest {
  email: string;
}

model TraineeRegisterCompleteReqeust {
  creationToken: string;
  name: string;
  password: string;
  confirmPassword: string;
}

model ForgetPasswordInitRequest {
  email: string;
}

model ForgetPasswordInitResponse {
  creationToken: string;
}

model ForgetPasswordCompleteRequest {
  otp: string;
  creationToken: string;
  newPassword: string;
  confirmNewPassword: string;
}

model ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

model ChangePasswordResponse {}

model LoginRequest {
  identifier: string;
  password: string;
}
