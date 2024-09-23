import { Button } from "@nextui-org/button";
import {Divider} from "@nextui-org/divider";
import { Kbd } from "@nextui-org/kbd";
import { Link } from "@nextui-org/link";
import { Input } from "@nextui-org/input";
import { link as linkStyles } from "@nextui-org/theme";
import NextLink from "next/link";
import clsx from "clsx";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { Logo } from "@/components/icons";

export const Drawer = () => {
  return (
    <div className={`flex flex-col left-0 top-0 bg-backgroundComponents w-screen max-w-[200px] h-full`}>

        <div className="flex gap-3 w-full items-center justify-center py-4">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            <Logo />
            <p className="font-bold text-inherit">ACME</p>
          </NextLink>
        </div>

        <Divider/>

      {/*  <div className="sm:hidden basis-1 pl-4" >
          <ThemeSwitch />
        </div> */}

      <div>
        <div className="mx-1 mt-2 flex flex-col gap-2">
          {siteConfig.drawMenuItems.map((item, index) => (
            <Button className="text-text bg-transparent hover:text-white hover:bg-gray-800" size="lg" as={"a"} href={item.href} key={`${item}-${index}`}>
              <p>
                {item.label}
              </p>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};
