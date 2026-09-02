import "@typespec/http";
import "@typespec/openapi3";

using Http;
using TypeSpec.OpenAPI;

namespace App.Models;

@doc("Standardized error response payload")
model ApiErrorResponse {
  @doc("Machine-readable error code (e.g., 'VALIDATION_FAILED', 'NOT_FOUND')")
  code: string;

  @doc("Human-readable error message")
  message: string;

  @doc("Optional details, such as field-specific validation errors")
  details?: ValidationErrors[];

  path?: string;
  timestamp?: utcDateTime;
}

model ValidationErrors {
  field: string;
  message: string;
}

@doc("Standard 400 Bad Request response")
model BadRequestResponse {
  ...Response<400>;
  ...Body<ApiErrorResponse>;
}

@doc("Standard 401 Unauthorized response")
model UnauthorizedResponse {
  ...Response<401>;
  ...Body<ApiErrorResponse>;
}

@doc("standard 410 Gone response")
model GoneResponse {
  ...Response<410>;
  ...Body<ApiErrorResponse>;
}

@doc("Standard 403 Forbidden response")
model ForbiddenResponse {
  ...Response<403>;
  ...Body<ApiErrorResponse>;
}

@doc("Standard 404 Not Found response")
model NotFoundResponse {
  ...Response<404>;
  ...Body<ApiErrorResponse>;
}

@doc("Standard 409 Conflict response")
model ConflictResponse {
  ...Response<409>;
  ...Body<ApiErrorResponse>;
}

@doc("Standard 422 Validation Error response")
model ValidationErrorResponse {
  ...Response<422>;
  ...Body<ApiErrorResponse>;
}

@doc("Standard 429 Rate Limit Exceeded response")
model RateLimitResponse {
  ...Response<429>;
  ...Body<ApiErrorResponse>;
}

@doc("Standard 500 Internal Server Error response")
model InternalServerErrorResponse {
  ...Response<500>;
  ...Body<ApiErrorResponse>;
}
