"use server";
import { PrismaClient } from "@prisma/client";

import { ExerciseType } from "@/types";

const prisma = new PrismaClient();

export const create = async (
  { name, img, description, type, value, series }: ExerciseType,
  routineId: number,
) => {
  try {
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

    return { success: true };
  } catch (error) {
    return { error: "Ocurrio un error" };
  }
};
