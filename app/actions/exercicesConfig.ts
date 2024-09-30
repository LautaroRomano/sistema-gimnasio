"use server";
import { PrismaClient } from "@prisma/client";

import { ExerciseType, ImageType } from "@/types";

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
        series: series * 1,
      },
    });

    return { success: true };
  } catch (error) {
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
    return { error: "Ocurrio un error" };
  }
};

export const uploadImg = async ({ id, imageUrl, name }: ImageType) => {
  try {
    if (!imageUrl || imageUrl.length === 0)
      return { error: "Ocurrio un error al cargar la imagen" };

    if (id === 0) {
      await prisma.images.create({ data: { imageUrl: imageUrl, name } });
    } else {
      await prisma.images.update({
        data: {
          name,
          imageUrl,
        },
        where: { id },
      });
    }

    return { success: true };
  } catch (error) {
    return { error: "Ocurrio un error" };
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
    return { error: "Ocurrio un error" };
  }
};
