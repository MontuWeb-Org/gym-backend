import "@typespec/http";
import "../models/user.tsp";
import "../models/errors.tsp";
import "../models/api.tsp";

using TypeSpec.Http;

@tag("User")
@route("/users")
namespace App.Routes.User {
  @get
  @route("/me")
  @summary("Get current user profile")
  @doc("Returns the authenticated user's profile. For trainers this returns TrainerProfileResponse; for trainees, TraineeProfileResponse.")
  op getMe():
    | App.Models.DataResponse<App.Models.TrainerProfileResponse>
    | App.Models.UnauthorizedResponse
    | App.Models.NotFoundResponse
    | App.Models.InternalServerErrorResponse;

  @put
  @route("/me")
  @summary("Update current user profile")
  @doc("Updates the authenticated user's profile information (name, bio, phone number, etc.).")
  op updateMe(@body body: App.Models.DataResponse<App.Models.UpdateProfileRequest>):
    | App.Models.MessageResponse<"Profile updated successfully.">
    | App.Models.ValidationErrorResponse
    | App.Models.UnauthorizedResponse
    | App.Models.NotFoundResponse
    | App.Models.InternalServerErrorResponse;

  // ── Trainer-specific ────────────────────────────────────────────────────────

  @get
  @route("/trainer/dashboard")
  @summary("Get trainer dashboard")
  @doc("Returns a summary overview for the authenticated trainer's dashboard.")
  op getTrainerDashboard():
    | App.Models.DataResponse<App.Models.TrainerDashboardResponse>
    | App.Models.UnauthorizedResponse
    | App.Models.ForbiddenResponse
    | App.Models.InternalServerErrorResponse;

  @get
  @route("/trainer/trainees")
  @summary("List trainer's trainees")
  @doc("Returns a paginated list of trainees assigned to the authenticated trainer.")
  op getTrainees(...App.Models.PaginationQueryParams):
    | App.Models.PaginatedDataResponse<App.Models.TraineesListResponse>
    | App.Models.UnauthorizedResponse
    | App.Models.ForbiddenResponse
    | App.Models.InternalServerErrorResponse;

  @get
  @route("/trainer/trainees/{traineeId}")
  @summary("Get detailed trainee info")
  @doc("Returns detailed information about a specific trainee belonging to the authenticated trainer.")
  op getTrainee(@path traineeId: integer):
    | App.Models.DataResponse<App.Models.TraineeDetailedInfo>
    | App.Models.UnauthorizedResponse
    | App.Models.ForbiddenResponse
    | App.Models.NotFoundResponse
    | App.Models.InternalServerErrorResponse;

  @delete
  @route("/trainer/trainees/{traineeId}")
  @summary("Remove a trainee")
  @doc("Removes a trainee from the authenticated trainer's roster.")
  op removeTrainee(@path traineeId: integer):
    | App.Models.MessageResponse<"Trainee removed successfully.">
    | App.Models.UnauthorizedResponse
    | App.Models.ForbiddenResponse
    | App.Models.NotFoundResponse
    | App.Models.InternalServerErrorResponse;

  @get
  @route("/trainer/quota")
  @summary("Get trainer subscription quota")
  @doc("Returns the authenticated trainer's subscription plan details including max trainees, renewal date, and payment history.")
  op getTrainerQuota():
    | App.Models.DataResponse<App.Models.TrainerQuotaResponse>
    | App.Models.UnauthorizedResponse
    | App.Models.ForbiddenResponse
    | App.Models.NotFoundResponse
    | App.Models.InternalServerErrorResponse;
}
