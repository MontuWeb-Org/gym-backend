import "@typespec/http";
using Http;

namespace App.Models;

@doc("Update profile request — fields accepted for both trainers and trainees")
model UpdateProfileRequest {
  @doc("Display name")
  name?: string;

  @doc("Phone number")
  phoneNumber?: string;

  @doc("Trainer bio (trainer only)")
  bio?: string;

  @doc("Trainer years of experience (trainer only)")
  experience?: string;

  @doc("Trainee date of birth (trainee only)")
  birthDate?: utcDateTime;

  @doc("Trainee gender (trainee only)")
  gender?: Gender;

  @doc("Trainee body metrics JSON blob (trainee only)")
  bodyMetrics?: unknown;
}

@doc("Trainer profile response")
model TrainerProfileResponse {
  @doc("Trainer ID")
  id: integer;

  @doc("Trainer email")
  email: string;

  @doc("Trainer name")
  name: string;

  @doc("Trainer bio")
  bio: string;

  @doc("Trainer experience")
  experience: string;

  @doc("Trainer phone number")
  phoneNumber: string;
}

@doc("Trainee profile response")
model TraineeProfileResponse {
  @doc("Trainee ID")
  id: integer;

  @doc("Trainee email")
  email: string;

  @doc("Trainee name")
  name: string;

  @doc("Trainee birthDate")
  birthDate: utcDateTime;

  @doc("Trainee gender")
  gender: Gender;

  @doc("Trainee phone number")
  phoneNumber: string;

  @doc("Trainee body metrics")
  bodyMetrics: unknown;

  @doc("Trainee Trainer")
  trainer: TrainerProfileResponse;
}

enum Gender {
  Male,
  Female,
}

model TrainerDashboardResponse {}

model TraineesListResponse {
  @doc("Trainees list")
  trainees: TraineeInfo[];
}

model TraineeDetailedInfo {
  @doc("Trainee ID")
  id: integer;

  @doc("Trainee name")
  name: string;

  @doc("Trainee adherence")
  adherence: integer;

  @doc("Trainee program name")
  programName: string;

  @doc("Trainee last session date")
  lastSessionDate: utcDateTime;

  @doc("Trainee status")
  status: TraineeInfoStatus;

  @doc("Trainee Date joined trainer")
  joinedAt: utcDateTime;

  @doc("Trainee Date Joined program")
  programJoinedAt: utcDateTime;
}

model TraineeInfo {
  @doc("Trainee ID")
  id: integer;

  @doc("Trainee name")
  name: string;

  @doc("Trainee adherence")
  adherence: integer;

  @doc("Trainee program name")
  programName: string;

  @doc("Trainee last session date")
  lastSessionDate: utcDateTime;

  @doc("Trainee status")
  status: TraineeInfoStatus;
}

enum TraineeInfoStatus {
  @doc("Trainee is on track")
  ON_TRACK,

  @doc("Trainee is at risk")
  AT_RISK,

  @doc("Trainee invitation is pending")
  INVITE_PENDING,

  @doc("Trainee is falling behind")
  FALLING_BEHIND,

  @doc("Trainee needs a plan")
  NEEDS_PLAN,
}

model TrainerQuotaResponse {
  @doc("Trainer quota")
  maxTrainees: integer;

  @doc("Trainer current trainees")
  currentTrainees: integer;

  @doc("Trainer renewal date")
  renewalDate: utcDateTime;

  @doc("Trainer subscription price")
  price: decimal;

  @doc("Trainer history")
  history: {
    @doc("status")
    status: TrainerSubscriptionPlanStatus;

    @doc("created at")
    createdAt: utcDateTime;
  }[];
}

enum TrainerSubscriptionPlanStatus {
  PAID,
  NOT_PAID,
}
