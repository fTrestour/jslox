import defaultTheme from "tailwindcss/defaultTheme";
import plugin from "tailwindcss/plugin";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,jsx,tsx}"],
  theme: {
    fontFamily: {
      sans: ['"Fira Code"', ...defaultTheme.fontFamily.sans],
    },
    extend: {
      colors: {
        background: "rgb(37, 35, 52)",
        dark: "rgb(36, 27, 47)",
        light: "rgb(132, 139, 189)",
        pink: "rgb(238, 132, 214)",
        yellow: "rgb(247, 221, 113)",
        green: "rgb(145, 231, 184)",
      },
    },
  },
  plugins: [
    plugin(function ({ addVariant }) {
      addVariant("hocus", ["&:hover", "&:focus"]);
      addVariant("group-hocus", [
        ":merge(.group):hover &",
        ":merge(.group):focus &",
      ]);
    }),
  ],
};
