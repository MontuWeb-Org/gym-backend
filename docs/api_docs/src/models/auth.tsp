import "@typespec/http";

using Http;
namespace App.Models;

@doc("JWT bearer token authentication")
model BearerAuth {
  type: "http";
  scheme: "bearer";
  bearerFormat: "JWT";
}

model SetAuthCookieResponse {
  @header("Set-Cookie")
  @doc("Contains the HTTP-only refresh token cookie for web clients.")
  setCookie: string;
}

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

model InviteInitRequest {
  email: string;
}

enum TraineeStatus {
  SETUP_PASSWORD,
  ACCEPT_INVITATION,
}
model InviteVerifyResponse {
  creationToken: string;
  coachName: string;
  status: TraineeStatus;
}

model InviteSetupPasswordRequest {
  creationToken: string;
  name: string;
  password: string;
  confirmPassword: string;
}

model InviteAcceptRequest {
  creationToken: string;
  accept: boolean;
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

model LoginRequest {
  identifier: string;
  password: string;
}
