import "@typespec/http";
import "../models/auth.tsp";
import "../models/errors.tsp";
import "../models/api.tsp";

using TypeSpec.Http;

@tag("Auth")
@route("/auth")
@useAuth(NoAuth)
namespace App.Routes.Auth {
  @post
  @route("/register/init")
  @summary("Register a new trainer")
  @doc("This endpoint is used to register a new trainer. It will return a creation token that will be used to complete the registration process.")
  op registerTrainerInit(
    @body body: App.Models.DataResponse<App.Models.TrainerRegisterInitRequest>,
  ):
    | App.Models.DataResponse<App.Models.TrainerRegisterInitResponse>
    | App.Models.ValidationErrorResponse
    | App.Models.ConflictResponse
    | App.Models.InternalServerErrorResponse;

  @post
  @route("/register/complete")
  @summary("Complete registration of a new trainer")
  @doc("Complete registration of a new trainer")
  op registerTrainerComplete(
    @body body: App.Models.DataResponse<App.Models.TrainerRegisterCompleteRequest>,
  ):
    | (App.Models.DataResponse<App.Models.AuthResponse> & App.Models.SetAuthCookieResponse)
    | App.Models.ValidationErrorResponse
    | App.Models.BadRequestResponse
    | App.Models.InternalServerErrorResponse;

  // trainee invitation
  @post
  @route("/invite/init")
  @summary("Initialize trainee registration")
  @doc("Initialize trainee registration")
  op inviteInit(@body body: App.Models.DataResponse<App.Models.InviteInitRequest>):
    | App.Models.MessageCreatedResponse<"Trainee registration initialized successfully.">
    | App.Models.ValidationErrorResponse
    | App.Models.InternalServerErrorResponse;

  @get
  @route("/invite/verify/{token}")
  @summary("Verify trainee registration")
  @doc("Verify trainee registration")
  op inviteVerify(@path token: string):
    | App.Models.DataResponse<App.Models.InviteVerifyResponse>
    | App.Models.NotFoundResponse
    | App.Models.InternalServerErrorResponse;

  @post
  @route("/invite/accept")
  @summary("Accept trainee registration")
  @doc("Accept trainee registration")
  op inviteAccept(@body body: App.Models.DataResponse<App.Models.InviteAcceptRequest>):
    | (App.Models.DataResponse<App.Models.AuthResponse> & App.Models.SetAuthCookieResponse)
    | App.Models.MessageResponse<"Trainee registration rejected.">
    | App.Models.NotFoundResponse
    | App.Models.ValidationErrorResponse
    | App.Models.InternalServerErrorResponse;

  @post
  @route("/invite/setup")
  @summary("Setup trainee registration")
  @doc("Setup trainee registration")
  op inviteSetup(@body body: App.Models.DataResponse<App.Models.InviteSetupPasswordRequest>):
    | (App.Models.DataResponse<App.Models.AuthResponse> & App.Models.SetAuthCookieResponse)
    | App.Models.ValidationErrorResponse
    | App.Models.NotFoundResponse
    | App.Models.InternalServerErrorResponse;

  @post
  @route("/login")
  @summary("Login")
  @doc("Login")
  op login(@body body: App.Models.DataResponse<App.Models.LoginRequest>):
    | (App.Models.DataResponse<App.Models.AuthResponse> & App.Models.SetAuthCookieResponse)
    | App.Models.ValidationErrorResponse
    | App.Models.NotFoundResponse
    | App.Models.InternalServerErrorResponse;

  @post
  @route("/logout")
  @summary("Logout")
  @doc("Logout")
  @useAuth(App.Models.BearerAuth)
  op logout():
    | App.Models.MessageResponse<"Logout successfully.">
    | App.Models.InternalServerErrorResponse;

  @post
  @route("/refresh")
  @summary("Refresh authentication token")
  @doc("Refresh authentication token")
  @useAuth(App.Models.BearerAuth)
  op refresh():
    | (App.Models.DataResponse<App.Models.AuthResponse> & App.Models.SetAuthCookieResponse)
    | App.Models.NotFoundResponse
    | App.Models.InternalServerErrorResponse;

  @post
  @route("/forgot/init")
  @summary("Initialize forgot password")
  @doc("Initialize forgot password")
  op forgetPasswordInit(@body body: App.Models.DataResponse<App.Models.ForgetPasswordInitRequest>):
    | App.Models.DataResponse<App.Models.ForgetPasswordInitResponse>
    | App.Models.ValidationErrorResponse
    | App.Models.NotFoundResponse
    | App.Models.InternalServerErrorResponse;

  @post
  @route("/forgot/complete")
  @summary("Complete forgot password")
  @doc("Complete forgot password")
  op forgetPasswordComplete(
    @body body: App.Models.DataResponse<App.Models.ForgetPasswordCompleteRequest>,
  ):
    | (App.Models.DataResponse<App.Models.AuthResponse> & App.Models.SetAuthCookieResponse)
    | App.Models.ValidationErrorResponse
    | App.Models.NotFoundResponse
    | App.Models.InternalServerErrorResponse;

  @post
  @route("/password/change")
  @summary("Change password")
  @doc("Change password")
  @useAuth(App.Models.BearerAuth)
  op changePassword(@body body: App.Models.DataResponse<App.Models.ChangePasswordRequest>):
    | App.Models.MessageCreatedResponse<"Password changed successfully.">
    | App.Models.ValidationErrorResponse
    | App.Models.NotFoundResponse
    | App.Models.InternalServerErrorResponse;
}
