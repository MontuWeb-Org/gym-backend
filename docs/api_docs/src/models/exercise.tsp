namespace App.Models;

model Muscle {
  id?: integer;
  commonName: string;
  bodyRegion?: string;
  diagramUrl?: string;
  description?: string;
}

enum MuscleRole {
  PRIMARY,
  SECONDARY,
  STABILIZER,
}

model Exercise {
  id?: integer;
  name: string;
  instructions: string;
  difficulty: string;
  equipment: string[];
  illustration: string[];
  muscles: Muscle[];
}

model ExerciseInfoListResponse {
  @doc("Exercise list")
  exercises: Exercise[];
}

@doc("Request body for creating or updating an exercise")
model CreateExerciseRequest {
  name: string;
  instructions: string;
  difficulty: string;
  equipment: string[];
  illustrations: string[];
  muscles: Muscle[];
}
