-- AlterTable
ALTER TABLE "ExercisesConfig" ALTER COLUMN "updatedAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "RoutineExercises" ALTER COLUMN "updatedAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Routines" ALTER COLUMN "updatedAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Users" ALTER COLUMN "updatedAt" DROP NOT NULL;
