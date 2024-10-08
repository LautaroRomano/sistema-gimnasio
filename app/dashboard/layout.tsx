"use client";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { verifyToken } from "../actions/users";
import { useEffect, useState } from "react";
import { Spinner } from "@nextui-org/react";
import { useDispatch } from "react-redux";
import { setUser, deleteUser, setSessionToken } from "@/lib/redux";

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loadingSession, setLoadingSession] = useState(true);

  const dispatch = useDispatch();

  const verToken = async (token: string) => {
    const res = await verifyToken(token);
    if (!res.success) {
      dispatch(deleteUser());
      return (window.location.href = "/login");
    } else {
      dispatch(setUser({ user: res.success }));
      if (!res.success?.isAdmin) {
        window.location.href = "/";
      }
    }
    setLoadingSession(false);
  };

  useEffect(() => {
    const token = localStorage.getItem("sessionToken");
    if (token) {
      dispatch(setSessionToken(token));
      verToken(token); // Verifica el token
    } else {
      window.location.href = "/login";
    }
  }, []);

  return (
    <section className="dark flex flex-col items-center justify-center gap-4">
      <div className="inline-block w-screen text-center justify-center">
        {loadingSession ? (
          <div className="flex w-screen h-screen justify-center items-center">
            <Spinner />
          </div>
        ) : (
          children
        )}
        <ToastContainer />
      </div>
    </section>
  );
}
