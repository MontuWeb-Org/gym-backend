import "./exercise.tsp";

namespace App.Models;

// ── Exercise Template ─────────────────────────────────────────────────────────

@doc("Request to add or update an exercise within a workout template")
model CreateExerciseTemplateRequest {
  exerciseId: integer;
  workoutTemplateId: integer;
  sequenceNumber: integer;
  defaultReps: string;
  defaultSets: integer;
  defaultRestTimeSeconds: integer;
  defaultDurationMinutes: integer;
  defaultWeight: decimal;
}

// ── Workout Template ──────────────────────────────────────────────────────────

@doc("Request to create a workout template")
model CreateWorkoutRequest {
  name: string;
  sequenceNumber: integer;
  weekTemplateId: integer;
  durationMinutes: integer;
}

model UpdateOrDuplicateWorkoutRequest {
  ...CreateWorkoutLogRequest;
  workoutId: integer;
}

model CreateOrDuplicateOrUpdateWorkoutResponse {
  workoutTemplateId: integer;
}

// ── Week Template ─────────────────────────────────────────────────────────────

@doc("Request to create, duplicate, or update a week template")
model CreateWeekRequest {
  name: string;
  sequenceNumber: integer;
  planTemplateId: integer;
}

model UpdateOrDuplicateWeekRequest {
  ...CreateWeekRequest;
  weekId: integer;
}

model CreateOrDuplicateOrUpdateWeekResponse {
  weekId: integer;
}

// ── Plan Template ─────────────────────────────────────────────────────────────

@doc("Request to create a plan template")
model CreatePlanRequest {
  name: string;
  description: string;
}

model UpdateOrDuplicatePlanRequest {
  ...CreatePlanRequest;
  planId: integer;
}

model CreateOrDuplicateOrUpdatePlanResponse {
  planId: integer;
}

enum PlanTemplateStatus {
  DRAFT,
  ACTIVE,
}

model PlanTemplateBrief {
  id: integer;
  name: string;
  description: string;
  status: PlanTemplateStatus;
  durationWeekTemplates: integer;
  isFav: boolean;
}

model PlanTemplateDetailed {
  ...PlanTemplateBrief;
  weeks: WeekTemplateBrief[];
}

model WeekTemplateBrief {
  id: integer;
  name: string;
  sequenceNumber: integer;
  durationMinutes: integer;
  workoutTemplateCount: integer;
}

model WeekTemplateDetailed {
  ...WeekTemplateBrief;
  workouts: WorkoutTemplateBrief[];
}

model WorkoutTemplateDetailed {
  ...WorkoutTemplateBrief;
  exercises: ExerciseTemplate[];
}

model WorkoutTemplateBrief {
  id: integer;
  name: string;
  sequenceNumber: integer;
  weekTemplateId: integer;
  durationMinutes: integer;
  exerciseTemplateCount: integer;
}

model ExerciseTemplate {
  id: integer;
  exercise: Exercise;
  workoutTemplateId: integer;
  sequenceNumber: integer;
  defaultReps: string;
  defaultSets: integer;
  defaultRestTimeSeconds: integer;
  defaultDurationMinutes: integer;
  defaultWeight: decimal;
}
