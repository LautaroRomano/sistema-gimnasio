import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex  flex-col items-center justify-center gap-4 ">
      <div className="inline-block w-screen text-center justify-center max-w-xl bg-myBg h-screen">
        {children}
        <ToastContainer />
      </div>
    </section>
  );
}
