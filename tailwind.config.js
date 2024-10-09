import { nextui } from "@nextui-org/theme";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
      colors: {
        primary: "#ccfe04", // Define el color primary para uso global
      },
    },
  },
  darkMode: "class",
  plugins: [
    nextui({
      themes: {
        light: {
          colors: {
            primary: "#ccfe04", // Usar el color primary en el tema light
          },
        },
        dark: {
          colors: {
            backgroundBack: "#000",
            backgroundComponents: "#424242",
            text: "#ddd",
            primary: "#ccfe04", // Usar el color primary en el tema dark
          },
        },
      },
    }),
  ],
};
