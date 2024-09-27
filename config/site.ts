export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Gimnasio",
  description: "Sistema para gestionar tus rutinas en el gimnasio.",
  navItems: [
    {
      label: "Rutinas",
      href: "/",
    },
    {
      label: "Imagenes",
      href: "/dashboard/imagenes",
    },
    {
      label: "Usuarios",
      href: "/usuarios",
    },
  ],
  navMenuItems: [
    {
      label: "Rutinas",
      href: "/",
    },
    {
      label: "Imagenes",
      href: "/dashboard/imagenes",
    },
    {
      label: "Usuarios",
      href: "/usuarios",
    },
  ],
  drawItems: [
    {
      label: "Rutinas",
      href: "/dashboard",
    },
    {
      label: "Ejercicios",
      href: "/dashboard/ejercicios",
    },
    {
      label: "Imagenes",
      href: "/dashboard/imagenes",
    },
    {
      label: "Usuarios",
      href: "/dashboard/usuarios",
    },
  ],
  drawMenuItems: [
    {
      label: "Rutinas",
      href: "/dashboard",
    },
    {
      label: "Plantilla Ejercicios",
      href: "/dashboard/ejercicios",
    },
    {
      label: "Imagenes",
      href: "/dashboard/imagenes",
    },
    {
      label: "Usuarios",
      href: "/dashboard/usuarios",
    },
  ],
  links: {
    github: "https://github.com/nextui-org/nextui",
    twitter: "https://twitter.com/getnextui",
    docs: "https://nextui.org",
    discord: "https://discord.gg/9b6yyZKmH4",
    sponsor: "https://patreon.com/jrgarciadev",
  },
};
