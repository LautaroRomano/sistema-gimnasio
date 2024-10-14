"use client";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@nextui-org/button";
import {
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  useDisclosure,
} from "@nextui-org/react";
import { toast } from "react-toastify";
import { IoMdExit } from "react-icons/io";
import { FaHome } from "react-icons/fa";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

import { createUser, verifyToken } from "../actions/users";

import CompleteProfile from "@/components/CompleteProfile";
import { setUser, deleteUser, setSessionToken, RootState } from "@/lib/redux";
import { UserType } from "@/types";

//chart

ChartJS.register(ArcElement, Tooltip, Legend);

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

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editUser, setEditUser] = useState(initEditUser);

  const router = useRouter();
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.user);
  const sessionToken = useSelector((state: RootState) => state.sessionToken);

  const verToken = async (token: string) => {
    const res = await verifyToken(token);

    if (!res.success) {
      dispatch(deleteUser());
      router.push("/login");
    } else {
      dispatch(setUser({ user: res.success }));
    }
    if (res?.success?.isAdmin) {
      router.push("/dashboard");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("sessionToken");

    if (token) {
      dispatch(setSessionToken(token));
      verToken(token);
    } else {
      router.push("/login");
    }
  }, []);

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
      toast.success("Guardado!");
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

  if (user && !user.wasEdited) {
    return (
      <CompleteProfile
        refresh={() => verToken(sessionToken || "")}
        user={user}
      />
    );
  }

  return (
    <section className="flex flex-col items-center justify-center gap-4 h-screen overflow-y-auto">
      <div className="flex w-full items-center justify-between gap-2 px-4 mt-8">
        <div className="flex flex-col items-start">
          <h1 className={"text-2xl font-bold text-primary"}>Hola, Lautaro</h1>
          <span>Es hora de desafiar tus límites.</span>
        </div>
        <div className="flex gap-2">
          <Button
            isIconOnly
            as={"a"}
            className="bg-transparent text-primary"
            href="/"
            size="sm"
          >
            <FaHome size={24} />
          </Button>
          <LogoutModal
            onPress={() => {
              dispatch(deleteUser());
              router.push("/login");
            }}
          />
        </div>
      </div>
      <div className="flex w-full h-px bg-primary" />

      {loading ? (
        <div className="flex w-full h-full items-center justify-center">
          <Spinner />
        </div>
      ) : !user || !user.dni ? (
        <div className="flex w-full h-full items-center justify-center">
          <span>No pudimos cargar tus datos!</span>
        </div>
      ) : (
        <div className="flex w-full h-full items-center justify-start flex-col gap-4 overflow-y-auto">
          <IMCChart user={user} />

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
            <div className="flex flex-col text-sm justify-start items-start">
              <label className="text-sm ps-3" htmlFor="gender">
                Genero
              </label>
              <select
                className="flex py-4 px-2 bg-[#1D2738] w-full border border-gray-700 rounded-lg"
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
              <p className="text-danger-500 text-sm">Debe ingresar el genero</p>
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
            <div className="flex w-full h-px bg-primary" />
            <Button
              className="text-default-100 font-bold mt-4 mb-8"
              color="primary"
              type="button"
              onPress={handleSubmit}
            >
              Guardar Cambios
            </Button>
          </form>
        </div>
      )}
    </section>
  );
}

function LogoutModal({ onPress }: { onPress: Function }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button
        className="bg-transparent text-primary"
        size="sm"
        onPress={onOpen}
      >
        <IoMdExit size={24} />
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Cerrar sesion
              </ModalHeader>
              <ModalBody>
                <p>Vas a cerrar la sesion de tu cuenta</p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancelar
                </Button>
                <Button
                  className="text-default-100"
                  color="primary"
                  onPress={() => {
                    onPress();
                    onClose();
                  }}
                >
                  Continuar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

function IMCChart({ user }: { user: UserType }) {
  const [height, setHeight] = useState(1);
  const [weight, setWeight] = useState(1);
  const [imc, setImc] = useState(1);

  useEffect(() => {
    if (user.height && user.weight) {
      setHeight(user.height);
      setWeight(user.weight);
    }
  }, [user]);

  useEffect(() => {
    const heightMts = height / 100;

    setImc(parseFloat((weight / (heightMts * heightMts)).toFixed(2)));
  }, [height, weight]);

  // Determina el color basado en el IMC
  let color;

  if (imc < 18.5 || imc >= 30) {
    color = "red";
  } else if (imc >= 18.5 && imc <= 24.9) {
    color = "green";
  } else {
    color = "yellow";
  }

  const data = {
    datasets: [
      {
        data: [imc, 40 - imc], // Ajuste para completar el gráfico
        backgroundColor: [color, "#e0e0e0"], // Color basado en el IMC y gris para el restante
      },
    ],
    labels: ["IMC", ""],
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex ">
        <Doughnut key={imc} data={data} />
      </div>
      <span>IMC: {imc}</span>

      <div className="flex justify-evenly w-full gap-4">
        <Input
          endContent={<p>cm</p>}
          label="Altura"
          name="height"
          type="number"
          value={height + ""}
          variant="bordered"
          onChange={({ target }) => setHeight(parseFloat(target.value))}
        />
        <Input
          endContent={<p>kg</p>}
          label="Peso"
          name="weight"
          type="number"
          value={weight + ""}
          variant="bordered"
          onChange={({ target }) => setWeight(parseFloat(target.value))}
        />
      </div>
      <div className="flex w-full h-px bg-primary" />
    </div>
  );
}
