/** @type {import('tailwindcss').Config} */
export default {
  content: [],
  theme: {
    extend: {
      fontFamily: {
        ja: [
          "SF Pro JP",
          "SF Pro Text",
          "Apple TP",
          "Myriad Set Pro",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "SF Pro Icons",
          "Apple Legacy Icons",
          "Hiragino Kaku Gothic Pro",
          "ヒラギノ角ゴ Pro W3",
          "メイリオ",
          "Meiryo",
          "ＭＳ Ｐゴシック",
          "Helvetica Neue",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["retro", "dark", "cupcake"],
  },
};
