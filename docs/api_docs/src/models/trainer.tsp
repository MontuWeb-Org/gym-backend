@doc("Trainer profile response")
model TrainerProfileResponse {
  @doc("Trainer ID")
  id: integer;

  @doc("Trainer email")
  email: string;

  @doc("Trainer name")
  name: string;

  @doc("Trainer business name")
  buisnessName: string;

  @doc("Trainer phone number")
  phoneNumber: string;
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
}
