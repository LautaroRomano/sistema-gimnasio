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

import { uploadImg } from "@/app/actions/exercicesConfig";
import { uploadFile } from "@/lib/firebase";
import { ImageType } from "@/types";
import { toast } from "react-toastify";

const initData: ImageType = { id:0,name: "", imageUrl: "" };

type ErrorData = string;
const errorDataInit: ErrorData = "";

export default function CreateModal({ refresh,edit,setEdit }: { refresh: Function,edit:ImageType  | null;
  setEdit: Function; }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [data, setData] = useState(initData);
  const [error, setError] = useState(errorDataInit);

  const handleChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = target;

    setData((p) => ({ ...p, [name]: value }));
  };

  const handleChangeImg = async ({ target }: ChangeEvent<HTMLInputElement>) => {
    const { name, files } = target;

    if (!files || !files[0]) return setError("imageUrl");
    const url = await uploadFile(files[0]);

    setData((p) => ({ ...p, [name]: url }));
  };

  const handleSubmit = async () => {
    if (!data.name || data.name.length === 0) return setError("name");
    const res = await uploadImg(data);

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
    }
  };

  useEffect(() => {
    if (edit?.id) {
      setData(edit);
      onOpen();
    }
  }, [edit]);
  useEffect(() => {
    if (!isOpen) {
      setEdit(null);
      setData(initData);
    }
  }, [isOpen]);

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
              {data?.id ? "Editar imagen" : "Crear imagen"}
              </ModalHeader>
              <ModalBody>
                <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
                  <Input
                    errorMessage="Debe completar este campo"
                    isInvalid={error === "name"}
                    label="Nombre"
                    name="name"
                    type="text"
                    value={data.name}
                    variant="bordered"
                    onChange={handleChange}
                  />
                  <Input
                    accept="image/*"
                    errorMessage="Debe ingresar una imagen"
                    // isDisabled={!!data?.id}
                    isInvalid={error === "imageUrl"}
                    label="Imagen"
                    name="imageUrl"
                    type="file"
                    variant="bordered"
                    onChange={handleChangeImg}
                  />
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
