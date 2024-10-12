"use client";
import { Button } from "@nextui-org/button";
import { Divider } from "@nextui-org/divider";
import NextLink from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";

import { siteConfig } from "@/config/site";
import { Logo } from "@/components/icons";
import { RootState, deleteUser } from "@/lib/redux";

export const Drawer = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.user);

  const handleSignOut = () => {
    dispatch(deleteUser());
    router.push("/login");
  };

  return (
    <div
      className={`flex flex-col left-0 top-0 bg-backgroundComponents w-screen max-w-[200px] h-full`}
    >
      <div className="flex gap-3 w-full items-center justify-center py-4">
        <NextLink
          className="flex justify-start items-center gap-1"
          href="/dashboard"
        >
          <Logo size={24} />
          <p className="font-bold text-inherit">ACME</p>
        </NextLink>
      </div>

      <Divider />

      <div className="flex flex-col justify-between h-full">
        <div className="mx-1 mt-2 flex flex-col gap-2">
          {siteConfig.drawMenuItems.map((item, index) => (
            <Button
              key={`${item}-${index}`}
              as={"a"}
              className="text-text bg-transparent hover:text-white hover:bg-gray-800"
              href={item.href}
              size="lg"
            >
              <p>{item.label}</p>
            </Button>
          ))}
        </div>
        <div className="mx-1 mt-2 flex flex-col gap-2 py-5">
          {/* <div className="basis-1 pl-4">
            <ThemeSwitch />
          </div> */}
          <p className="text-sm font-bold">Hola! {user?.name?.split(" ")[0]}</p>
          <Button
            as={"button"}
            className="text-text bg-transparent hover:text-white hover:bg-gray-800"
            size="sm"
            onPress={handleSignOut}
          >
            <p>Cerrar sesion</p>
          </Button>
        </div>
      </div>
    </div>
  );
};
