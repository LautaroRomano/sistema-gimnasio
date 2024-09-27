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
  Textarea,
} from "@nextui-org/react";
import { IoMdAdd } from "react-icons/io";
import { UserType } from "@/types";
import { createUser } from "@/app/actions/users";

const initData: UserType = {
  id: 0,
  name: "",
  email: "",
  isAdmin: false,
  createdAt: new Date(),
  password: "",
  phone: "",
};

type ErrorData = string;
const errorDataInit: ErrorData = "";

export default function CreateModal({ refresh }: { refresh: Function }) {
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
    const res = await createUser(data);
    if (res.error) return console.log(res.error);
    if (res.success) {
      setData(initData)
      refresh();
    }
  };

  return (
    <>
      <Button
        size="sm"
        color="primary"
        startContent={<IoMdAdd />}
        onPress={onOpen}
      >
        Agregar nuevo
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Crear usuario
              </ModalHeader>
              <ModalBody>
                <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                  <Input
                    type="text"
                    label="Nombre"
                    variant="bordered"
                    isInvalid={error === "name"}
                    errorMessage="Debe completar este campo"
                    value={data.name || ""}
                    name="name"
                    onChange={handleChange}
                  />
                  <Input
                    type="text"
                    label="Email"
                    variant="bordered"
                    isInvalid={error === "email"}
                    errorMessage="Debe completar este campo"
                    value={data.email || ""}
                    name="email"
                    onChange={handleChange}
                  />
                  <Input
                    type="password"
                    label="Contraseña"
                    isInvalid={error === "password"}
                    errorMessage="Debe completar este campo"
                    variant="bordered"
                    value={data.password}
                    name="password"
                    onChange={handleChange}
                  />
                  <Input
                    type="text"
                    label="Numero de telefono"
                    variant="bordered"
                    value={data.phone + ""}
                    name="phone"
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
                  size="sm"
                  color="danger"
                  variant="light"
                  onPress={onClose}
                >
                  Cancelar
                </Button>
                <Button
                  size="sm"
                  color="primary"
                  onPress={() => {
                    handleSubmit();
                    onClose();
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
