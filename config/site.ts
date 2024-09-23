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
      label: "Usuarios",
      href: "/users",
    }
  ],
  navMenuItems: [
    {
      label: "Rutinas",
      href: "/",
    },
    {
      label: "Usuarios",
      href: "/users",
    }
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
      label: "Usuarios",
      href: "/dashboard/users",
    }
  ],
  drawMenuItems: [
    {
      label: "Rutinas",
      href: "/dashboard",
    },
    {
      label: "Ejercicios",
      href: "/dashboard/ejercicios",
    },
    {
      label: "Usuarios",
      href: "/dashboard/users",
    }
  ],
  links: {
    github: "https://github.com/nextui-org/nextui",
    twitter: "https://twitter.com/getnextui",
    docs: "https://nextui.org",
    discord: "https://discord.gg/9b6yyZKmH4",
    sponsor: "https://patreon.com/jrgarciadev",
  },
};
