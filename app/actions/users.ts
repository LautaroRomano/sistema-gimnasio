"use server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";

import { UserType } from "@/types";

const prisma = new PrismaClient();

export const verifyToken = async (token: string) => {
  try {
    const verify = jwt.verify(token, process.env.JWT_SECRET || "");

    if (typeof verify !== "string" && (verify as JwtPayload).user) {
      const myUser = await prisma.users.findFirst({
        where: { id: (verify as JwtPayload).user.id },
        select: {
          id: true,
          dni: true,
          email: true,
          isAdmin: true,
          name: true,
          password: true,
          phone: true,
          gender: true,
          height: true,
          weight: true,
          wasEdited: true,
        },
      });

      if (myUser) return { success: myUser };
      else return { error: "Usuario no encontrado" };
    }

    return { error: "Ocurrió un error" };
  } catch (error) {
    return { error: "Ocurrió un error" };
  }
};

export const loginUser = async ({
  dni,
  password,
}: {
  dni: string;
  password: string;
}) => {
  try {
    if (!dni || !password) return { error: "Debe completar todos los campos!" };

    const userDni = await prisma.users.findFirst({
      where: { AND: [{ dni }, { deletedAt: null }] },
      select: {
        id: true,
        dni: true,
        email: true,
        isAdmin: true,
        name: true,
        password: true,
        phone: true,
      },
    });

    if (!userDni) return { error: "Usuario no encontrado!" };

    if (userDni.password === "UPDATE") {
      const newPassword = await bcrypt.hash(password, 10);

      await prisma.users.update({
        data: { password: newPassword },
        where: { id: userDni.id },
      });
      var token = jwt.sign({ user: userDni }, process.env.JWT_SECRET || "");

      return { success: userDni, token };
    }

    const isAuth = await bcrypt.compare(password, userDni.password);

    if (isAuth) {
      var token = jwt.sign({ user: userDni }, process.env.JWT_SECRET || "");

      return { success: userDni, token };
    }

    return { error: "Contraseña incorrecta" };
  } catch (error) {
    return { error: "Ocurrio un error" };
  }
};

export const createUser = async ({
  id,
  name,
  dni,
  email,
  password,
  phone,
  gender,
  height,
  weight,
  wasEdited,
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
          gender,
          height: height ? height * 1 : null,
          weight: weight ? weight * 1 : null,
          //isAdmin,
          wasEdited: !!wasEdited,
          ...updatePassword,
        },
        where: { id },
      });
    }

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
            AND: [
              {
                deletedAt: null,
              },
              {
                isAdmin: false,
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
            AND: [
              {
                deletedAt: null,
              },
              {
                isAdmin: false,
              },
            ],
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
      orderBy: {
        updatedAt: "desc",
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

    const mindOfDay = new Date(
      Date.UTC(
        newDate.getUTCFullYear(),
        newDate.getUTCMonth(),
        newDate.getUTCDate(),
        12,
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
          date: mindOfDay, // Establece la fecha
        },
      });
    }

    // Obtener los ejercicios asociados a la rutina
    const exercises = await prisma.routineExercises.findMany({
      where: {
        routineId: routine.id,
      },
      orderBy: {
        updatedAt: "asc",
      },
    });

    return { success: { ...routine, exercises } };
  } catch (error) {
    return { error: "Ocurrió un error" };
  }
};

export const deleteExercise = async (id: number) => {
  try {
    await prisma.routineExercises.delete({
      where: { id },
    });

    return { success: true };
  } catch (error) {
    return { error: "Ocurrió un error" };
  }
};

export const deleteUser = async (id: number) => {
  try {
    await prisma.users.update({
      data: {
        deletedAt: new Date(),
      },
      where: { id },
    });

    return { success: true };
  } catch (error) {
    return { error: "Ocurrió un error" };
  }
};
