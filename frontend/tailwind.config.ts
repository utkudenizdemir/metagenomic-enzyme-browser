import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
       fontFamily: {
        sans: ["DM Sans", "ui-sans-serif", "system-ui"],
      },     colors: {
        // Configure your color palette here
        'deep-blue': '#002C62',
        'light-grey': '#EAEEFF',
        'light-blue': '#b8d4e9',
      },
    },
  },
  plugins: [],
};
export default config;
