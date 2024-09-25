"use server";
import { ExerciseType } from "@/types";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const create = async ({
  name,
  img,
  description,
  type,
  value,
  repetitions,
}: ExerciseType,routineId:number) => {
  try {
    await prisma.routineExercises.create({
      data: {
        name,
        img,
        description,
        type,
        value,
        repetitions:repetitions*1,
        routineId
      },
    });
    return { success: true };
  } catch (error) {
    console.log("🚀 ~ create ~ error:", error);
    return { error: "Ocurrio un error" };
  }
};
