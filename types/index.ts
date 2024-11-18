import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size: number | null;
};

export type ExerciseType = {
  id: string;
  name: string;
  img?: string | null;
  description: string;
  type: string;
  value: string;
  series: number;
  success?: boolean | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  deletedAt?: Date | null;
};

// Users table type
export type UserType = {
  id: string;
  dni: string;
  email: string;
  name?: string | null;
  isAdmin: boolean;
  password?: string;
  phone?: string | null;
  gender?: string | null;
  height?: number | null;
  weight?: number | null;
  wasEdited?: boolean | null;
  createdAt: Date | null;
  updatedAt?: Date | null;
  deletedAt?: Date | null;
};

// Routines table type
export type RoutineType = {
  name: string;
  id: string;
  date?: Date | null;
  success: boolean;
  createdAt: Date;
  updatedAt?: Date | null;
  deletedAt?: Date | null;
  exercises: RoutineExerciseType[];
};

// RoutineExercises table type
export type RoutineExerciseType = {
  id: string;
  name: string;
  img?: string | null;
  description: string;
  type: string;
  value: string;
  series: number;
  success: boolean;
  routineId: string;
};

// Images table type
export type ImageType = {
  id: string;
  name: string;
  imageUrl?: string | null;
  lastUse?: Date | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  deletedAt?: Date | null;
};
