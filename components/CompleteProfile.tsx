"use client";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@nextui-org/react";
import { ChangeEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";

import { UserType } from "@/types";
import { createUser } from "@/app/actions/users";

const initEditUser: UserType = {
  id: 0,
  dni: "",
  email: "",
  isAdmin: false,
  gender: "M",
  height: 0,
  weight: 0,
  wasEdited: true,
  name: "",
};

export default function CompleteProfile({
  user,
  refresh,
}: {
  user: UserType;
  refresh: Function;
}) {
  const [editUser, setEditUser] = useState(initEditUser);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError("");
    if (!editUser.name || editUser.name.length === 0) return setError("name");
    if (!editUser.dni || editUser.dni.length === 0) return setError("dni");
    if (!editUser.email || editUser.email.length === 0)
      return setError("email");
    if (!editUser.gender) return setError("gender");
    if (!editUser.height) return setError("height");
    if (!editUser.weight) return setError("weight");
    if (!editUser.phone) return setError("phone");
    setLoading(true);

    const res = await createUser(editUser);

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
    if (res.success) {
      toast.success("Completado!");
      refresh();
    }
  };

  const handleChange = ({
    target,
  }: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = target;

    setEditUser((p) => ({ ...p, [name]: value }));
  };

  useEffect(() => {
    if (user) {
      const newEditUser = { ...user };

      delete newEditUser.password;
      newEditUser.wasEdited = true;
      newEditUser.gender = "M";
      setEditUser(newEditUser);
    }
  }, [user]);

  return (
    <>
      <Modal isOpen={true}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Debe completar su perfil
              </ModalHeader>
              <ModalBody>
                <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
                  <Input
                    errorMessage="Debe completar este campo"
                    isInvalid={error === "name"}
                    label="Nombre"
                    name="name"
                    type="text"
                    value={editUser?.name || ""}
                    variant="bordered"
                    onChange={handleChange}
                  />
                  <Input
                    errorMessage="Debe completar este campo"
                    isDisabled={!!editUser?.id}
                    isInvalid={error === "dni"}
                    label="DNI"
                    name="dni"
                    type="text"
                    value={editUser?.dni || ""}
                    variant="bordered"
                    onChange={handleChange}
                  />
                  <Input
                    errorMessage="Debe completar este campo"
                    isInvalid={error === "email"}
                    label="Email"
                    name="email"
                    type="text"
                    value={editUser?.email || ""}
                    variant="bordered"
                    onChange={handleChange}
                  />
                  <div className="flex flex-col text-sm">
                    <label className="text-sm" htmlFor="gender">
                      Genero
                    </label>
                    <select
                      className="flex py-4 px-2 bg-[#18181B]"
                      id="gender"
                      name="gender"
                      value={editUser?.gender + ""}
                      onChange={handleChange}
                    >
                      <option value="">Seleccionar</option>
                      <option value="M">Masculino</option>
                      <option value="F">Femenino</option>
                    </select>
                  </div>
                  {error === "gender" && (
                    <p className="text-danger-500 text-sm">
                      Debe ingresar el genero
                    </p>
                  )}
                  <div className="flex gap-2">
                    <Input
                      endContent={<p>cm</p>}
                      errorMessage="Debe completar este campo"
                      isInvalid={error === "height"}
                      label="Altura"
                      name="height"
                      type="number"
                      value={editUser?.height + ""}
                      variant="bordered"
                      onChange={handleChange}
                    />
                    <Input
                      endContent={<p>kg</p>}
                      errorMessage="Debe completar este campo"
                      isInvalid={error === "weight"}
                      label="Peso"
                      name="weight"
                      type="number"
                      value={editUser?.weight + ""}
                      variant="bordered"
                      onChange={handleChange}
                    />
                  </div>
                  <Input
                    errorMessage="Debe completar este campo"
                    isInvalid={error === "phone"}
                    label="Numero de telefono"
                    name="phone"
                    type="text"
                    value={editUser?.phone + ""}
                    variant="bordered"
                    onChange={handleChange}
                  />
                </form>
              </ModalBody>
              <ModalFooter>
                <Button
                  className="text-default-100 font-bold"
                  color="primary"
                  isDisabled={loading}
                  isLoading={loading}
                  onPress={handleSubmit}
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
