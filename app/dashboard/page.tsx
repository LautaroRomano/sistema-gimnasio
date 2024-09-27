"use client";
import { useEffect, useState } from "react";
import { Drawer } from "@/components/dashboard/drawer";
import {
  Card,
  CardFooter,
  Button,
  CardBody,
  DatePicker,
  Spacer,
  Divider,
  Spinner,
} from "@nextui-org/react";
import { IoMdTimer } from "react-icons/io";
import { RoutineType, UserType } from "@/types";
import { getAUserRoutine, getUsers } from "@/app/actions/users";
import { MdEmail } from "react-icons/md";
import { IoMdArrowRoundBack } from "react-icons/io";
import TableRoutines from "@/components/dashboard/tableRoutines";
import CreateExerciseRoutine from "@/components/dashboard/CreateExerciseRoutine";

const initData: UserType[] = [];
const initRoutineData: RoutineType | null = null;
const initUserId: number | null = null;

export default function DashboardPage() {
  const [users, setUsers] = useState(initData);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [routine, setRoutine] = useState(initRoutineData);
  const [userId, setUserId] = useState(initUserId);
  const [loading, setLoading] = useState(false);

  const getUserRoutine = async (date?: Date) => {
    setLoading(true);
    try {
      if (!userId) throw "Se nesecita un usuario";
      const res = await getAUserRoutine(userId, date || selectedDate);
      if (res.error) throw res.error;
      if (res.success) setRoutine(res.success);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const getUsersList = async (search: string | null) => {
    const res = await getUsers(search);
    if (res.error) return console.log(res.error);
    if (res.success) setUsers(res.success);
  };

  const getUserId = () => {
    const searchParams = new URLSearchParams(window.location.search);
    const id = searchParams.get("user");
    if (id) setUserId(parseInt(id));
  };

  useEffect(() => {
    getUserRoutine();
  }, [selectedDate]);

  useEffect(() => {
    getUsersList(null);
    getUserId();
  }, []);

  useEffect(() => {
    getUserRoutine(new Date());
  }, [userId]);

  if (userId)
    return (
      <div className="flex gap-1 bg-backgroundBack w-screen h-screen">
        <Drawer />
        <div className="flex flex-col gap-1 w-screen h-full">
          <div className="flex justify-center items-center gap-8 bg-backgroundComponents rounded-md">
            <h1 className="text-lg py-4">Listado de Rutinas</h1>
          </div>
          <div className="flex justify-center items-center my-4 relative">
            <div className="absolute left-4">
              <Button
                startContent={<IoMdArrowRoundBack />}
                as={"a"}
                href="/dashboard"
              >
                Volver
              </Button>
            </div>
            <DatePicker
              label="Dia de entrenamiento"
              className="max-w-[284px]"
              onChange={({ day, month, year }) => {
                const date = new Date();
                date.setDate(day);
                date.setMonth(month-1);
                date.setFullYear(year);
                setSelectedDate(date);
              }}
            />
          </div>
          <Divider />
          {loading ? (
            <div className="flex justify-center items-center h-full w-full">
              <Spinner />
            </div>
          ) : (
            <div className="flex flex-col justify-start items-center p-4 gap-4 h-full w-full flex-wrap">
              {routine && (
                <CreateExerciseRoutine
                  refresh={() => getUserRoutine()}
                  routineId={routine?.id}
                />
              )}
              {routine?.exercises[0] && (
                <TableRoutines
                  data={routine.exercises.map(
                    ({
                      id,
                      img,
                      name,
                      type,
                      value,
                      series,
                      description,
                      success,
                    }) => ({
                      id,
                      gif: img,
                      nombre: name,
                      cantidad: `${value} ${type}`,
                      Series: series,
                      descripcion: description,
                      terminado: success,
                    })
                  )}
                />
              )}
            </div>
          )}
        </div>
      </div>
    );

  return (
    <div className="flex gap-1 bg-backgroundBack w-screen h-screen">
      <Drawer />
      <div className="flex flex-col gap-1 w-screen h-full">
        <div className="flex justify-center items-center gap-8 bg-backgroundComponents rounded-md">
          <h1 className="text-lg py-4">Selecciona un usuario</h1>
        </div>

        <div className="flex justify-evenly p-4 gap-4 h-full w-full flex-wrap">
          {users.map((item, i) => {
            return (
              <Card
                isFooterBlurred
                className="flex w-full max-w-sm h-36"
                key={i}
              >
                <CardBody>
                  <div className="flex flex-col gap-2 p-2">
                    <p className="text-lg ">{item.name}</p>
                    <div className="flex flex-col w-full gap-2">
                      <div className=" flex gap-2 items-center">
                        <MdEmail />
                        {item.email}
                      </div>
                    </div>
                  </div>
                </CardBody>
                <CardFooter className="absolute bg-black/40 bottom-0 z-10 border-t-1 border-default-600 dark:border-default-100">
                  <div className="flex w-full justify-between">
                    <Button
                      as={"a"}
                      href={`/dashboard?user=${item.id}`}
                      className="flex"
                      radius="full"
                      size="sm"
                      startContent={<IoMdTimer />}
                    >
                      Rutinas
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
