"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@nextui-org/button";
import { MdAccountCircle } from "react-icons/md";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  useDisclosure,
} from "@nextui-org/react";
import { toast } from "react-toastify";
import { IoMdExit } from "react-icons/io";

import { getRoutines } from "./actions/routines";
import { verifyToken } from "./actions/users";

import { RoutineType } from "@/types";
import CompleteProfile from "@/components/CompleteProfile";
import { setUser, deleteUser, setSessionToken, RootState } from "@/lib/redux";

const initRoutines: RoutineType | null = null;

export default function Home() {
  const [date, setDate] = useState(new Date());
  const [routine, setRoutine] = useState(initRoutines);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.user);
  const sessionToken = useSelector((state: RootState) => state.sessionToken);

  const handleChangeNextDay = () => {
    const nextDay = new Date(date);

    nextDay.setDate(date.getDate() + 1);
    setDate(nextDay);
  };

  const handleChangePreviousDay = () => {
    const previousDay = new Date(date);

    previousDay.setDate(date.getDate() - 1);
    setDate(previousDay);
  };

  const findRoutine = async () => {
    if (!user || !date) return;
    setLoading(true);
    const res = await getRoutines(user.id, date);

    setLoading(false);
    if (res.error) return toast.error(res.error);
    if (res.success) {
      setRoutine(res.success);
    }
  };

  useEffect(() => {
    if (user) {
      findRoutine();
    }
  }, [date, user]);

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

  if (user && !user.wasEdited) {
    return (
      <CompleteProfile
        refresh={() => verToken(sessionToken || "")}
        user={user}
      />
    );
  }

  return (
    <section className="flex flex-col items-center justify-center gap-4 h-screen overflow-y-auto">
      <div className="flex w-full items-center justify-between gap-2 px-1 sm:px-4 mt-8">
        <div className="flex flex-col ms-2 sm:ms-0 items-start">
          <h1 className={"text-2xl font-bold text-primary"}>Hola, Lautaro</h1>
          <span>Es hora de desafiar tus límites.</span>
        </div>
        <div className="flex gap-0 sm:gap-2">
          <Button
            isIconOnly
            as={"a"}
            className="bg-transparent text-primary"
            href="/profile"
            size="sm"
          >
            <MdAccountCircle size={24} />
          </Button>
          <LogoutModal
            onPress={() => {
              dispatch(deleteUser());
              router.push("/login");
            }}
          />
        </div>
      </div>

      <div className="flex w-full items-center justify-between gap-2 px-1 sm:px-4 mt-8">
        <div className="flex items-start">
          <Button
            className="bg-transparent text-default-900 font-bold"
            color="primary"
            startContent={<IoIosArrowBack />}
            onPress={handleChangePreviousDay}
          >
            Anterior
          </Button>
        </div>
        <div className="flex">
          {date.toString().split(" ")[1]} {date.toString().split(" ")[2]}
        </div>
        <div className="flex items-start">
          <Button
            className="bg-transparent text-default-900 font-bold"
            color="primary"
            endContent={<IoIosArrowForward />}
            onPress={handleChangeNextDay}
          >
            Siguiente
          </Button>
        </div>
      </div>
      <div className="flex w-full h-px bg-primary" />

      {loading ? (
        <div className="flex w-full h-full items-center justify-center">
          <Spinner />
        </div>
      ) : routine && routine.exercises.length > 0 ? (
        <div className="flex flex-col w-full h-full items-center justify-start gap-2 pb-8">
          {routine.exercises
            .filter((ex) => !ex.success)
            .map((ex, i) => {
              return (
                <button
                  key={ex.id}
                  className="bg-primary w-full h-[150px] px-8 items-center"
                  onClick={() => router.push(`/exercise/${ex.id}`)}
                >
                  <div className="flex w-full h-[135px] rounded-2xl bg-backgroundComponents overflow-hidden justify-between hover:opacity-90">
                    <div className="flex flex-col w-full items-center justify-center">
                      <span className="flex text-2xl font-bold">{i + 1}</span>
                      <span className="flex text-md font-semibold">
                        {ex.name}
                      </span>
                    </div>
                    <div className="flex  h-[135px] items-center justify-end">
                      <img
                        alt={ex.name || ""}
                        className="z-10 object-contain rounded-none w-60 min-h-full"
                        src={ex.img || ""}
                      />
                    </div>
                  </div>
                </button>
              );
            })}
          {routine.exercises.filter((ex) => ex.success).length > 0 && (
            <div className="flex my-4">
              <h2>Terminados</h2>
            </div>
          )}
          {routine.exercises
            .filter((ex) => ex.success)
            .map((ex, i) => {
              return (
                <button
                  key={ex.id}
                  className="bg-primary w-full h-[150px] px-8 items-center"
                  onClick={() => router.push(`/exercise/${ex.id}`)}
                >
                  <div className="flex w-full h-[135px] rounded-2xl bg-backgroundComponents overflow-hidden justify-between hover:opacity-90">
                    <div className="flex flex-col w-full items-center justify-center">
                      <span className="flex text-2xl font-bold">{i + 1}</span>
                      <span className="flex text-md font-semibold">
                        {ex.name}
                      </span>
                    </div>
                    <div className="flex  h-[135px] items-center justify-end">
                      <img
                        alt={ex.name || ""}
                        className="z-10 object-contain rounded-none w-60 min-h-full"
                        src={ex.img || ""}
                      />
                    </div>
                  </div>
                </button>
              );
            })}
        </div>
      ) : (
        <div className="flex w-full h-full items-center justify-center">
          <span>No tienes rutinas para hoy!</span>
        </div>
      )}
    </section>
  );
}

function LogoutModal({ onPress }: { onPress: Function }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button
        className="bg-transparent text-primary"
        size="sm"
        onPress={onOpen}
      >
        <IoMdExit size={24} />
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Cerrar sesion
              </ModalHeader>
              <ModalBody>
                <p>Vas a cerrar la sesion de tu cuenta</p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancelar
                </Button>
                <Button
                  className="text-default-100"
                  color="primary"
                  onPress={() => {
                    onPress();
                    onClose();
                  }}
                >
                  Continuar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
