"use client";
import { Drawer } from "@/components/dashboard/drawer";
import { Card, CardFooter, Image, Button } from "@nextui-org/react";
import { CiEdit } from "react-icons/ci";
import { IoMdTimer } from "react-icons/io";
import { IoReloadOutline } from "react-icons/io5";
import CreateModal from "@/components/dashboard/imagenes/CreateModal";
import { useEffect, useState } from "react";
import { getImages } from "@/app/actions/exercicesConfig";

type InitData = {
  id: number;
  name: string;
  imageUrl: string | null;
  lastUse: Date | null;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;
};
const initData: InitData[] = [];

export default function ImagesPage() {
  const [data, setData] = useState(initData);
  console.log("🚀 ~ ImagesPage ~ data:", data);

  const getData = async () => {
    const res = await getImages();
    if (res.error) return console.log("Ocurrio un error!");
    if (!res.success) return 0;
    setData(res.success);
  };
  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="flex gap-1 bg-backgroundBack w-screen h-screen">
      <Drawer />
      <div className="flex flex-col gap-1 w-screen h-full">
        <div className="flex justify-center items-center gap-8 bg-backgroundComponents rounded-md">
          <h1 className="text-lg py-4">Listado de Imagenes</h1>
          <CreateModal refresh={getData} />
        </div>

        <div className="flex justify-between p-4 gap-4 h-full w-full flex-wrap">
          {data.map((item, i) => {
            return (
              <Card
                isFooterBlurred
                className="flex w-full max-w-sm h-[300px] col-span-12 sm:col-span-7"
              >
                <Image
                  removeWrapper
                  alt="Relaxing app background"
                  className="z-0 w-full h-full object-contain"
                  src={item.imageUrl || ""}
                />
                <CardFooter className="absolute bg-black/40 bottom-0 z-10 border-t-1 border-default-600 dark:border-default-100">
                  <div className="flex flex-grow gap-2 items-center">
                    <div className="flex flex-col">
                      <p className="text-tiny text-white/60">{item.name}</p>
                    </div>
                  </div>
                  <Button radius="full" size="sm" startContent={<CiEdit />}>
                    Editar
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const ejercicios = [
  {
    img: "https://i.pinimg.com/originals/67/c3/58/67c35807d2d249e637724d60ad07e400.gif",
    nombre: "Ejercicio ",
    descipcion: "",
    tipo: "Tiempo",
    valor: 3,
    repeticiones: 4,
  },
  {
    img: "https://i.pinimg.com/originals/67/c3/58/67c35807d2d249e637724d60ad07e400.gif",
    nombre: "Ejercicio ",
    descipcion: "",
    tipo: "Tiempo",
    valor: 3,
    repeticiones: 4,
  },
  {
    img: "https://i.pinimg.com/originals/67/c3/58/67c35807d2d249e637724d60ad07e400.gif",
    nombre: "Ejercicio ",
    descipcion: "",
    tipo: "Tiempo",
    valor: 3,
    repeticiones: 4,
  },
  {
    img: "https://i.pinimg.com/originals/67/c3/58/67c35807d2d249e637724d60ad07e400.gif",
    nombre: "Ejercicio ",
    descipcion: "",
    tipo: "Tiempo",
    valor: 3,
    repeticiones: 4,
  },
  {
    img: "https://i.pinimg.com/originals/67/c3/58/67c35807d2d249e637724d60ad07e400.gif",
    nombre: "Ejercicio ",
    descipcion: "",
    tipo: "Tiempo",
    valor: 3,
    repeticiones: 4,
  },
  {
    img: "https://i.pinimg.com/originals/67/c3/58/67c35807d2d249e637724d60ad07e400.gif",
    nombre: "Ejercicio ",
    descipcion: "",
    tipo: "Tiempo",
    valor: 3,
    repeticiones: 4,
  },
  {
    img: "https://i.pinimg.com/originals/67/c3/58/67c35807d2d249e637724d60ad07e400.gif",
    nombre: "Ejercicio ",
    descipcion: "",
    tipo: "Tiempo",
    valor: 3,
    repeticiones: 4,
  },
  {
    img: "https://i.pinimg.com/originals/67/c3/58/67c35807d2d249e637724d60ad07e400.gif",
    nombre: "Ejercicio ",
    descipcion: "",
    tipo: "Tiempo",
    valor: 3,
    repeticiones: 4,
  },
  {
    img: "https://i.pinimg.com/originals/67/c3/58/67c35807d2d249e637724d60ad07e400.gif",
    nombre: "Ejercicio ",
    descipcion: "",
    tipo: "Tiempo",
    valor: 3,
    repeticiones: 4,
  },
  {
    img: "https://i.pinimg.com/originals/67/c3/58/67c35807d2d249e637724d60ad07e400.gif",
    nombre: "Ejercicio ",
    descipcion: "",
    tipo: "Tiempo",
    valor: 3,
    repeticiones: 4,
  },
  {
    img: "https://i.pinimg.com/originals/67/c3/58/67c35807d2d249e637724d60ad07e400.gif",
    nombre: "Ejercicio ",
    descipcion: "",
    tipo: "Tiempo",
    valor: 3,
    repeticiones: 4,
  },
];
