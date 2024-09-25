"use client";
import { useEffect, useState } from "react";
import { Drawer } from "@/components/dashboard/drawer";
import {
  Card,
  CardFooter,
  Image,
  Button,
} from "@nextui-org/react";
import { CiEdit } from "react-icons/ci";
import { IoMdTimer } from "react-icons/io";
import { IoReloadOutline } from "react-icons/io5";
import CreateModal from '@/components/dashboard/ejercicios/CreateModal'
import { ExerciseType } from "@/types";
import { getExercises } from "@/app/actions/exercicesConfig";

const initData:ExerciseType[] = []

export default function DashboardPage() {
  const [data,setData] = useState(initData);
  
  const getData = async(search:string|null)=>{
    const res = await getExercises(search);
    if(res.error) return console.log(res.error);
    if(res.success) setData(res.success)
  }

  useEffect(()=>{
    getData(null);
  },[])

  return (
    <div className="flex gap-1 bg-backgroundBack w-screen h-screen">
      <Drawer />
      <div className="flex flex-col gap-1 w-screen h-full">
        <div className="flex justify-center items-center gap-8 bg-backgroundComponents rounded-md">
          <h1 className="text-lg py-4">Listado de Ejercicios</h1>
          <CreateModal refresh={getData}/>
        </div>

        <div className="flex justify-evenly p-4 gap-4 h-full w-full flex-wrap">
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
                  src={item.img || ''}
                />
                <CardFooter className="absolute bg-black/40 bottom-0 z-10 border-t-1 border-default-600 dark:border-default-100">
                  <div className="flex flex-grow gap-2 items-center">
                    <div className="flex flex-col">
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
                          {item.repetitions} rep
                        </div>
                      </div>
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

