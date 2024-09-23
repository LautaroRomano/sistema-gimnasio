import { title } from "@/components/primitives";
import { Drawer } from "@/components/dashboard/drawer";

export default function DashboardPage() {
  return (
    <div className="bg-bg flex gap-1 h-screen">
      <Drawer />
      <div className="flex flex-col left-0 top-0 bg-backgroundBack w-screen h-full">
        <div className="bg-backgroundComponents">
        <h1 className="text-lg py-4">Listado de Rutinas</h1>
        </div>
      </div>
    </div>
  );
}
