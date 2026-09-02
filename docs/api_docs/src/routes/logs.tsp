import "@typespec/http";
import "../models/logs.tsp";
import "../models/errors.tsp";
import "../models/api.tsp";

using TypeSpec.Http;

@tag("Logs")
@route("/logs")
namespace App.Routes.Logs {
  // ── Workout Logs ─────────────────────────────────────────────────────────────

  @post
  @route("/workouts")
  @summary("Start a workout log")
  @doc("Creates a new workout log for the authenticated trainee, marking the beginning of a workout session. If the session was completed offline, supply `endedAt` in the request body.")
  op createWorkoutLog(@body body: App.Models.DataResponse<App.Models.CreateWorkoutLogRequest>):
    | App.Models.DataResponse<App.Models.CreateWorkoutLogResponse>
    | App.Models.ValidationErrorResponse
    | App.Models.UnauthorizedResponse
    | App.Models.NotFoundResponse
    | App.Models.InternalServerErrorResponse;

  @get
  @route("/workouts/{workoutLogId}")
  @summary("Get a workout log")
  @doc("Returns the details of a specific workout log, including all exercise logs and set logs within it.")
  op getWorkoutLog(@path workoutLogId: integer):
    | App.Models.DataResponse<App.Models.GetWorkoutLogResponse>
    | App.Models.UnauthorizedResponse
    | App.Models.ForbiddenResponse
    | App.Models.NotFoundResponse
    | App.Models.InternalServerErrorResponse;

  @patch
  @route("/workouts/{workoutLogId}/complete")
  @summary("Complete a workout log")
  @doc("Marks an in-progress workout log as COMPLETED, recording the end time.")
  op completeWorkoutLog(@path workoutLogId: integer):
    | App.Models.MessageResponse<"Workout completed successfully.">
    | App.Models.UnauthorizedResponse
    | App.Models.ForbiddenResponse
    | App.Models.NotFoundResponse
    | App.Models.BadRequestResponse
    | App.Models.InternalServerErrorResponse;

  @patch
  @route("/workouts/{workoutLogId}/abandon")
  @summary("Abandon a workout log")
  @doc("Marks an in-progress workout log as ABANDONED.")
  op abandonWorkoutLog(@path workoutLogId: integer):
    | App.Models.MessageResponse<"Workout abandoned.">
    | App.Models.UnauthorizedResponse
    | App.Models.ForbiddenResponse
    | App.Models.NotFoundResponse
    | App.Models.BadRequestResponse
    | App.Models.InternalServerErrorResponse;

  // ── Exercise Logs ─────────────────────────────────────────────────────────────

  @post
  @route("/exercises")
  @summary("Log a completed exercise")
  @doc("Creates an exercise log (with set logs) for a specific exercise performed within a workout session.")
  op createExerciseLog(@body body: App.Models.DataResponse<App.Models.CreateExerciseLogRequest>):
    | App.Models.DataResponse<App.Models.CreateExerciseLogResponse>
    | App.Models.ValidationErrorResponse
    | App.Models.UnauthorizedResponse
    | App.Models.NotFoundResponse
    | App.Models.InternalServerErrorResponse;

  @get
  @route("/exercises/{exerciseLogId}")
  @summary("Get an exercise log")
  @doc("Returns the details of a specific exercise log, including all individual set logs.")
  op getExerciseLog(@path exerciseLogId: integer):
    | App.Models.DataResponse<App.Models.ExerciseLogDetailed>
    | App.Models.UnauthorizedResponse
    | App.Models.ForbiddenResponse
    | App.Models.NotFoundResponse
    | App.Models.InternalServerErrorResponse;
}
