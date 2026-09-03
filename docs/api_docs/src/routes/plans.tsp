import "@typespec/http";
import "../models/template.tsp";
import "../models/logs.tsp";
import "../models/errors.tsp";
import "../models/api.tsp";

using TypeSpec.Http;

// ── Plan Templates ────────────────────────────────────────────────────────────

@tag("Plan Templates")
@route("/plans/templates")
namespace App.Routes.PlanTemplates {
  @post
  @summary("Create a plan template")
  @doc("Creates a new training plan template for the authenticated trainer.")
  op createPlanTemplate(@body body: App.Models.DataResponse<App.Models.CreatePlanRequest>):
    | App.Models.DataResponse<App.Models.CreateOrDuplicateOrUpdatePlanResponse>
    | App.Models.ValidationErrorResponse
    | App.Models.UnauthorizedResponse
    | App.Models.ForbiddenResponse
    | App.Models.InternalServerErrorResponse;

  @get
  @summary("List plan templates")
  @doc("Returns a paginated list of plan templates owned by the authenticated trainer.")
  op listPlanTemplates(...App.Models.PaginationQueryParams):
    | App.Models.PaginatedDataResponse<App.Models.PlanTemplateBrief>
    | App.Models.UnauthorizedResponse
    | App.Models.ForbiddenResponse
    | App.Models.InternalServerErrorResponse;

  @get
  @route("/{planId}")
  @summary("Get a plan template")
  @doc("Returns the full details of a plan template, including its week and workout structure.")
  op getPlanTemplate(@path planId: integer):
    | App.Models.DataResponse<App.Models.PlanTemplateDetailed>
    | App.Models.UnauthorizedResponse
    | App.Models.ForbiddenResponse
    | App.Models.NotFoundResponse
    | App.Models.InternalServerErrorResponse;

  @put
  @route("/{planId}")
  @summary("Update a plan template")
  @doc("Updates the name, description, or status of an existing plan template.")
  op updatePlanTemplate(
    @path planId: integer,
    @body body: App.Models.DataResponse<App.Models.UpdateOrDuplicatePlanRequest>,
  ):
    | App.Models.DataResponse<App.Models.CreateOrDuplicateOrUpdatePlanResponse>
    | App.Models.ValidationErrorResponse
    | App.Models.UnauthorizedResponse
    | App.Models.ForbiddenResponse
    | App.Models.NotFoundResponse
    | App.Models.InternalServerErrorResponse;

  @delete
  @route("/{planId}")
  @summary("Delete a plan template")
  @doc("Permanently deletes a plan template. Fails if the plan is currently assigned to any trainee.")
  op deletePlanTemplate(@path planId: integer):
    | App.Models.MessageResponse<"Plan template deleted successfully.">
    | App.Models.UnauthorizedResponse
    | App.Models.ForbiddenResponse
    | App.Models.NotFoundResponse
    | App.Models.ConflictResponse
    | App.Models.InternalServerErrorResponse;

  @post
  @route("/duplicate")
  @summary("Duplicate a plan template")
  @doc("Creates a full deep-copy of an existing plan template, including all weeks, workouts, and exercise templates.")
  op duplicatePlanTemplate():
    | App.Models.DataResponse<App.Models.CreateOrDuplicateOrUpdatePlanResponse>
    | App.Models.UnauthorizedResponse
    | App.Models.ForbiddenResponse
    | App.Models.NotFoundResponse
    | App.Models.InternalServerErrorResponse;

  @patch
  @route("/{planId}/favorite")
  @summary("Toggle plan template favorite")
  @doc("Toggles the `isFav` flag on a plan template for the authenticated trainer.")
  op toggleFavoritePlanTemplate(@path planId: integer):
    | App.Models.MessageResponse<"Favorite status updated.">
    | App.Models.UnauthorizedResponse
    | App.Models.ForbiddenResponse
    | App.Models.NotFoundResponse
    | App.Models.InternalServerErrorResponse;
}

// ── Week Templates ────────────────────────────────────────────────────────────

@tag("Week Templates")
@route("/plans/templates/weeks")
namespace App.Routes.WeekTemplates {
  @post
  @summary("Create a week template")
  @doc("Adds a new week to an existing plan template.")
  op createWeekTemplate(@body body: App.Models.DataResponse<App.Models.CreateWeekRequest>):
    | App.Models.DataResponse<App.Models.CreateOrDuplicateOrUpdateWeekResponse>
    | App.Models.ValidationErrorResponse
    | App.Models.UnauthorizedResponse
    | App.Models.ForbiddenResponse
    | App.Models.NotFoundResponse
    | App.Models.InternalServerErrorResponse;

  @get
  @route("/{weekId}")
  @summary("Get a week template")
  @doc("Returns the details of a specific week template, including all its workouts.")
  op getWeekTemplate(@path weekId: integer):
    | App.Models.DataResponse<App.Models.WeekTemplateDetailed>
    | App.Models.UnauthorizedResponse
    | App.Models.ForbiddenResponse
    | App.Models.NotFoundResponse
    | App.Models.InternalServerErrorResponse;

  @put
  @route("/{weekId}")
  @summary("Update a week template")
  @doc("Updates the name or sequence number of an existing week template.")
  op updateWeekTemplate(
    @path weekId: integer,
    @body body: App.Models.DataResponse<App.Models.UpdateOrDuplicateWeekRequest>,
  ):
    | App.Models.DataResponse<App.Models.CreateOrDuplicateOrUpdateWeekResponse>
    | App.Models.ValidationErrorResponse
    | App.Models.UnauthorizedResponse
    | App.Models.ForbiddenResponse
    | App.Models.NotFoundResponse
    | App.Models.InternalServerErrorResponse;

  @delete
  @route("/{weekId}")
  @summary("Delete a week template")
  @doc("Removes a week template and all its associated workouts and exercise templates.")
  op deleteWeekTemplate(@path weekId: integer):
    | App.Models.MessageResponse<"Week template deleted successfully.">
    | App.Models.UnauthorizedResponse
    | App.Models.ForbiddenResponse
    | App.Models.NotFoundResponse
    | App.Models.InternalServerErrorResponse;

  @post
  @route("/{weekId}/duplicate")
  @summary("Duplicate a week template")
  @doc("Creates a deep-copy of a week template (with its workouts and exercise templates) within the same plan.")
  op duplicateWeekTemplate(@path weekId: integer):
    | App.Models.DataResponse<App.Models.CreateOrDuplicateOrUpdateWeekResponse>
    | App.Models.UnauthorizedResponse
    | App.Models.ForbiddenResponse
    | App.Models.NotFoundResponse
    | App.Models.InternalServerErrorResponse;
}

// ── Workout Templates ─────────────────────────────────────────────────────────

@tag("Workout Templates")
@route("/plans/templates/workouts")
namespace App.Routes.WorkoutTemplates {
  @post
  @summary("Create a workout template")
  @doc("Adds a new workout (training day) to an existing week template.")
  op createWorkoutTemplate(@body body: App.Models.DataResponse<App.Models.CreateWorkoutRequest>):
    | App.Models.DataResponse<App.Models.CreateOrDuplicateOrUpdateWorkoutResponse>
    | App.Models.ValidationErrorResponse
    | App.Models.UnauthorizedResponse
    | App.Models.ForbiddenResponse
    | App.Models.NotFoundResponse
    | App.Models.InternalServerErrorResponse;

  @get
  @route("/{workoutId}")
  @summary("Get a workout template")
  @doc("Returns the full details of a workout template, including all exercise templates.")
  op getWorkoutTemplate(@path workoutId: integer):
    | App.Models.DataResponse<App.Models.WorkoutTemplateDetailed>
    | App.Models.UnauthorizedResponse
    | App.Models.ForbiddenResponse
    | App.Models.NotFoundResponse
    | App.Models.InternalServerErrorResponse;

  @put
  @route("/{workoutId}")
  @summary("Update a workout template")
  @doc("Updates the name, sequence number, or duration of an existing workout template.")
  op updateWorkoutTemplate(
    @path workoutId: integer,
    @body body: App.Models.DataResponse<App.Models.UpdateOrDuplicateWorkoutRequest>,
  ):
    | App.Models.DataResponse<App.Models.CreateOrDuplicateOrUpdateWorkoutResponse>
    | App.Models.ValidationErrorResponse
    | App.Models.UnauthorizedResponse
    | App.Models.ForbiddenResponse
    | App.Models.NotFoundResponse
    | App.Models.InternalServerErrorResponse;

  @delete
  @route("/{workoutId}")
  @summary("Delete a workout template")
  @doc("Removes a workout template and all its associated exercise templates.")
  op deleteWorkoutTemplate(@path workoutId: integer):
    | App.Models.MessageResponse<"Workout template deleted successfully.">
    | App.Models.UnauthorizedResponse
    | App.Models.ForbiddenResponse
    | App.Models.NotFoundResponse
    | App.Models.InternalServerErrorResponse;

  @post
  @route("/{workoutId}/duplicate")
  @summary("Duplicate a workout template")
  @doc("Creates a deep-copy of a workout template (with all exercise templates) within the same week.")
  op duplicateWorkoutTemplate(@path workoutId: integer):
    | App.Models.DataResponse<App.Models.CreateOrDuplicateOrUpdateWorkoutResponse>
    | App.Models.UnauthorizedResponse
    | App.Models.ForbiddenResponse
    | App.Models.NotFoundResponse
    | App.Models.InternalServerErrorResponse;
}

// ── Exercise Templates (within Workouts) ──────────────────────────────────────

@tag("Workout Exercise Templates")
@route("/plans/templates/exercises")
namespace App.Routes.WorkoutExerciseTemplates {
  @post
  @summary("Add exercise to workout template")
  @doc("Adds an exercise (with default reps, sets, weight, rest time) to a workout template.")
  op addExerciseToWorkout(
    @body body: App.Models.DataResponse<App.Models.CreateExerciseTemplateRequest>,
  ):
    | App.Models.MessageCreatedResponse<"Exercise added to workout template.">
    | App.Models.ValidationErrorResponse
    | App.Models.UnauthorizedResponse
    | App.Models.ForbiddenResponse
    | App.Models.NotFoundResponse
    | App.Models.InternalServerErrorResponse;

  @put
  @route("/{exerciseTemplateId}")
  @summary("Update an exercise template")
  @doc("Updates the default reps, sets, weight, rest time, or sequence number of an exercise in a workout template.")
  op updateExerciseTemplate(
    @path exerciseTemplateId: integer,
    @body body: App.Models.DataResponse<App.Models.CreateExerciseTemplateRequest>,
  ):
    | App.Models.MessageResponse<"Exercise template updated successfully.">
    | App.Models.ValidationErrorResponse
    | App.Models.UnauthorizedResponse
    | App.Models.ForbiddenResponse
    | App.Models.NotFoundResponse
    | App.Models.InternalServerErrorResponse;

  @delete
  @route("/{exerciseTemplateId}")
  @summary("Remove exercise from workout template")
  @doc("Removes an exercise template from a workout template.")
  op removeExerciseFromWorkout(@path exerciseTemplateId: integer):
    | App.Models.MessageResponse<"Exercise removed from workout template.">
    | App.Models.UnauthorizedResponse
    | App.Models.ForbiddenResponse
    | App.Models.NotFoundResponse
    | App.Models.InternalServerErrorResponse;
}

// ── Plan Assignments ──────────────────────────────────────────────────────────

@tag("Plan Assignments")
@route("/plans/assignments")
namespace App.Routes.PlanAssignments {
  @post
  @summary("Assign a plan to a trainee")
  @doc("Assigns an existing plan template to a trainee, creating a new PlanAssignment record. The trainer must own the plan template and the trainee.")
  op createPlanAssignment(
    @body body: App.Models.DataResponse<App.Models.CreatePlanAssignmentRequest>,
  ):
    | App.Models.DataResponse<App.Models.CreatePlanAssignmentResponse>
    | App.Models.ValidationErrorResponse
    | App.Models.UnauthorizedResponse
    | App.Models.ForbiddenResponse
    | App.Models.NotFoundResponse
    | App.Models.ConflictResponse
    | App.Models.InternalServerErrorResponse;

  @get
  @route("/{assignmentId}")
  @summary("Get a plan assignment")
  @doc("Returns the full state of a plan assignment, including the current week/workout index and the complete plan template structure. Accessible by both the assigned trainee and their trainer.")
  op getPlanAssignment(@path assignmentId: integer):
    | App.Models.DataResponse<App.Models.GetPlanAssignmentResponse>
    | App.Models.UnauthorizedResponse
    | App.Models.ForbiddenResponse
    | App.Models.NotFoundResponse
    | App.Models.InternalServerErrorResponse;

  @delete
  @route("/{assignmentId}")
  @summary("Remove a plan assignment")
  @doc("Removes an active plan assignment from a trainee. Only the owning trainer can perform this action.")
  op deletePlanAssignment(@path assignmentId: integer):
    | App.Models.MessageResponse<"Plan assignment removed successfully.">
    | App.Models.UnauthorizedResponse
    | App.Models.ForbiddenResponse
    | App.Models.NotFoundResponse
    | App.Models.InternalServerErrorResponse;

  @put
  @route("/{assignmentId}/overrides")
  @summary("Apply exercise overrides for a plan assignment")
  @doc("Applies trainer-defined overrides (custom weight, sets, reps, rest time) to one or more exercises within a specific plan assignment, tailoring defaults for an individual trainee.")
  op applyExerciseOverrides(
    @path assignmentId: integer,
    @body body: App.Models.DataResponse<App.Models.ExerciseOverrideRequest>,
  ):
    | App.Models.MessageResponse<"Exercise overrides applied successfully.">
    | App.Models.ValidationErrorResponse
    | App.Models.UnauthorizedResponse
    | App.Models.ForbiddenResponse
    | App.Models.NotFoundResponse
    | App.Models.InternalServerErrorResponse;
}
