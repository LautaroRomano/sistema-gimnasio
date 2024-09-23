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
  Textarea,
} from "@nextui-org/react";
import { IoMdAdd } from "react-icons/io";
import { ExerciseType } from "@/types";

const initData: ExerciseType = {
  id: null,
  name: "",
  description: "",
  repetitions: 1,
  type: "veces",
  value: "1",
  img: "",
};

type ErrorData = string;
const errorDataInit: ErrorData = "";

export default function CreateModal() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [data, setData] = useState(initData);
  const [error, setError] = useState(errorDataInit);

  const handleChange = ({
    target,
  }: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = target;
    setData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = () => {
    if (!data.name || data.name.length === 0) return setError("name");
    if (!data.img || data.img.length === 0) return setError("img");
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
                Crear ejercicio
              </ModalHeader>
              <ModalBody>
                <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                  <Input
                    type="text"
                    label="Nombre"
                    variant="bordered"
                    isInvalid={error === "name"}
                    errorMessage="Debe completar este campo"
                    value={data.name}
                    name="name"
                    onChange={handleChange}
                  />
                  <Input
                    type="file"
                    label="Imagen"
                    variant="bordered"
                    isInvalid={error === "img"}
                    errorMessage="Debe ingresar una imagen"
                    value={data.img}
                    name="img"
                    onChange={handleChange}
                  />
                  <Textarea
                    type="text"
                    label="Descripcion"
                    variant="bordered"
                    value={data.description}
                    name="description"
                    onChange={handleChange}
                  />

                  <Input
                    type="number"
                    label="valor"
                    variant="bordered"
                    labelPlacement="outside"
                    value={data.value}
                    name="value"
                    onChange={handleChange}
                    endContent={
                      <select
                        name="type"
                        value={data.type}
                        onChange={handleChange}
                        className="outline-none border-0 bg-transparent text-default-400 text-small"
                      >
                        <option value="veces">Veces</option>
                        <option value="segundos">Segundos</option>
                        <option value="minutos">Minutos</option>
                      </select>
                    }
                  />

                  <Input
                    type="number"
                    label="Repeticiones"
                    variant="bordered"
                    value={data.repetitions + ""}
                    name="repetitions"
                    min={1}
                    onChange={handleChange}
                  />
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
                <Button size="sm" color="primary" onPress={onClose}>
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
