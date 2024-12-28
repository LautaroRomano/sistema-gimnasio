"use server";
import { PrismaClient } from "@prisma/client";

import { ExerciseType } from "@/types";

const prisma = new PrismaClient();

export const create = async (
  { id, name, img, description, type, value, series }: ExerciseType,
  routineId: number,
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
    return { error: "Ocurrio un error" };
  }
};

export const getRoutines = async (id: number, date: Date) => {
  try {
    const newDate = new Date(date);
    newDate.setHours(newDate.getHours() - 3);
    const startOfDay = new Date(
      Date.UTC(
        newDate.getUTCFullYear(),
        newDate.getUTCMonth(),
        newDate.getUTCDate(),
        0,
        0,
        0,
      ),
    );
    const endOfDay = new Date(
      Date.UTC(
        newDate.getUTCFullYear(),
        newDate.getUTCMonth(),
        newDate.getUTCDate(),
        23,
        59,
        59,
        999,
      ),
    );

    const routines = await prisma.routines.findFirst({
      where: {
        userId: id,
        date: {
          gte: startOfDay,
          lt: endOfDay,
        },
      },
      include: {
        exercises: true,
      },
    });

    return { success: routines };
  } catch (error) {
    return { error: "Ocurrió un error" };
  }
};
