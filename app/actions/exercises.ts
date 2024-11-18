"use server";
import { ExerciseType } from "@/types";
import { db } from "@/lib/firebase"; // Importa Firestore desde tu configuración
import { collection, addDoc, updateDoc, doc, getDoc } from "firebase/firestore";

// Función para crear o actualizar un ejercicio
export const create = async (
  { id, name, img, description, type, value, series }: ExerciseType,
  routineId: string, // Firestore usa strings en lugar de números para los IDs
) => {
  try {
    if (id === '') {
      // Crear un nuevo ejercicio
      await addDoc(collection(db, "routineExercises"), {
        name,
        img,
        description,
        type,
        value,
        series: series * 1,
        routineId,
      });
    } else {
      // Actualizar ejercicio existente
      const exerciseRef = doc(db, "routineExercises", id);
      await updateDoc(exerciseRef, {
        name,
        img,
        description,
        type,
        value,
        series: series * 1,
        routineId,
      });
    }

    return { success: true };
  } catch (error) {
    return { error: "Ocurrió un error" };
  }
};

// Función para marcar un ejercicio como completado
export const finish = async (id: string) => {
  try {
    const exerciseRef = doc(db, "routineExercises", id);
    await updateDoc(exerciseRef, {
      success: true,
    });

    return { success: true };
  } catch (error) {
    return { error: "Ocurrió un error" };
  }
};

// Función para obtener un ejercicio por ID
export const getExercise = async (exerciseId: string) => {
  try {
    const exerciseRef = doc(db, "routineExercises", exerciseId);
    const exerciseSnap = await getDoc(exerciseRef);

    if (exerciseSnap.exists()) {
      return { success: exerciseSnap.data() as ExerciseType };
    } else {
      return { error: "Ejercicio no encontrado" };
    }
  } catch (error) {
    return { error: "Ocurrió un error" };
  }
};
