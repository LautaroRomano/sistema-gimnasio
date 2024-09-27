/*
  Warnings:

  - You are about to drop the column `repetitions` on the `ExercisesConfig` table. All the data in the column will be lost.
  - You are about to drop the column `repetitions` on the `RoutineExercises` table. All the data in the column will be lost.
  - Added the required column `series` to the `ExercisesConfig` table without a default value. This is not possible if the table is not empty.
  - Added the required column `series` to the `RoutineExercises` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ExercisesConfig" DROP COLUMN "repetitions",
ADD COLUMN     "series" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "RoutineExercises" DROP COLUMN "repetitions",
ADD COLUMN     "series" INTEGER NOT NULL;
