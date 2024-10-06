"use server";
import { PrismaClient } from "@prisma/client";

import { ExerciseType } from "@/types";

const prisma = new PrismaClient();

export const create = async (
  { id, name, img, description, type, value, series }: ExerciseType,
  routineId: number
) => {
  console.log( { id, name, img, description, type, value, series })
  try {
    if (id === 0) {
      await prisma.routineExercises.create({
        data: {
          name,
          img,
          description,
          type,
          value,
          series: series * 1,
          routineId,
        },
      });
    } else {
      await prisma.routineExercises.update({
        data: {
          name,
          img,
          description,
          type,
          value,
          series: series * 1,
          routineId,
        },
        where: { id },
      });
    }

    return { success: true };
  } catch (error) {
    console.log("🚀 ~ error:", error)
    return { error: "Ocurrio un error" };
  }
};
