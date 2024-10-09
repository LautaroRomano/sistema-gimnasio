"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { verifyToken } from "../../actions/users";
import { useDispatch, useSelector } from "react-redux";
import { setUser, deleteUser, setSessionToken, RootState } from "@/lib/redux";
import { Button } from "@nextui-org/button";
import { Spinner, Image, Divider } from "@nextui-org/react";
import { ExerciseType } from "@/types";
import { toast } from "react-toastify";
import { finish, getExercise } from "../../actions/exercises";
import { useParams } from "next/navigation";
import { IoIosArrowBack } from "react-icons/io";
import { IoReloadCircle, IoTimeSharp } from "react-icons/io5";

const initExercise: ExerciseType | null = null;

export default function Home() {
  const [exercise, setExercise] = useState(initExercise);
  const [loading, setLoading] = useState(false);
  const { exerciseId } = useParams();

  const router = useRouter();
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.user);

  const findExercise = async () => {
    if (!user) return;
    if (Array.isArray(exerciseId) || typeof exerciseId !== "string") return;
    setLoading(true);
    const res = await getExercise(parseInt(exerciseId));
    setLoading(false);
    if (res.error) return toast.error(res.error);
    if (res.success) {
      setExercise(res.success);
    }
  };

  useEffect(() => {
    findExercise();
  }, [user]);

  const verToken = async (token: string) => {
    const res = await verifyToken(token);

    if (!res.success) {
      dispatch(deleteUser());
      router.push("/login");
    } else {
      dispatch(setUser({ user: res.success }));
    }
    if (res?.success?.isAdmin) {
      router.push("/dashboard");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("sessionToken");
    if (token) {
      dispatch(setSessionToken(token));
      verToken(token);
    } else {
      router.push("/login");
    }
  }, []);

  const handleFinish = async () => {
    if (!exercise?.id) return;
    const res = await finish(exercise.id);

    if (res.error) return toast.error(res.error);

    toast.success("Finalizado con exito!");

    setTimeout(() => {
      router.push("/");
    }, 1000);
  };

  return (
    <section className="flex flex-col items-center justify-center gap-4 h-screen overflow-y-auto">
      <div className="flex w-full items-center justify-between gap-2 px-4 mt-8">
        <div className="flex flex-col items-start">
          <Button
            startContent={
              <strong className="text-primary-500">
                <IoIosArrowBack size={19} />
              </strong>
            }
            className="bg-transparent"
            color="primary"
            onPress={() => router.push("/")}
          >
            <strong>{exercise?.name}</strong>
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex w-full h-full items-center justify-center">
          <Spinner />
        </div>
      ) : exercise ? (
        <div className="flex flex-col w-full h-full items-center justify-start gap-2 pb-8">
          <div className="flex w-full justify-center items-center bg-primary-500 py-5 px-2">
            <Image
              width={320}
              src={exercise.img || ""}
              alt={exercise.name || ""}
              className="flex"
            />
          </div>
          <div className="flex w-full justify-center items-center py-8 px-4">
            <div className="flex flex-col items-center justify-center bg-white text-[#262626] w-[320px] rounded-2xl px-4 py-8 gap-8">
              <span className="font-bold text-lg">
                {exercise.name} Plancha con giro de cadera
              </span>
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
              <Divider/>
                <p className="text-md px-2">{exercise.description}</p>
            </div>
          </div>
          <div className="flex w-full justify-center items-center py-8 px-4">
            <Button
              className="flex flex-col items-center justify-center bg-white text-[#262626] rounded-3xl  py-6 px-10"
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
