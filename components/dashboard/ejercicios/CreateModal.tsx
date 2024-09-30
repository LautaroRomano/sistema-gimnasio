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

import { ExerciseType } from "@/types";
import { create, getImages } from "@/app/actions/exercicesConfig";
import { toast } from "react-toastify";

const initData: ExerciseType = {
  id: 0,
  name: "",
  description: "",
  series: 1,
  type: "repeticiones",
  value: "1",
  img: "",
  createdAt: new Date(),
};

type ErrorData = string;
const errorDataInit: ErrorData = "";

export default function CreateModal({
  refresh,
  edit,
  setEdit,
}: {
  refresh: Function;
  edit: ExerciseType | null;
  setEdit: Function;
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
    if (!data.img || data.img.length === 0) return setError("img");
    const res = await create(data);

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
              {data?.id ? "Editar ejercicio" : "Crear ejercicio"}
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
                  <SelectImgModal
                    setImg={(urlImage: string) =>
                      setData((p) => ({ ...p, img: urlImage }))
                    }
                  />
                  <Textarea
                    label="Descripcion"
                    name="description"
                    type="text"
                    value={data.description}
                    variant="bordered"
                    onChange={handleChange}
                  />

                  <Input
                    endContent={
                      <select
                        className="outline-none border-0 bg-transparent text-default-400 text-small"
                        name="type"
                        value={data.type}
                        onChange={handleChange}
                      >
                        <option value="repeticiones">Repeticiones</option>
                        <option value="segundos">Segundos</option>
                        <option value="minutos">Minutos</option>
                      </select>
                    }
                    label="valor"
                    labelPlacement="outside"
                    name="value"
                    type="number"
                    value={data.value}
                    variant="bordered"
                    onChange={handleChange}
                  />

                  <Input
                    label="Series"
                    min={1}
                    name="series"
                    type="number"
                    value={data.series + ""}
                    variant="bordered"
                    onChange={handleChange}
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

type InitData = {
  id: number;
  name: string;
  imageUrl: string | null;
  lastUse: Date | null;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;
};
const initDataImages: InitData[] = [];
const initDataSelected: InitData = {
  id: 0,
  name: "",
  imageUrl: null,
  lastUse: null,
  deletedAt: null,
  updatedAt: null,
  createdAt: new Date(),
};

function SelectImgModal({ setImg }: { setImg: Function }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [data, setData] = useState(initDataImages);
  const [selected, setSelected] = useState(initDataSelected);

  const handleChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    const { value } = target;

    getData(value);
  };

  const getData = async (search: string | null) => {
    const res = await getImages(search);

    if (res.error) return 0;
    if (!res.success) return 0;
    setData(res.success);
  };

  useEffect(() => {
    if (isOpen) getData(null);
  }, [isOpen]);

  return (
    <>
      <div className="flex gap-2 justify-between border border-[#35353B] py-2 px-4 items-center">
        <p className="text-sm">
          {selected.name.length === 0
            ? "Ninguna Imagen seleccionada"
            : selected.name}
        </p>
        <Button size="sm" variant="bordered" onPress={onOpen}>
          Seleccionar
        </Button>
      </div>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Selecciona una imagen 2
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-2">
                  <Input
                    label="Buscar"
                    name="search"
                    size="sm"
                    type="text"
                    variant="bordered"
                    onChange={handleChange}
                  />
                  <div className="flex flex-col gap-2 h-[34rem] overflow-y-scroll">
                    {data.map((image) => {
                      return (
                        <button
                          key={image.id}
                          className="flex p-2 justify-evenly items-center max-h-24 hover:bg-gray-800 cursor-pointer gap-4"
                          onClick={() => {
                            setImg(image.imageUrl);
                            setSelected(image);
                            onClose();
                          }}
                        >
                          <div className="flex h-full">
                            <img
                              alt={image.name}
                              className="object-contain   h-full"
                              src={image.imageUrl || ""}
                            />
                          </div>
                          <div className="flex">
                            <p className="text-right text-sm">{image.name}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
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
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
