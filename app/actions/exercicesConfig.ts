import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const create = async ({
  name,
  img,
  description,
  type,
  value,
  repetitions,
}) => {
  try {
    prisma.exercisesConfig.create({
      data: {
        name,
        img,
        description,
        type,
        value,
        repetitions,
      },
    });
    return { success: true };
  } catch (error) {
    console.log("🚀 ~ create ~ error:", error);
    return { error: "Ocurrio un error" };
  }
};
