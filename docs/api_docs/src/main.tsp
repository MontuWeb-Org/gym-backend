import "@typespec/http";
import "@typespec/openapi";
import "@typespec/openapi3";

// Import your route modules here.
// You don't need to import models unless main.tsp uses them directly.
import "./routes/auth.tsp";

using TypeSpec.Http;
using TypeSpec.OpenAPI;

@service(#{ title: "Gym App " })
@info(#{ version: "1.0.0" })
@server("https://api.example.com", "Production Environment")
@route("/api")
namespace App;
