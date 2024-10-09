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

export const getRoutines = async (id: number, date: Date) => {
  try {
    const startDate = startOfDay(date);
    const endDate = endOfDay(date);

    const routines = await prisma.routines.findFirst({
      where: {
        userId: id,
        date: {
          gte: startDate,
          lt: endDate,
        },
      },
      include: {
        exercises: true,
      },
    });

    return { success: routines };
  } catch (error) {
    console.log("🚀 ~ error:", error);
    return { error: "Ocurrió un error" };
  }
};
