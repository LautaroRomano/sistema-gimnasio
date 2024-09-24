"use client";
import { useEffect, useState } from "react";
import { Drawer } from "@/components/dashboard/drawer";
import { Card, CardFooter, Image, Button, CardBody, Calendar } from "@nextui-org/react";
import { IoMdTimer } from "react-icons/io";
import { UserType } from "@/types";
import { getUsers } from "@/app/actions/users";
import { MdEmail } from "react-icons/md";

const initData: UserType[] = [];
const initUserId: Number | null = null;

export default function DashboardPage() {
  const [data, setData] = useState(initData);
  const [userId, setUserId] = useState(initUserId);

  const getData = async (search: string | null) => {
    const res = await getUsers(search);
    if (res.error) return console.log(res.error);
    if (res.success) setData(res.success);
  };
  const getUserId = () => {
    const searchParams = new URLSearchParams(window.location.search);
    const id = searchParams.get("user");
    if (id) setUserId(parseInt(id));
  };

  useEffect(() => {
    getData(null);
    getUserId();
  }, []);

  useEffect(() => {
    console.log("User ID:", userId);
  }, [userId]);

  if (userId)
    return (
      <div className="flex gap-1 bg-backgroundBack w-screen h-screen">
        <Drawer />
        <div className="flex flex-col gap-1 w-screen h-full">
          <div className="flex justify-center items-center gap-8 bg-backgroundComponents rounded-md">
            <h1 className="text-lg py-4">Listado de Rutinas</h1>
          </div>
          <div className="flex justify-center items-center">
          <Calendar aria-label="Date (No Selection)" />
          </div>
          <div className="flex justify-between p-4 gap-4 h-full w-full flex-wrap">
            {data.map((item, i) => {
              return (
                <Card isFooterBlurred className="flex w-full max-w-sm h-36">
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

  return (
    <div className="flex gap-1 bg-backgroundBack w-screen h-screen">
      <Drawer />
      <div className="flex flex-col gap-1 w-screen h-full">
        <div className="flex justify-center items-center gap-8 bg-backgroundComponents rounded-md">
          <h1 className="text-lg py-4">Selecciona un usuario</h1>
        </div>

        <div className="flex justify-between p-4 gap-4 h-full w-full flex-wrap">
          {data.map((item, i) => {
            return (
              <Card isFooterBlurred className="flex w-full max-w-sm h-36">
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
