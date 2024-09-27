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
  series,
}: ExerciseType) => {
  try {
    await prisma.exercisesConfig.create({
      data: {
        name,
        img,
        description,
        type,
        value,
        series:series*1,
      },
    });
    return { success: true };
  } catch (error) {
    console.log("🚀 ~ create ~ error:", error);
    return { error: "Ocurrio un error" };
  }
};

export const getExercises = async (search: string | null) => {
  try {
    const data = await prisma.exercisesConfig.findMany({
      where: search
        ? {
            name: {
              contains: search,
              mode: "insensitive", // Ignora mayúsculas y minúsculas
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

export const uploadImg = async ({
  img,
  name,
}: {
  img: string;
  name: string;
}) => {
  try {
    if (!img || img.length === 0)
      return { error: "Ocurrio un error al cargar la imagen" };

    await prisma.images.create({ data: { imageUrl: img, name } });

    return { success: true };
  } catch (error) {
    console.log("🚀 ~ error:", error);
    return { error: 'Ocurrio un error' };
  }
};

export const getImages = async (search: string | null) => {
  try {
    const images = await prisma.images.findMany({
      where: search
        ? {
            name: {
              contains: search,
              mode: "insensitive", // Ignora mayúsculas y minúsculas
            },
          }
        : {},
    });
    return { success: images };
  } catch (error) {
    console.log("🚀 ~ error:", error);
    return { error: "Ocurrio un error" };
  }
};
