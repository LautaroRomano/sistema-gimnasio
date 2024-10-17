"use client";
import { useEffect, useState } from "react";
import {
  Card,
  CardFooter,
  Button,
  CardBody,
  Spinner,
  Input,
  useDisclosure,
} from "@nextui-org/react";
import { CiEdit } from "react-icons/ci";
import { IoMdTimer } from "react-icons/io";
import { IoMdCreate } from "react-icons/io";
import { MdEmail } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { toast } from "react-toastify";
import { GiHamburgerMenu } from "react-icons/gi";

import { getUsers } from "@/app/actions/users";
import { UserType } from "@/types";
import CreateModal from "@/components/dashboard/usuarios/CreateModal";
import { Drawer } from "@/components/dashboard/drawer";

const initData: UserType[] = [];
const initEditUser: UserType | null = null;
const searchUserInit: string | null = null;

export default function DashboardPage() {
  const [data, setData] = useState(initData);
  const [editUser, setEditUser] = useState(initEditUser);
  const [loading, setLoading] = useState(false);
  const [searchUser, setSearchUser] = useState(searchUserInit);
  const { isOpen, onOpenChange } = useDisclosure();

  const getData = async (search: string | null) => {
    setLoading(true);
    const res = await getUsers(search);

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
    if (res.success) setData(res.success);
  };

  useEffect(() => {
    getData(null);
  }, []);

  return (
    <div className="flex gap-1 bg-backgroundBack w-screen h-screen relative">
      <Drawer isOpen={isOpen} />
      <CreateModal
        editUser={editUser}
        refresh={getData}
        setEditUser={setEditUser}
      />
      <div className="flex flex-col gap-1 w-screen h-full">
        <div className="flex justify-between px-5 items-center gap-8 bg-backgroundComponents rounded-md relative">
          <h1 className="text-lg py-4">Listado de Usuarios</h1>
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
                    className="rounded-full"
                    size="sm"
                    onPress={() => {
                      setSearchUser(null);
                      getData(null);
                    }}
                  >
                    <IoMdClose />
                  </Button>
                )}
                <Button
                  className="text-default-100 font-bold"
                  color="primary"
                  size="sm"
                  onPress={() => getData(searchUser)}
                >
                  Buscar
                </Button>
              </div>
            }
            placeholder="Nombre, Email o dni"
            type="text"
            value={searchUser || ""}
            onChange={({ target }) => setSearchUser(target.value)}
          />
        </div>

        <div className="flex md:hidden">
          <Input
            endContent={
              <div className="flex gap-2">
                {searchUser && searchUser.length > 0 && (
                  <Button
                    isIconOnly
                    className="rounded-full"
                    size="sm"
                    onPress={() => {
                      setSearchUser(null);
                      getData(null);
                    }}
                  >
                    <IoMdClose />
                  </Button>
                )}
                <Button
                  className="text-default-100 font-bold"
                  color="primary"
                  size="sm"
                  onPress={() => getData(searchUser)}
                >
                  Buscar
                </Button>
              </div>
            }
            placeholder="Nombre, Email o dni"
            type="text"
            value={searchUser || ""}
            onChange={({ target }) => setSearchUser(target.value)}
          />
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <Spinner size="lg" />
          </div>
        ) : (
          <div className="flex justify-evenly p-4 gap-4 h-full w-full flex-wrap overflow-y-auto">
            {data.length > 0 ? (
              data.map((item) => {
                return (
                  <Card
                    key={item.id}
                    isFooterBlurred
                    className="flex w-full max-w-sm h-64"
                  >
                    <CardBody>
                      <div className="flex flex-col gap-2 p-2">
                        <p className="text-lg ">{item.name}</p>
                        <div className="flex flex-col w-full gap-2">
                          {item.phone && (
                            <div className=" flex gap-2 items-center">
                              <FaPhoneAlt />
                              {item.phone}
                            </div>
                          )}
                          <div className=" flex gap-2 items-center">
                            <MdEmail />
                            {item.email}
                          </div>
                          {item.updatedAt && (
                            <div className=" flex gap-2 items-center">
                              <IoMdCreate />
                              {new Date(item.updatedAt).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardBody>
                    <CardFooter className="absolute bg-black/40 bottom-0 z-10 border-t-1 border-default-600 dark:border-default-100">
                      <div className="flex w-full justify-between">
                        <Button
                          as={"a"}
                          className="flex"
                          href={`/dashboard?user=${item.id}`}
                          radius="full"
                          size="sm"
                          startContent={<IoMdTimer />}
                        >
                          Rutinas
                        </Button>

                        <Button
                          className="flex text-default-100 font-bold"
                          color="primary"
                          radius="full"
                          size="sm"
                          startContent={<CiEdit />}
                          onPress={() => setEditUser(item)}
                        >
                          Editar
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                );
              })
            ) : (
              <div className="flex items-center justify-center">
                <h4>No hay usuarios para mostrar</h4>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
