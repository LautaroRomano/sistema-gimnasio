import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col items-center justify-center gap-4">
      <div className="inline-block w-screen text-center justify-center max-w-[1000px]">
        {children}
        <ToastContainer />
      </div>
    </section>
  );
}
