"use server";
import { ExerciseType, RoutineExerciseType, RoutineType } from "@/types";
import { db } from "@/lib/firebase"; // Importa Firestore desde tu configuración
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { v4 } from "uuid";

// Función para crear o actualizar un ejercicio
export const create = async (
  { id, name, img, description, type, value, series }: ExerciseType,
  routine: RoutineType
) => {
  try {
    const routineRef = doc(db, "routines", routine.id);
    if (id === "") {
      // Crear un nuevo ejercicio
      const exercise: RoutineExerciseType = {
        id: v4(),
        routineId: routine.id,
        name,
        img,
        description,
        type,
        value,
        series: series * 1,
        success: false,
      };

      routine.exercises.push(exercise);

      await updateDoc(routineRef, { ...routine });
    } else {
      const newExercises = routine.exercises.map((ex) =>
        ex.id === id
          ? { ...ex, name, img, description, type, value, series: series * 1 }
          : ex
      );
      // Actualizar ejercicio existente
      await updateDoc(routineRef, { ...routine, exercises: newExercises });
    }

    return { success: true };
  } catch (error) {
    return { error: "Ocurrió un error" };
  }
};

// Función para actualizar un ejercicio
export const updateExersice = async (
  {
    id,
    name,
    img,
    description,
    type,
    value,
    series,
    success = false,
  }: ExerciseType,
  routine: RoutineType
) => {
  try {
    const routineRef = doc(db, "routines", routine.id);

    if (id === "") return { error: "ID no proporcionado!" };

    const newExercises = routine.exercises.map((ex) =>
      ex.id === id
        ? {
            ...ex,
            name,
            img,
            description,
            type,
            value,
            series: series * 1,
            success,
          }
        : ex
    );
    // Actualizar ejercicio existente
    await updateDoc(routineRef, { ...routine, exercises: newExercises });

    return { success: true };
  } catch (error) {
    return { error: "Ocurrió un error" };
  }
};

// Función para obtener rutinas en una fecha específica
export const getRoutines = async (id: string, date: Date) => {
  try {
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

    // Consulta para obtener la rutina del usuario en la fecha especificada
    const routinesRef = collection(db, "routines");
    const q = query(
      routinesRef,
      where("userId", "==", id),
      where("date", ">=", startOfDay),
      where("date", "<", endOfDay)
    );

    const routineSnapshot = await getDocs(q);
    const routines = routineSnapshot.docs.map((doc) => ({
      ...(doc.data() as RoutineType),
      id: doc.id,
    }));

    const resRoutine: RoutineType | null = routines[0]
      ? {
          id: routines[0].id,
          exercises: routines[0].exercises,
          name: routines[0].name,
          success: routines[0].success,
          createdAt: new Date(routines[0].createdAt),
        }
      : null;

    return { success: resRoutine };
  } catch (error) {
    console.log("🚀 ~ getRoutines ~ error:", error);
    return { error: "Ocurrió un error" };
  }
};
