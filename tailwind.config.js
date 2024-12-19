import typography from "@tailwindcss/typography";
import animate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: "media",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  plugins: [animate, typography],
  theme: {
    extend: {
      typography: () => ({
        DEFAULT: {
          css: {
            // remove backticks
            "code::before": {
              content: '""',
            },
            "code::after": {
              content: '""',
            },
          },
        },
      }),
    },
  },
};

export default config;
