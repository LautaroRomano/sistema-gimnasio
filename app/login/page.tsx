"use client";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Input,
  Link,
  Spinner,
} from "@nextui-org/react";
import { useState } from "react";
import { FaCheckCircle, FaEye, FaEyeSlash } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { loginUser } from "../actions/users";
import { useDispatch } from "react-redux";
import { setUser, setSessionToken } from "@/lib/redux";

export default function LoginPage() {
  const [dni, setDni] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSucces] = useState(false);
  const [error, setError] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const [loadingSession, setLoadingSession] = useState(true);

  const dispatch = useDispatch();

  const router = useRouter();

  const handleSubmit = async () => {
    if (dni.length === 0 || password.length === 0)
      return toast.error("Debe completar todos los campos");

    setLoadingSession(true);
    try {
      const user = await loginUser({ dni, password });
      if (user.error) {
        return toast.error(user.error);
      }
      if (user.success && user.token) {
        dispatch(setUser({ user: user.success }));
        dispatch(setSessionToken(user.token));
        localStorage.setItem("sessionToken", user.token); //Guardar el token en el localStorage
        router.push("/");
        setSucces(true);
      }
    } catch (error) {
      setError(true);
    } finally {
      setLoadingSession(false);
    }
  };

  return (
    <div className="flex flex-col w-full mt-36 gap-4 justify-center items-center">
      <h1 className="text-xl flex font-bold">Bienvenido</h1>
      <p className="text-md flex">¡Tu mejor versión comienza hoy!</p>
      <Card className="mb-4 w-full my-5 flex rounded-none bg-primary">
        <CardHeader className="justify-center"></CardHeader>

        <CardBody className="px-3 pt-0 text-small text-default-400 items-center gap-4">
          <Input
            placeholder="DNI"
            value={dni}
            onChange={(e) => setDni(e.target.value)}
          />
          <Input
            type={isVisible ? "text" : "password"}
            placeholder="Contrasena"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            endContent={
              <Button
                color={isVisible ? "secondary" : "default"}
                isIconOnly
                variant="bordered"
                onPress={() => setIsVisible((prev) => !prev)}
                className="m-2"
                size="sm"
              >
                <>
                  {isVisible ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </>
              </Button>
            }
          />

          {error && <h5 className="text-red-600">Ocurrio un error: {error}</h5>}
        </CardBody>
        <CardFooter></CardFooter>
      </Card>
      <div className="w-full justify-center">
        {success ? (
          <Button
            as={Link}
            className="w-full max-w-xs mb-5 mt-2"
            color="success"
            href="/"
            startContent={<FaCheckCircle />}
          >
            Listo
          </Button>
        ) : (
          <Button
            className="w-full max-w-xs mb-5 mt-2 text-default-900 font-bold"
            color="primary"
            disabled={dni.length === 0 || password.length === 0 || loadingSession}
            size="md"
            onPress={handleSubmit}
            isLoading={loadingSession}
          >
            Iniciar sesion
          </Button>
        )}
      </div>
    </div>
  );
}
