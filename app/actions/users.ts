"use server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

import { UserType } from "@/types";

const prisma = new PrismaClient();

export const createUser = async ({
  name,
  email,
  password,
  phone,
}: UserType) => {
  try {
    if (!name) return { error: "Debe ingresar el nombre" };
    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.users.create({
      data: {
        name,
        email,
        phone,
        password: hashedPassword,
      },
    });

    return { success: true };
  } catch (error) {
    return { error: "Ocurrio un error" };
  }
};

export const getUsers = async (search: string | null) => {
  try {
    const data = await prisma.users.findMany({
      where: search
        ? {
            name: {
              contains: search,
              mode: "insensitive",
            },
          }
        : {},
    });

    return { success: data };
  } catch (error) {
    return { error: "Ocurrio un error" };
  }
};

export const getAUserRoutine = async (user_id: number, date: Date) => {
  try {
    // Obtener la fecha en UTC (sin el desfase de la zona horaria local)
    const startOfDay = new Date(
      Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        0,
        0,
        0,
      ),
    );

    const endOfDay = new Date(
      Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        23,
        59,
        59,
        999,
      ),
    );

    // Buscar la rutina en el rango de la fecha (en UTC)
    const data = await prisma.routines.findMany({
      where: {
        userId: user_id,
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
        deletedAt: null,
      },
    });

    // Si no existe, crear una nueva rutina para esa fecha
    let routine = data[0];

    if (!routine) {
      routine = await prisma.routines.create({
        data: {
          name: `Rutina ${date.toLocaleDateString()}`,
          userId: user_id,
          date: startOfDay, // Establece la fecha como la medianoche de ese día
        },
      });
    }

    // Obtener los ejercicios asociados a la rutina
    const exercises = await prisma.routineExercises.findMany({
      where: {
        routineId: routine.id,
      },
    });

    return { success: { ...routine, exercises } };
  } catch (error) {
    return { error: "Ocurrió un error" };
  }
};
