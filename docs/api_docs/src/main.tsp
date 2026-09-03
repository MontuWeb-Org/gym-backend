import "@typespec/http";
import "@typespec/openapi";
import "@typespec/openapi3";

// Route modules
import "./routes/auth.tsp";
import "./routes/user.tsp";
import "./routes/exercises.tsp";
import "./routes/plans.tsp";
import "./routes/logs.tsp";
import "./models/auth.tsp";

using TypeSpec.Http;
using TypeSpec.OpenAPI;

@service(#{ title: "Gym App " })
@info(#{ version: "1.0.0" })
@server("https://api.example.com", "Production Environment")
@route("/api")
@useAuth(App.Models.BearerAuth)
namespace App;
