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
  Divider,
} from "@nextui-org/react";
import { IoMdAdd } from "react-icons/io";
import { ExerciseType } from "@/types";
import { getExercises, getImages } from "@/app/actions/exercicesConfig";
import { create } from "@/app/actions/routines";

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

export default function CreateExerciseRoutine({
  refresh,
  routineId,
}: {
  refresh: Function;
  routineId: number;
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
    const res = await create(data, routineId);
    if (res.error) return console.log(res.error);
    if (res.success) {
      setData(initData);
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
        Nuevo Ejercicio
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
                  <SelectPlantillaModal
                    updateData={(newData:ExerciseType) =>
                      setData((p) => newData)
                    }
                  />
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
                  <SelectImgModal
                    setImg={(urlImage: string) =>
                      setData((p) => ({ ...p, img: urlImage }))
                    }
                    imgSelected={!!data.img}
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
                        <option value="repeticiones">Repeticiones</option>
                        <option value="segundos">Segundos</option>
                        <option value="minutos">Minutos</option>
                      </select>
                    }
                  />

                  <Input
                    type="number"
                    label="Series"
                    variant="bordered"
                    value={data.series + ""}
                    name="series"
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

const initDataExercises: ExerciseType[] = [];
const initExerciseSelected: ExerciseType = {
  id: 0,
  name: "",
  description:'',
  series:0,
  type:'',
  value:'0',
  img:'',
  deletedAt: null,
  updatedAt: null,
  createdAt: new Date(),
};

function SelectPlantillaModal({ updateData }: { updateData: Function }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [data, setData] = useState(initDataExercises);
  const [selected, setSelected] = useState(initExerciseSelected);

  const handleChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    const { value } = target;
    getData(value);
  };

  const getData = async (search: string | null) => {
    const res = await getExercises(search);
    if (res.error) return console.log(res.error);
    if (!res.success) return 0;
    setData(res.success);
  };

  useEffect(() => {
    if (isOpen) getData(null);
  }, [isOpen]);

  return (
    <>
      <div className="flex gap-2 justify-center w-full py-2 px-4 items-center">
        <Button variant="bordered" onPress={onOpen} size="sm" color="primary">
          Seleccionar desde una plantilla
        </Button>
      </div>

      <Divider></Divider>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Selecciona una imagen
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-2">
                  <Input
                    size="sm"
                    type="text"
                    label="Buscar"
                    variant="bordered"
                    name="search"
                    onChange={handleChange}
                  />
                  <div className="flex flex-col gap-2 h-[34rem] overflow-y-scroll">
                    {data.map((exerc) => {
                      return (
                        <div
                          key={exerc.id}
                          className="flex p-2 justify-between max-h-24 hover:bg-gray-800 cursor-pointer gap-4"
                          onClick={() => {
                            updateData(exerc)
                            setSelected(exerc);
                            onClose();
                          }}
                        >
                          <div className="flex">
                            <img
                              src={exerc.img || ""}
                              alt={exerc.name}
                              className="object-contain"
                            />
                          </div>
                          <div className="flex">
                            <p className="text-right text-sm">{exerc.name}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
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
function SelectImgModal({ setImg,imgSelected }: { setImg: Function,imgSelected:boolean }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [data, setData] = useState(initDataImages);
  const [selected, setSelected] = useState(initDataSelected);

  const handleChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    const { value } = target;
    getData(value);
  };

  const getData = async (search: string | null) => {
    const res = await getImages(search);
    if (res.error) return console.log(res.error);
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
            ? imgSelected ? "Imagen de plantilla" : "Ninguna Imagen seleccionada"
            : selected.name}
        </p>
        <Button variant="bordered" onPress={onOpen} size="sm">
          Seleccionar
        </Button>
      </div>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Selecciona una imagen
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-2">
                  <Input
                    size="sm"
                    type="text"
                    label="Buscar"
                    variant="bordered"
                    name="search"
                    onChange={handleChange}
                  />
                  <div className="flex flex-col gap-2 h-[34rem] overflow-y-scroll">
                    {data.map((image) => {
                      return (
                        <div
                          key={image.id}
                          className="flex p-2 justify-between max-h-24 hover:bg-gray-800 cursor-pointer gap-4"
                          onClick={() => {
                            setImg(image.imageUrl);
                            setSelected(image);
                            onClose();
                          }}
                        >
                          <div className="flex">
                            <img
                              src={image.imageUrl || ""}
                              alt={image.name}
                              className="object-contain"
                            />
                          </div>
                          <div className="flex">
                            <p className="text-right text-sm">{image.name}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
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
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
