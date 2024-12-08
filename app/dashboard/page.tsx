"use client";
import { useEffect, useState } from "react";
import {
  Button,
  DatePicker,
  Divider,
  Spinner,
  Input,
  useDisclosure,
  DateValue,
} from "@nextui-org/react";
import { IoMdClose } from "react-icons/io";
import { MdEmail } from "react-icons/md";
import { IoMdArrowRoundBack } from "react-icons/io";
import { toast } from "react-toastify";
import { GiHamburgerMenu } from "react-icons/gi";

import { ExerciseType, RoutineType, UserType } from "@/types";
import { getAUserRoutine, getUsers } from "@/app/actions/users";
import { Drawer } from "@/components/dashboard/drawer";
import TableRoutines from "@/components/dashboard/tableRoutines";
import CreateExerciseRoutine from "@/components/dashboard/CreateExerciseRoutine";

const initData: UserType[] = [];
const initRoutineData: RoutineType | null = null;
const initEdit: ExerciseType | null = null;
const initUserId: number | null = null;
const searchUserInit: string | null = null;

export default function DashboardPage() {
  const [users, setUsers] = useState(initData);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [routine, setRoutine] = useState(initRoutineData);
  const [edit, setEdit] = useState(initEdit);
  const [userId, setUserId] = useState(initUserId);
  const [loading, setLoading] = useState(false);
  const [searchUser, setSearchUser] = useState(searchUserInit);
  const { isOpen, onOpenChange } = useDisclosure();

  const getUserRoutine = async (date?: Date) => {
    setLoading(true);
    try {
      if (!userId) return;
      const res = await getAUserRoutine(userId, date || selectedDate);

      if (res.error) {
        toast.error(res.error, {
          position: "top-right",
          autoClose: 2500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });

        return;
      }
      if (res.success) setRoutine(res.success);
      setLoading(false);
    } catch (error) {
      toast.error("Ocurrio un error", {
        position: "top-right",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });

      return;
    }
  };

  const getUsersList = async (search: string | null) => {
    const res = await getUsers(search);

    if (res.error) {
      toast.error(res.error, {
        position: "top-right",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });

      return;
    }
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
        <Drawer isOpen={isOpen} />
        <div className="flex flex-col gap-1 w-screen h-full">
          <div className="flex justify-between items-center gap-8 px-2 bg-backgroundComponents rounded-md">
            <h1 className="text-sm lg:text-lg py-4">Listado de Rutinas</h1>
            <div className="flex">
              <Button
                isIconOnly
                className="text-black"
                color="primary"
                onPress={onOpenChange}
              >
                <GiHamburgerMenu />
              </Button>
            </div>
          </div>
          <div className="flex flex-col my-2 gap-2 justify-center items-center md:my-4 relative">
            <div className="flex md:absolute left-4">
              <Button
                as={"a"}
                href="/dashboard"
                startContent={<IoMdArrowRoundBack />}
              >
                Volver
              </Button>
            </div>
            <DatePicker
              className="max-w-[284px]"
              label="Dia de entrenamiento"
              onChange={(value: DateValue | null) => {
                if (value) {
                  const { day, month, year } = value;
                  const date = new Date();

                  date.setDate(day);
                  date.setMonth(month - 1);
                  date.setFullYear(year);
                  setSelectedDate(date);
                }
              }}
            />
          </div>
          <Divider />
          {loading ? (
            <div className="flex justify-center items-center h-full w-full">
              <Spinner />
            </div>
          ) : (
            <div className="flex flex-col justify-start items-center p-0 lg:p-4 gap-4 h-full w-full flex-wrap">
              {routine && (
                <CreateExerciseRoutine
                  edit={edit}
                  refresh={() => getUserRoutine()}
                  routineId={routine?.id}
                  setEdit={setEdit}
                />
              )}
              {routine?.exercises[0] && (
                <TableRoutines
                  data={routine.exercises.map(
                    (
                      {
                        img,
                        name,
                        type,
                        value,
                        series,
                        description,
                        success,
                        ...data
                      },
                      i
                    ) => ({
                      id: i + 1,
                      orden: i + 1,
                      gif: img,
                      nombre: name,
                      cantidad: `${value} ${type}`,
                      Series: series,
                      descripcion: description,
                      terminado: success,
                      actions: {
                        edit: () =>
                          setEdit({
                            img,
                            name,
                            type,
                            value,
                            series,
                            description,
                            success,
                            ...data,
                          }),
                      },
                    })
                  )}
                  setEdit={setEdit}
                />
              )}
            </div>
          )}
        </div>
      </div>
    );

  return (
    <div className="flex gap-1 bg-backgroundBack w-screen h-screen">
      <Drawer isOpen={isOpen} />
      <div className="flex flex-col gap-1 w-screen h-full">
        <div className="flex relative justify-between px-2 md:px-5 items-center gap-8 bg-backgroundComponents rounded-md">
          <h1 className="text-sm md:text-lg py-4">Selecciona un usuario</h1>
          <div className="flex md:hidden py-4">
            <Button
              isIconOnly
              className="text-black"
              color="primary"
              onPress={onOpenChange}
            >
              <GiHamburgerMenu />
            </Button>
          </div>
          <Input
            className="hidden md:flex max-w-sm"
            endContent={
              <div className="flex gap-2">
                {searchUser && searchUser.length > 0 && (
                  <Button
                    isIconOnly
                    className="rounded-full text-default-100 font-bold"
                    color="primary"
                    size="sm"
                    onPress={() => {
                      setSearchUser(null);
                      getUsersList(null);
                    }}
                  >
                    <IoMdClose />
                  </Button>
                )}
                <Button
                  className="text-default-100 font-bold"
                  color="primary"
                  size="sm"
                  onPress={() => getUsersList(searchUser)}
                >
                  Buscar
                </Button>
              </div>
            }
            placeholder="Nombre del usuario"
            type="text"
            value={searchUser || ""}
            onChange={({ target }) => setSearchUser(target.value)}
          />
        </div>

        <div className="flex md:hidden">
          <Input
            className="flex w-full "
            endContent={
              <div className="flex gap-2">
                {searchUser && searchUser.length > 0 && (
                  <Button
                    isIconOnly
                    className="rounded-full text-default-100 font-bold"
                    color="primary"
                    size="sm"
                    onPress={() => {
                      setSearchUser(null);
                      getUsersList(null);
                    }}
                  >
                    <IoMdClose />
                  </Button>
                )}
                <Button
                  className="text-default-100 font-bold"
                  color="primary"
                  size="sm"
                  onPress={() => getUsersList(searchUser)}
                >
                  Buscar
                </Button>
              </div>
            }
            placeholder="Nombre del usuario"
            type="text"
            value={searchUser || ""}
            onChange={({ target }) => setSearchUser(target.value)}
          />
        </div>
        <div className="flex justify-evenly items-start p-4 gap-4 h-full w-full flex-wrap">
          {users.map((item, i) => {
            return (
              <Button
                key={i}
                as={"a"}
                className="flex w-96 h-24"
                href={`/dashboard?user=${item.id}`}
              >
                <div className="flex w-full">
                  <div className="flex flex-col gap-2 p-2">
                    <p className="text-lg text-start">{item.name}</p>
                    <div className="flex flex-col w-full gap-2">
                      <div className=" flex gap-2 items-center">
                        <MdEmail />
                        {item.email}
                      </div>
                    </div>
                  </div>
                </div>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
