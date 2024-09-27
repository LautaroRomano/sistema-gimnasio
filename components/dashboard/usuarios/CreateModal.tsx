import React, { ChangeEvent, useState } from "react";
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

    if (res.error) return 0;
    if (res.success) {
      setData(initData);
      refresh();
    }
  };

  return (
    <>
      <Button
        color="primary"
        size="sm"
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
                  color="primary"
                  size="sm"
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
