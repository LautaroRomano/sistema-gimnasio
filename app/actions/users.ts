"use server";
import { UserType } from "@/types";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

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
    console.log("🚀 ~ create ~ error:", error);
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
    console.log("🚀 ~ error:", error);
    return { error: "Ocurrio un error" };
  }
};
