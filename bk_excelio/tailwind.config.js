/** @type {import('tailwindcss').Config} */
export default {
  content: [],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Kosugi Maru", "sans-serif"],
      },
    },
  },

  plugins: [require("daisyui")],
  daisyui: {
    themes: ["retro", "retro", "cupcake"],
  },
};
