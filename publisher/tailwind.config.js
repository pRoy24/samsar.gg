/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'cyber-black': '#0a0a0a', // deep, dark black
        'cyber-red': '#ff0000', // bright, vivid red
        'cyber-darkred': '#b30000', // dark, muted red
        'cyber-gray': '#303030', // medium gray for background
        'cyber-lightgray': '#505050', // light gray for secondary elements
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
