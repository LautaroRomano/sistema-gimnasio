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
import { Suspense, useEffect, useState } from "react";
import { FaCheckCircle, FaEye, FaEyeSlash } from "react-icons/fa";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { loginUser } from "../actions/users";

function LoginPage() {
  const [dni, setDni] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSucces] = useState(false);
  const [error, setError] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const param1 = searchParams.get("error");

    if (param1) toast.error(param1, { autoClose: false });

    // Puedes usar los parámetros según sea necesario
  }, [searchParams]);

  const handleSubmit = async () => {
    if (dni.length === 0 || password.length === 0)
      return toast.error("Debe completar todos los campos");
    try {
      const user = await loginUser({ dni, password });
      if (user.error) {
        return toast.error(user.error);
      }
      if(user.token){
        localStorage.setItem('sessionToken',user.token);
        const lastUrl = localStorage.getItem("lastUrl");
        if (typeof lastUrl === "string") {
          router.push(lastUrl);
        } else {
          router.push("/");
        }
        setSucces(true);
      }
    } catch (error) {
      console.log("🚀 ~ handleSubmit ~ error:", error)
      setError(true);
    }
  };

  return (
    <div className="w-full mt-36">
      <Card className="mb-4 w-full my-5">
        <CardHeader className="justify-center">
          <div className="flex gap-5 w-full justify-center">
            <h1 className="text-3xl font-bold">Ingresar a tu cuenta</h1>
          </div>
        </CardHeader>

        <CardBody className="px-3 pt-0 text-small text-default-400 items-center gap-2">
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
                color={isVisible ? "primary" : "default"}
                isIconOnly
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
        <CardFooter>
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
                className="w-full max-w-xs mb-5 mt-2"
                color="primary"
                disabled={dni.length === 0 || password.length === 0}
                size="md"
                onPress={handleSubmit}
              >
                Iniciar sesion
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense>
      <LoginPage />
    </Suspense>
  );
}
