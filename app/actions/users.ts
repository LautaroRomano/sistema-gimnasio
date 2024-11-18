"use server";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import { db } from "@/lib/firebase";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  setDoc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";

import { RoutineType, UserType } from "@/types";

export const verifyToken = async (token: string) => {
  try {
    const verify = jwt.verify(token, process.env.JWT_SECRET || "");

    if (typeof verify !== "string" && (verify as JwtPayload).user) {
      const userDoc = await getDoc(
        doc(db, "users", (verify as JwtPayload).user.id)
      );

      if (userDoc.exists()) {
        const useereeDocData = userDoc.data();
        const dataResponse = {
          id: userDoc.id,
          ...useereeDocData,
          createdAt: useereeDocData.createdAt
            ? new Date(useereeDocData.createdAt)
            : null,
          updatedAt: useereeDocData.updatedAt
            ? new Date(useereeDocData.updatedAt)
            : null,
        } as UserType;
        return { success: dataResponse };
      } else {
        return { error: "Usuario no encontrado" };
      }
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

    const userQuery = query(collection(db, "users"), where("dni", "==", dni));
    const userSnap = await getDocs(userQuery);
    if (userSnap.empty) return { error: "Usuario no encontrado!" };

    let userDni = userSnap.docs[0].data() as UserType;
    const userId = userSnap.docs[0].id;

    // Convertir createdAt a texto si existe
    userDni = {
      ...userDni,
      id: userId,
      createdAt: userDni.createdAt ? new Date(userDni.createdAt) : null,
      updatedAt: userDni.updatedAt ? new Date(userDni.updatedAt) : null,
    };

    if (userDni.password === "UPDATE") {
      const newPassword = await bcrypt.hash(password, 10);
      await updateDoc(doc(db, "users", userSnap.docs[0].id), {
        password: newPassword,
      });
      const token = jwt.sign({ user: userDni }, process.env.JWT_SECRET || "");

      return { success: userDni, token };
    }

    const isAuth = await bcrypt.compare(password, userDni.password || "");
    if (isAuth) {
      const token = jwt.sign({ user: userDni }, process.env.JWT_SECRET || "");
      return { success: userDni, token };
    }
    return { error: "Contraseña incorrecta" };
  } catch (error) {
    return { error: "Ocurrió un error" };
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
    let hashedPassword = password ? await bcrypt.hash(password, 10) : null;
    if (!name || !dni || !email)
      return { error: "Debe completar todos los campos!" };

    const userQuery = query(collection(db, "users"), where("dni", "==", dni));
    const userEmailQuery = query(
      collection(db, "users"),
      where("email", "==", email)
    );
    const [userSnap, userEmailSnap] = await Promise.all([
      getDocs(userQuery),
      getDocs(userEmailQuery),
    ]);

    if (id === "" && !userSnap.empty)
      return { error: "Ya existe un usuario con este DNI!" };
    if (id === "" && !userEmailSnap.empty)
      return { error: "Ya existe un usuario con este EMAIL!" };

    if (id === "") {
      if (!hashedPassword) return { error: "Debe ingresar una contraseña!" };
      await setDoc(doc(collection(db, "users")), {
        name,
        normalizeName: normalizeString(name),
        email,
        normalizeEmail: normalizeString(email),
        dni,
        phone,
        password: hashedPassword,
        createdAt: Timestamp.now(),
        updatedAt: null,
        deletedAt: null,
        isAdmin: false,
      });
    } else {
      const updateData = {
        name,
        normalizeName: normalizeString(name),
        email,
        normalizeEmail: normalizeString(email),
        phone,
        gender: gender ? gender : null,
        height: height ? height * 1 : null,
        weight: weight ? weight * 1 : null,
        wasEdited: !!wasEdited,
        updatedAt: Timestamp.now(),
        ...(hashedPassword ? { password: hashedPassword } : {}),
      };
      console.log(updateData);
      await updateDoc(doc(db, "users", id), updateData);
    }
    return { success: true };
  } catch (error) {
    console.log("🚀 ~ error:", error);
    return { error: "Ocurrió un error" };
  }
};

export const getUsers = async (search: string | null) => {
  try {
    const usersCollection = collection(db, "users");

    // Consultas base: usuarios no eliminados y no administradores
    const baseQuery = query(
      usersCollection,
      where("deletedAt", "==", null),
      where("isAdmin", "==", false)
    );

    let querySnapshot;
    if (search) {
      const normalizeSearch = normalizeString(search);
      // Consultas individuales para cada campo
      const nameQuery = query(
        usersCollection,
        where("deletedAt", "==", null),
        where("isAdmin", "==", false),
        where("normalizeName", ">=", normalizeSearch),
        where("normalizeName", "<=", normalizeSearch + "\uf8ff") // Para búsqueda exacta o prefijo
      );

      const emailQuery = query(
        usersCollection,
        where("deletedAt", "==", null),
        where("isAdmin", "==", false),
        where("normalizeEmail", ">=", normalizeSearch),
        where("normalizeEmail", "<=", normalizeSearch + "\uf8ff")
      );

      const dniQuery = query(
        usersCollection,
        where("deletedAt", "==", null),
        where("isAdmin", "==", false),
        where("dni", ">=", normalizeSearch),
        where("dni", "<=", normalizeSearch + "\uf8ff")
      );

      // Ejecutar todas las consultas y combinar resultados
      const [nameSnapshot, emailSnapshot, dniSnapshot] = await Promise.all([
        getDocs(nameQuery),
        getDocs(emailQuery),
        getDocs(dniQuery),
      ]);

      // Combinar resultados eliminando duplicados
      const allDocs = [
        ...nameSnapshot.docs,
        ...emailSnapshot.docs,
        ...dniSnapshot.docs,
      ];
      const uniqueDocs = Array.from(
        new Map(allDocs.map((doc) => [doc.id, doc])).values()
      );

      querySnapshot = { docs: uniqueDocs };
    } else {
      // Si no hay búsqueda, usar la consulta base
      querySnapshot = await getDocs(baseQuery);
    }

    // Procesar resultados
    const data = querySnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() }) as UserType
    );

    return {
      success: data.map((d) => ({
        ...d,
        //@ts-ignore
        createdAt: d.createdAt ? d.createdAt.toDate() : null,
        //@ts-ignore
        updatedAt: d.updatedAt ? d.updatedAt.toDate() : null,
      })),
    };
  } catch (error) {
    console.log("🚀 ~ getUsers ~ error:", error);
    return { error: "Ocurrió un error" };
  }
};

export const getAUserRoutine = async (user_id: string, date: Date) => {
  try {
    const startOfDay = Timestamp.fromDate(
      new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0)
    );
    const endOfDay = Timestamp.fromDate(
      new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        23,
        59,
        59,
        999
      )
    );

    // Query para buscar rutinas existentes
    const routinesQuery = query(
      collection(db, "routines"),
      where("userId", "==", user_id),
      where("date", ">=", startOfDay),
      where("date", "<=", endOfDay),
      where("deletedAt", "==", null)
    );

    const routinesSnap = await getDocs(routinesQuery);

    let routine: RoutineType | null = null;

    if (!routinesSnap.empty) {
      // Rutina encontrada, procesar datos
      const routineDoc = routinesSnap.docs[0];
      const data = routineDoc.data();
      routine = {
        id: routineDoc.id,
        name: data.name,
        date: data.date?.toDate() || null,
        success: data.success || false,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || null,
        deletedAt: data.deletedAt?.toDate() || null,
        exercises: data.exercises || [],
      };
    } else {
      // No existe la rutina, crear una nueva
      const newRoutineRef = doc(collection(db, "routines"));
      const newRoutine = {
        name: `Rutina ${date.toLocaleDateString()}`,
        userId: user_id,
        date: startOfDay,
        success: false,
        createdAt: Timestamp.now(),
        updatedAt: null,
        deletedAt: null,
      };

      await setDoc(newRoutineRef, newRoutine);
      routine = {
        id: newRoutineRef.id,
        ...newRoutine,
        createdAt: newRoutine.createdAt && newRoutine.createdAt.toDate(),
        date: newRoutine.date.toDate(), // Convertimos el Timestamp a Date
        exercises: [],
      };
    }

    return { success: routine };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Ocurrió un error",
    };
  }
};

const normalizeString = (str: string): string => {
  return str
    .toLowerCase()
    .normalize("NFD") // Divide caracteres compuestos en caracteres base + diacríticos
    .replace(/[\u0300-\u036f]/g, ""); // Elimina los diacríticos (acentos, tildes, etc.)
};
