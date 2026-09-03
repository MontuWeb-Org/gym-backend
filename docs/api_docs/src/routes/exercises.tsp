import "@typespec/http";
import "../models/exercise.tsp";
import "../models/errors.tsp";
import "../models/api.tsp";

using TypeSpec.Http;

@tag("Exercises")
@route("/exercises")
namespace App.Routes.Exercises {
  @get
  @summary("List exercises")
  @doc("Returns a paginated list of all exercises in the library. Accessible by both trainers and trainees.")
  op listExercises(...App.Models.PaginationQueryParams):
    | App.Models.PaginatedDataResponse<App.Models.ExerciseInfoListResponse>
    | App.Models.UnauthorizedResponse
    | App.Models.InternalServerErrorResponse;

  @get
  @route("/{exerciseId}")
  @summary("Get exercise details")
  @doc("Returns detailed information about a specific exercise, including muscles targeted and equipment required.")
  op getExercise(@path exerciseId: integer):
    | App.Models.DataResponse<App.Models.Exercise>
    | App.Models.UnauthorizedResponse
    | App.Models.NotFoundResponse
    | App.Models.InternalServerErrorResponse;

  @post
  @summary("Create an exercise")
  @doc("Creates a new exercise in the global library. Typically restricted to admin or privileged trainers.")
  op createExercise(@body body: App.Models.DataResponse<App.Models.CreateExerciseRequest>):
    | App.Models.MessageCreatedResponse<"Exercise created successfully.">
    | App.Models.ValidationErrorResponse
    | App.Models.UnauthorizedResponse
    | App.Models.ForbiddenResponse
    | App.Models.ConflictResponse
    | App.Models.InternalServerErrorResponse;

  @put
  @route("/{exerciseId}")
  @summary("Update an exercise")
  @doc("Updates an existing exercise in the library.")
  op updateExercise(
    @path exerciseId: integer,
    @body body: App.Models.DataResponse<App.Models.CreateExerciseRequest>,
  ):
    | App.Models.MessageResponse<"Exercise updated successfully.">
    | App.Models.ValidationErrorResponse
    | App.Models.UnauthorizedResponse
    | App.Models.ForbiddenResponse
    | App.Models.NotFoundResponse
    | App.Models.InternalServerErrorResponse;

  @delete
  @route("/{exerciseId}")
  @summary("Delete an exercise")
  @doc("Deletes an exercise from the library. Fails if the exercise is still referenced by any workout templates.")
  op deleteExercise(@path exerciseId: integer):
    | App.Models.MessageResponse<"Exercise deleted successfully.">
    | App.Models.UnauthorizedResponse
    | App.Models.ForbiddenResponse
    | App.Models.NotFoundResponse
    | App.Models.ConflictResponse
    | App.Models.InternalServerErrorResponse;
}
