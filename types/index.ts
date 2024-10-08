import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size: number | null;
};

export type ExerciseType = {
  id: number;
  name: string;
  img?: string | null;
  description: string;
  type: string;
  value: string;
  series: number;
  success?: boolean | null;
  createdAt: Date;
  updatedAt?: Date | null;
  deletedAt?: Date | null;
};

// Users table type
export type UserType = {
  id: number;
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
  createdAt?: Date | null;
  updatedAt?: Date | null;
  deletedAt?: Date | null;
};

// Routines table type
export type RoutineType = {
  id: number;
  name: string;
  date?: Date | null;
  success: boolean;
  createdAt: Date;
  updatedAt?: Date | null;
  deletedAt?: Date | null;
  exercises: RoutineExerciseType[];
};

// RoutineExercises table type
export type RoutineExerciseType = {
  id: number;
  name: string;
  img?: string | null;
  description: string;
  type: string;
  value: string;
  series: number;
  success: boolean;
  createdAt: Date;
  updatedAt?: Date | null;
  deletedAt?: Date | null;
  routineId: number;
};

// Images table type
export type ImageType = {
  id: number;
  name: string;
  imageUrl?: string | null;
  lastUse?: Date | null;
  createdAt?: Date;
  updatedAt?: Date | null;
  deletedAt?: Date | null;
};
