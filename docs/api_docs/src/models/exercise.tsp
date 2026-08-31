model ExerciseInfo {
  id: integer;              
  name:             string;
  instructions:     string;
  difficulty:       string;
  equipment:        string[];
  illustration:     string[];       

}

model ExerciseInfoListResponse {
  @doc("Exercise list")
  exercises: ExerciseInfo[];
}

model CreateExerciseRequest {
  exerciseId: integer;          
  workoutId: integer;          
  sequenceNumber: integer;          
  reps: String;
  sets: integer;
  restTimeSeconds: integer;
  durationMinutes: integer;
  weight: decimal;
}

model CreateWorkoutRequest {
  name:             String
  sequenceNumber:   Int              
  weekId:           Int             
    
}

model CreateWorkoutResponse {
  workoutId: integer;            
}

model CreateWeekRequest {
  name:             String;
  sequenceNumber:   Int;              
  planId:        Int;             
}

model CreateWeekResponse {
  weekId: integer;            
}

model CreatePlanRequest {
  name:             String;
  description:      String;
  traineeId:        Int;             
}

model CreatePlanResponse {
  planId: integer;            
}



model MusclesInfo {
  id: integer; 
  name: string;           
  bodyRegion: string;           
  diagramUrl: string;           
  description: string;
}

model ExerciseMuscle {
  exerciseId: integer   
  muscleId:   integer    
  name:       string

  role:     MuscleRole

}

enum MuscleRole {
  PRIMARY    
  SECONDARY  
  STABILIZER 
}
