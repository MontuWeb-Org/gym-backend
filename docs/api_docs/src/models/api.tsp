import "@typespec/http";
import "@typespec/openapi3";

using Http;
using TypeSpec.OpenAPI;

namespace App.Models;

// pagination

@doc("Standard query parameters for paginated requests")
model PaginationQueryParams {
  @query
  @doc("The page number to fetch (defaults to 1)")
  page?: integer = 1;

  @query
  @doc("The number of items to return per page (defaults to 10)")
  limit?: integer = 10;
}

@doc("Offset-based pagination metadata returned to the client")
model OffsetPagination {
  @doc("Total number of records matching the query")
  total: integer;

  @doc("The current page number (1-indexed)")
  page: integer;

  @doc("Number of items returned per page")
  limit: integer;

  @doc("Total number of pages available")
  totalPages: integer;
}

// response wrappers

@doc("Standard envelope for single resources or collections")
model ApiDataResponse<T> {
  @doc("The primary data payload")
  data: T;
}

@doc("Standard envelope for paginated collections")
model ApiPaginatedResponse<T> {
  @doc("The paginated data payload")
  data: T;

  @doc("Cursor details for fetching the next page")
  pagination: OffsetPagination;
}

@doc("Response for operations that only return a message")
model ApiMessageResponse<TMessage extends string = string> {
  message: TMessage;
}

model DataResponse<T> {
  ...OkResponse;
  ...Body<ApiDataResponse<T>>;
}

model PaginatedDataResponse<T> {
  ...OkResponse;
  ...Body<ApiPaginatedResponse<T>>;
}

model MessageResponse<TMessage extends string> {
  ...OkResponse;
  ...Body<ApiMessageResponse<TMessage>>;
}

model MessageCreatedResponse<TMessage extends string> {
  ...CreatedResponse;
  ...Body<ApiMessageResponse<TMessage>>;
}
