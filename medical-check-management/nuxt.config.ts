// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },

  vite: {
    plugins: [tailwindcss()],
  },

  css: ["~/assets/app.css"],
  ssr: false,
  imports: {
    dirs: ["composables", "composables/useFirestore"], 
  },
  app: {
    head: {
      link: [
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Kosugi+Maru&family=Murecho:wght@100..900&display=swap",
        },
      ],
    },
  },

  modules: ["@vueuse/nuxt"],
});
