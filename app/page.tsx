"use client";
import { Link } from "@nextui-org/link";
import { Snippet } from "@nextui-org/snippet";
import { Code } from "@nextui-org/code";
import { button as buttonStyles } from "@nextui-org/theme";
import { useRouter } from "next/navigation";
import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";
import { Navbar } from "@/components/navbar";
import { useEffect } from "react";
import { verifyToken } from "./actions/users";
import { useDispatch, useSelector } from "react-redux";
import { setUser, deleteUser, setSessionToken, RootState } from "@/lib/redux";
import CompleteProfile from "@/components/CompleteProfile";

export default function Home() {
  const router = useRouter();
  const dispatch = useDispatch();

  const user = useSelector((state:RootState)=>state.user);
  const sessionToken = useSelector((state:RootState)=>state.sessionToken);

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

  if(user && !user.wasEdited){
    return(
      <CompleteProfile user={user} refresh={()=>verToken(sessionToken||'')}/>
    )
  }

  return (
    <section className="flex flex-col items-center justify-center gap-4">
      <Navbar />
      <div className="inline-block max-w-xl text-center justify-center">
        <span className={title()}>Make&nbsp;</span>
        <span className={title({ color: "violet" })}>beautiful&nbsp;</span>
        <br />
        <span className={title()}>
          websites regardless of your design experience.
        </span>
        <div className={subtitle({ class: "mt-4" })}>
          Beautiful, fast and modern React UI library.
        </div>
      </div>

      <div className="flex gap-3">
        <Link
          isExternal
          className={buttonStyles({
            color: "primary",
            radius: "full",
            variant: "shadow",
          })}
          href={siteConfig.links.docs}
        >
          Documentation
        </Link>
        <Link
          isExternal
          className={buttonStyles({ variant: "bordered", radius: "full" })}
          href={siteConfig.links.github}
        >
          <GithubIcon size={20} />
          GitHub
        </Link>
      </div>

      <div className="mt-8">
        <Snippet hideCopyButton hideSymbol variant="bordered">
          <span>
            Get started by editing <Code color="primary">app/page.tsx</Code>
          </span>
        </Snippet>
      </div>
    </section>
  );
}
