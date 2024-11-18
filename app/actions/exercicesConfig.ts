"use server";
import { ExerciseType, ImageType } from "@/types";
import { db } from "@/lib/firebase"; // Importa Firestore desde tu configuración
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";

// Función para crear o actualizar un ejercicio
export const create = async ({
  id,
  name,
  img,
  description,
  type,
  value,
  series,
}: ExerciseType) => {
  try {
    const exercisesRef = collection(db, "exercisesConfig");

    if (id === "") {
      // Crear un nuevo ejercicio
      await addDoc(exercisesRef, {
        name,
        img,
        description,
        type,
        value,
        series: series * 1,
        updatedAt: new Date(),
      });
    } else {
      // Actualizar ejercicio existente
      const exerciseRef = doc(db, "exercisesConfig", id);
      await updateDoc(exerciseRef, {
        name,
        img,
        description,
        type,
        value,
        series: series * 1,
        updatedAt: new Date(),
      });
    }

    return { success: true };
  } catch (error) {
    return { error: "Ocurrió un error" };
  }
};

// Función para obtener ejercicios
export const getExercises = async (search: string | null) => {
  try {
    const exercisesRef = collection(db, "exercisesConfig");
    const exercisesQuery = query(exercisesRef, orderBy("updatedAt", "desc"));

    // Obtener los documentos
    const querySnapshot = await getDocs(exercisesQuery);

    // Mapear los documentos y filtrar si es necesario
    const data = querySnapshot.docs
      .map((doc) => {
        const exerciseData = doc.data(); // Asegúrate de que esto devuelve un objeto
        if (!exerciseData || typeof exerciseData !== "object") {
          throw new Error("Los datos del documento no son válidos");
        }

        // Crear el objeto del ejercicio
        return {
          id: doc.id,
          ...exerciseData,
          createdAt: exerciseData.createdAt
            ? new Date(exerciseData.createdAt)
            : null,
          updatedAt: exerciseData.updatedAt
            ? new Date(exerciseData.updatedAt)
            : null,
        } as ExerciseType;
      })
      // Filtrar después del mapeo si se proporciona una búsqueda
      .filter(
        (exercise) =>
          !search || exercise.name.toLowerCase().includes(search.toLowerCase())
      );

    return { success: data };
  } catch (error) {
    console.log("🚀 ~ getExercises ~ error:", error);
    return { error: "Ocurrió un error" };
  }
};

// Función para subir o actualizar imagen
export const uploadImg = async ({ id, imageUrl, name }: ImageType) => {
  try {
    if (!imageUrl || imageUrl.length === 0) {
      return { error: "Ocurrió un error al cargar la imagen" };
    }

    const imagesRef = collection(db, "images");

    if (id === "") {
      // Crear una nueva imagen
      await addDoc(imagesRef, { imageUrl, name, updatedAt: new Date() });
    } else {
      // Actualizar imagen existente
      const imageRef = doc(db, "images", id);
      await updateDoc(imageRef, { name, imageUrl, updatedAt: new Date() });
    }

    return { success: true };
  } catch (error) {
    return { error: "Ocurrió un error" };
  }
};

// Función para obtener imágenes
export const getImages = async (search: string | null) => {
  try {
    const imagesRef = collection(db, "images");
    const imagesQuery = search
      ? query(
          imagesRef,
          where("name", ">=", search),
          orderBy("updatedAt", "desc")
        )
      : query(imagesRef, orderBy("updatedAt", "desc"));

    const querySnapshot = await getDocs(imagesQuery);
    const images = querySnapshot.docs.map((doc) => {
      const data = doc.data() as ImageType;
      return {
        ...data,
        id: doc.id,
        lastUse: data.lastUse || null,
        imageUrl: data.imageUrl || '',
        createdAt: data.createdAt ? new Date(data.createdAt) : null,
        updatedAt: data.updatedAt ? new Date(data.updatedAt) : null,
      };
    });

    return { success: images };
  } catch (error) {
    return { error: "Ocurrió un error" };
  }
};
