"use client";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { verifyToken } from "../actions/users";
import { useEffect, useState } from "react";
import { Spinner } from "@nextui-org/react";

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loadingSession,setLoadingSession] = useState(true)
  const verToken = async (token: string) => {
    const res = await verifyToken(token);
    if (!res.success) {
      return window.location.href = "/login";
    }
    setLoadingSession(false)
  };

  useEffect(() => {
    const token = localStorage.getItem("sessionToken");
    if (!token || token.length === 0) {
      window.location.href = "/login";
    } else {
      verToken(token);
    }
  }, []);

  return (
    <section className="flex flex-col items-center justify-center gap-4">
      <div className="inline-block w-screen text-center justify-center">
        {loadingSession ?
        <div className="flex w-screen h-screen justify-center items-center">
          <Spinner/>
        </div>
        : children}
        <ToastContainer />
      </div>
    </section>
  );
}
