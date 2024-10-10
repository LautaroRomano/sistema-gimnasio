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
  Spinner,
} from "@nextui-org/react";
import { IoMdAdd } from "react-icons/io";

import { uploadImg } from "@/app/actions/exercicesConfig";
import { uploadFile } from "@/lib/firebase";
import { ImageType } from "@/types";
import { toast } from "react-toastify";

const initData: ImageType = { id: 0, name: "", imageUrl: "" };

type ErrorData = string;
const errorDataInit: ErrorData = "";

export default function CreateModal({
  refresh,
  edit,
  setEdit,
}: {
  refresh: Function;
  edit: ImageType | null;
  setEdit: Function;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [data, setData] = useState(initData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(errorDataInit);

  const handleChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = target;

    setData((p) => ({ ...p, [name]: value }));
  };

  const handleChangeImg = async ({ target }: ChangeEvent<HTMLInputElement>) => {
    if (loading) return;
    const { name, files } = target;

    try {
      if (!files || !files[0]) return setError("imageUrl");
      setLoading(true);
      const url = await uploadFile(files[0]);
      if (typeof url !== "string" && url.error) return toast.error(url.error);

      setData((p) => ({ ...p, [name]: url }));
    } catch (error) {
      console.log("🚀 ~ handleChangeImg ~ error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (loading) return;
    if (!data.name || data.name.length === 0) return setError("name");
    setLoading(true);
    const res = await uploadImg(data);

    if (res.error) {
      setLoading(false);
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
    setLoading(false);
    if (res.success) {
      setData(initData);
      refresh();
      onOpenChange();
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
      <div className="absolute bottom-5 right-5">
        <Button
          color="primary"
          className="text-default-100 font-bold"
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
                {data?.id ? "Editar imagen" : "Crear imagen"}
              </ModalHeader>
              <ModalBody>
                <form className="flex flex-col gap-2">
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
                  className="text-default-100 font-bold"
                  size="sm"
                  disabled={loading}
                  onPress={() => {
                    if (loading) return;
                    handleSubmit();
                  }}
                  isLoading={loading}
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
