import "@typespec/http";
import "../models/auth.tsp";

using TypeSpec.Http;

@tag("Auth")
@route("/api/auth")
namespace App.Routes.Auth {
  @post
  @route("/register/coach/init")
  @summary("Register a new coach")
  @doc("This endpoint is used to register a new coach. It will return a creation token that will be used to complete the registration process.")
  op registerCoachInit(@body body: App.Models.CoachRegisterInitRequest):
    | App.Models.CoachRegisterInitResponse
    | {
        @statusCode _: 404;
      };

  @post
  @route("/register/coach/complete")
  @summary("Complete registration of a new coach")
  @doc("Complete registration of a new coach")
  op registerCoachComplete(@body body: App.Models.CoachRegisterCompleteRequest):
    | App.Models.AuthResponse
    | {
        @statusCode _: 404;
      };
}
