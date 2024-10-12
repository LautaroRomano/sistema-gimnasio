import React, { ChangeEvent, useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
} from "@nextui-org/react";
import { IoMdAdd } from "react-icons/io";
import { toast } from "react-toastify";

import { UserType } from "@/types";
import { createUser } from "@/app/actions/users";

const initData: UserType = {
  id: 0,
  dni: "",
  name: "",
  email: "",
  isAdmin: false,
  createdAt: new Date(),
  password: "",
  phone: "",
};

type ErrorData = string;
const errorDataInit: ErrorData = "";

export default function CreateModal({
  refresh,
  editUser,
  setEditUser,
}: {
  refresh: Function;
  editUser: UserType | null;
  setEditUser: Function;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [data, setData] = useState(initData);
  const [error, setError] = useState(errorDataInit);

  const handleChange = ({
    target,
  }: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = target;

    setData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!data.name || data.name.length === 0) return setError("name");
    if (!data.dni || data.dni.length === 0) return setError("dni");
    if (!data.email || data.email.length === 0) return setError("email");

    const res = await createUser(data);

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
    if (res.success) {
      setData(initData);
      refresh();
      onOpenChange();
    }
  };

  useEffect(() => {
    if (editUser?.id) {
      setData(editUser);
      onOpen();
    }
  }, [editUser]);

  useEffect(() => {
    if (!isOpen) {
      setEditUser(null);
      setData(initData);
    }
  }, [isOpen]);

  return (
    <>
      <div className="absolute bottom-5 right-5">
        <Button
          className="text-default-100 font-bold"
          color="primary"
          size="lg"
          startContent={<IoMdAdd />}
          onPress={onOpen}
        >
          Agregar nuevo
        </Button>
      </div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {data?.id ? "Editar usuario" : "Crear usuario"}
              </ModalHeader>
              <ModalBody>
                <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
                  <Input
                    errorMessage="Debe completar este campo"
                    isInvalid={error === "name"}
                    label="Nombre"
                    name="name"
                    type="text"
                    value={data.name || ""}
                    variant="bordered"
                    onChange={handleChange}
                  />
                  <Input
                    errorMessage="Debe completar este campo"
                    isDisabled={!!data?.id}
                    isInvalid={error === "dni"}
                    label="DNI"
                    name="dni"
                    type="text"
                    value={data.dni || ""}
                    variant="bordered"
                    onChange={handleChange}
                  />
                  <Input
                    errorMessage="Debe completar este campo"
                    isInvalid={error === "email"}
                    label="Email"
                    name="email"
                    type="text"
                    value={data.email || ""}
                    variant="bordered"
                    onChange={handleChange}
                  />
                  <Input
                    errorMessage="Debe completar este campo"
                    isInvalid={error === "password"}
                    label="Contraseña"
                    name="password"
                    type="password"
                    value={data.password}
                    variant="bordered"
                    onChange={handleChange}
                  />
                  <Input
                    label="Numero de telefono"
                    name="phone"
                    type="text"
                    value={data.phone + ""}
                    variant="bordered"
                    onChange={handleChange}
                  />
                  {/* <select
                    name="isAdmin"
                    value={data.isAdmin + ""}
                    onChange={handleChange}
                    className="outline-none border-0 bg-transparent text-default-400 text-small"
                  >
                    <option value="true">Si</option>
                    <option value="false">No</option>
                  </select> */}
                </form>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  size="sm"
                  variant="light"
                  onPress={onClose}
                >
                  Cancelar
                </Button>
                <Button
                  className="text-default-100 font-bold"
                  color="primary"
                  size="sm"
                  onPress={() => {
                    handleSubmit();
                  }}
                >
                  Guardar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
