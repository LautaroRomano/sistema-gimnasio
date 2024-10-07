"use client";
import { useEffect, useState } from "react";
import {
  Card,
  CardFooter,
  Image,
  Button,
  Spinner,
  Input,
} from "@nextui-org/react";
import { CiEdit } from "react-icons/ci";
import { IoMdClose, IoMdTimer } from "react-icons/io";
import { IoReloadOutline } from "react-icons/io5";

import { Drawer } from "@/components/dashboard/drawer";
import CreateModal from "@/components/dashboard/ejercicios/CreateModal";
import { ExerciseType } from "@/types";
import { getExercises } from "@/app/actions/exercicesConfig";
import { toast } from "react-toastify";

const initData: ExerciseType[] = [];
const initEdit: ExerciseType | null = null;
const searchInit: string | null = null;

export default function DashboardPage() {
  const [data, setData] = useState(initData);
  const [edit, setEdit] = useState(initEdit);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState(searchInit);

  const getData = async (search: string | null) => {
    setLoading(true);
    const res = await getExercises(search);

    setLoading(false);
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
    if (!res.success) {
      toast.error("Ocurrió un error inesperado", {
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
    setData(res.success);
  };

  useEffect(() => {
    getData(null);
  }, []);

  return (
    <div className="flex gap-1 bg-backgroundBack w-screen h-screen relative">
      <Drawer />
      <CreateModal refresh={getData} edit={edit} setEdit={setEdit} />
      <div className="flex flex-col gap-1 w-screen h-full">
        <div className="flex justify-between px-5 items-center gap-8 bg-backgroundComponents rounded-md relative">
          <h1 className="flex text-lg py-4">Plantillas de Ejercicios</h1>
          <Input
            className="flex max-w-sm"
            endContent={
              <div className="flex gap-2">
                {search && search.length > 0 && (
                  <Button
                    isIconOnly
                    className="rounded-full"
                    size="sm"
                    onPress={() => {
                      setSearch(null);
                      getData(null);
                    }}
                  >
                    <IoMdClose />
                  </Button>
                )}
                <Button
                  color="primary"
                  size="sm"
                  onPress={() => getData(search)}
                >
                  Buscar
                </Button>
              </div>
            }
            placeholder="Nombre"
            type="text"
            value={search || ""}
            onChange={({ target }) => setSearch(target.value)}
          />
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <Spinner size="lg" />
          </div>
        ) : (
          <div className="flex justify-evenly p-4 gap-4 h-full w-full flex-wrap">
            {data.length > 0 ? (
              data.map((item) => {
                return (
                  <Card
                    key={item.id}
                    isFooterBlurred
                    className="flex w-full max-w-sm h-[300px] col-span-12 sm:col-span-7"
                  >
                    <Image
                      removeWrapper
                      alt="Relaxing app background"
                      className="z-0 w-full h-full object-contain"
                      src={item.img || ""}
                    />
                    <CardFooter className="absolute bg-black/40 bottom-0 z-10 border-t-1 border-default-600 dark:border-default-100">
                      <div className="flex flex-grow gap-2 items-center">
                        <div className="flex flex-col justify-start items-start">
                          <p className="text-sm text-white">{item.name}</p>
                          <p className="text-tiny text-white/60">
                            {item.description}
                          </p>
                          <div className="flex w-full gap-6">
                            <div className="text-tiny flex gap-2">
                              <IoMdTimer />
                              {item.value}
                            </div>
                            <div className="text-tiny flex gap-2">
                              <IoReloadOutline />
                              {item.series}
                            </div>
                          </div>
                        </div>
                      </div>
                      <Button
                        radius="full"
                        size="sm"
                        startContent={<CiEdit />}
                        onPress={() => setEdit(item)}
                      >
                        Editar
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })
            ) : (
              <div className="flex items-center justify-center">
                <h4>No hay ejercicios para mostrar</h4>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
