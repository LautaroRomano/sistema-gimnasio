"use server";
import { PrismaClient } from "@prisma/client";
import { startOfDay, endOfDay } from "date-fns";

import { ExerciseType } from "@/types";

const prisma = new PrismaClient();

export const create = async (
  { id, name, img, description, type, value, series }: ExerciseType,
  routineId: number
) => {
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
    console.log("🚀 ~ error:", error);
    return { error: "Ocurrio un error" };
  }
};

export const finish = async (id:number) => {
  try {
      await prisma.routineExercises.update({
        data: {
         success:true
        },
        where:{
          id:id
        }
      });
    return { success: true };
  } catch (error) {
    console.log("🚀 ~ error:", error);
    return { error: "Ocurrio un error" };
  }
};

export const getExercise = async (exerciseId: number) => {
  try {

    const exercise = await prisma.routineExercises.findFirst({
      where: {
        id:exerciseId
      }
    });

    return { success: exercise };
  } catch (error) {
    console.log("🚀 ~ error:", error);
    return { error: "Ocurrió un error" };
  }
};
