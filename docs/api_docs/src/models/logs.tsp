import "./template.tsp";

namespace App.Models;

// ── Set Log ───────────────────────────────────────────────────────────────────

model SetLog {
  reps: string;
  weight: decimal;
  createdAt: utcDateTime;
  endedAt: utcDateTime;
}

// ── Exercise Log ──────────────────────────────────────────────────────────────

@doc("Request to log a completed exercise within a workout session")
model CreateExerciseLogRequest {
  workoutLogId: integer;
  workoutExerciseTemplateId: integer;
  sets: SetLog[];
  createdAt: utcDateTime;
  endedAt: utcDateTime;
}

model CreateExerciseLogResponse {
  exerciseLogId: integer;
}

// ── Workout Log ───────────────────────────────────────────────────────────────

@doc("Request to start (or retroactively record) a workout session")
model CreateWorkoutLogRequest {
  planAssignmentId: integer;
  workoutTemplateId: integer;
  createdAt: utcDateTime;

  @doc("Supply endedAt when logging an offline session that has already completed")
  endedAt?: utcDateTime;
}

model CreateWorkoutLogResponse {
  workoutLogId: integer;
}

// ── Plan Assignment ───────────────────────────────────────────────────────────

@doc("Request to assign a plan template to a trainee")
model CreatePlanAssignmentRequest {
  planTemplateId: integer;
  traineeId: integer;
  createdAt: utcDateTime;
  endedAt: utcDateTime;
}

model CreatePlanAssignmentResponse {
  planAssignmentId: integer;
}

enum PlanAssignmentStatus {
  IDLE,
  ACTIVE,
  COMPLETED,
}

model GetPlanAssignmentResponse {
  currentWeekIdx: integer;
  currentWorkoutIdx: integer;
  status: PlanAssignmentStatus;
  traineeId: integer;
  planTemplate: {
    ...PlanTemplateBrief;
    weeks: WeekTemplateDetailed[];
  };
}

// ── Workout Log Detailed ──────────────────────────────────────────────────────

model GetWorkoutLogResponse {
  id: integer;
  planAssignmentId: integer;
  workoutTemplateId: integer;
  durationMinutes: integer;
  status: WorkoutLogStatus;
  exerciseLogs: ExerciseLogDetailed[];
}

enum WorkoutLogStatus {
  COMPLETED,
  ABANDONED,
}

model SetLogDetailed {
  id: integer;
  exerciseLogId: integer;
  reps: string;
  weight: decimal;
  durationSeconds: integer;
}

model ExerciseLogDetailed {
  id: integer;
  exerciseName: string;
  workoutExerciseTemplateId: integer;
  expectedSets: integer;
  expectedReps: string;
  expectedWeight: decimal;
  setLogs: SetLogDetailed[];
  durationSeconds: integer;
}

// ── Exercise Override ─────────────────────────────────────────────────────────

@doc("Request to apply trainer-defined overrides to one or more exercises within a plan assignment")
model ExerciseOverrideRequest {
  overrides: ExerciseOverride[];
}

model ExerciseOverride {
  @doc("The WorkoutExerciseTemplate to override")
  workoutExerciseTemplateId: integer;

  @doc("Override target weight (optional)")
  weight?: decimal;

  @doc("Override number of sets (optional)")
  sets?: integer;

  @doc("Override reps string, e.g. '8-12' (optional)")
  reps?: string;

  @doc("Override rest time in seconds (optional)")
  restSeconds?: integer;
}
