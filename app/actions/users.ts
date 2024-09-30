"use server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

import { UserType } from "@/types";

const prisma = new PrismaClient();

export const createUser = async ({
  id,
  name,
  dni,
  email,
  password,
  phone,
}: UserType) => {
  try {
    let hashedPassword = null;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    if (!name || !dni || !email)
      return { error: "Debe completar todos los campos!" };

    const userDni = await prisma.users.findFirst({
      where: { dni: dni },
    });
    const userEmail = await prisma.users.findFirst({
      where: { email: email },
    });

    if (id === 0 && userDni)
      return { error: "Ya existe un usuario con este DNI!" };
    if (id === 0 && userEmail)
      return { error: "Ya existe un usuario con este EMAIL!" };

    if (id === 0) {
      if (!hashedPassword) return { error: "Debe ingresar una contraseña!" };
      await prisma.users.create({
        data: {
          name,
          dni,
          email,
          phone,
          password: hashedPassword,
        },
      });
    } else {
      const updatePassword = hashedPassword ? { password: hashedPassword } : {};
      await prisma.users.update({
        data: {
          name,
          email,
          phone,
          ...updatePassword,
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

export const getUsers = async (search: string | null) => {
  try {
    const data = await prisma.users.findMany({
      where: search
        ? {
            AND: [
              {
                deletedAt: null,
              },
              {
                OR: [
                  {
                    name: {
                      contains: search,
                      mode: "insensitive",
                    },
                  },
                  {
                    email: {
                      contains: search,
                      mode: "insensitive",
                    },
                  },
                  {
                    dni: {
                      contains: search,
                      mode: "insensitive",
                    },
                  },
                ],
              },
            ],
          }
        : {
            deletedAt: null,
          },
      select: {
        id: true,
        name: true,
        email: true,
        dni: true,
        createdAt: true,
        isAdmin: true,
        phone: true,
        updatedAt: true,
      },
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
        0
      )
    );

    const endOfDay = new Date(
      Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        23,
        59,
        59,
        999
      )
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
