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
import { uploadImg } from "@/app/actions/exercicesConfig";
import { uploadFile } from "@/lib/firebase";

type ImageType = {
  name: string;
  img: string;
};
const initData: ImageType = { name: "", img: "" };

type ErrorData = string;
const errorDataInit: ErrorData = "";

export default function CreateModal({ refresh }: { refresh: Function }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [data, setData] = useState(initData);
  const [error, setError] = useState(errorDataInit);

  const handleChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = target;
    setData((p) => ({ ...p, [name]: value }));
  };

  const handleChangeImg = async ({ target }: ChangeEvent<HTMLInputElement>) => {
    const { name, files } = target;
    if (!files || !files[0]) return setError("img");
    const url = await uploadFile(files[0]);
    setData((p) => ({ ...p, [name]: url }));
  };

  const handleSubmit = async () => {
    if (!data.name || data.name.length === 0) return setError("name");
    const res = await uploadImg(data);
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
                Crear imagen
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
                    name="img"
                    accept="image/*"
                    onChange={handleChangeImg}
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
