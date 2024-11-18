"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@nextui-org/button";
import { Image, Divider } from "@nextui-org/react";
import { toast } from "react-toastify";
import { IoIosArrowBack } from "react-icons/io";
import { IoReloadCircle, IoTimeSharp } from "react-icons/io5";

import { ExerciseType, RoutineType } from "@/types";
import { updateExersice } from "@/app/actions/routines";

const initExercise: ExerciseType | null = null;

export default function ViewExersice({
  routine,
  exerciseId,
  close,
}: {
  routine: RoutineType | null;
  exerciseId: string;
  close: Function;
}) {
  const [exercise, setExercise] = useState(initExercise);

  const router = useRouter();

  const findExercise = async () => {
    if (!routine) return;
    const exercise =
      routine.exercises.find((ex) => ex.id === exerciseId) || null;
    setExercise(exercise);
  };

  useEffect(() => {
    if (routine && exerciseId) findExercise();
  }, [routine, exerciseId]);

  const handleFinish = async () => {
    if (!exercise?.id || !routine) return;
    const res = await updateExersice({ ...exercise, success: true }, routine);

    if (res.error) return toast.error(res.error);

    toast.success("Finalizado con exito!");

    setTimeout(() => {
      close();
    }, 1000);
  };

  return (
    <section className="flex flex-col items-center justify-center gap-4 h-screen overflow-y-auto">
      <div className="flex w-full items-center justify-between gap-2 px-0 mt-8">
        <div className="flex flex-col items-start mt-0">
          <Button
            className="bg-transparent text-default-900 font-bold"
            color="primary"
            startContent={
              <strong className="text-primary">
                <IoIosArrowBack size={19} />
              </strong>
            }
            onPress={() => close()}
          >
            <strong>{exercise?.name}</strong>
          </Button>
        </div>
      </div>

      {exercise ? (
        <div className="flex flex-col w-full h-full items-center justify-start gap-2 pb-8">
          <div className="flex w-full justify-center items-center py-5 px-2">
            <Image
              alt={exercise.name || ""}
              className="flex"
              src={exercise.img || ""}
            />
          </div>
          <div className="flex w-full justify-center items-center py-8 px-4">
            <div className="flex flex-col items-center justify-center bg-white text-[#262626] rounded-2xl w-2/3 px-4 py-8 gap-8">
              <span className="font-bold text-lg">{exercise.name}</span>
              <div className="flex justify-evenly items-center text-sm w-full">
                <div className="flex gap-1 text-sm items-center">
                  <IoTimeSharp size={19} />
                  {exercise.value} {exercise.type}
                </div>
                <div className="flex gap-1 text-sm items-center">
                  <IoReloadCircle size={19} />
                  {exercise.series}
                  series
                </div>
              </div>
              <Divider />
              <p className="text-md px-2">{exercise.description}</p>
            </div>
          </div>
          <div className="flex w-full justify-center items-center py-8 px-4">
            <Button
              className="flex flex-col items-center justify-center  text-[#262626] rounded-3xl  py-6 px-10"
              color="primary"
              isDisabled={!!exercise.success}
              onPress={handleFinish}
            >
              <p className="font-bold text-lg">
                {exercise.success ? "Terminado" : "Finalizar"}
              </p>
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex w-full h-full items-center justify-center">
          <span>Ejercicio no encontrado!</span>
        </div>
      )}
    </section>
  );
}
