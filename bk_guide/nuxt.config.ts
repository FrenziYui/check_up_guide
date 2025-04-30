// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "@nuxtjs/i18n"],
  vueI18n: "./i18n.config.ts",
  ssr: false,

  runtimeConfig: {
    public: {
      apiBaseUrl: "http://localhost:8080",
      imageBaseUrl: "https://storage.googleapis.com/kenshindata/",
    },
  },

  appConfig: {
    collectionId: "guidance",
  },

  css: ["flatpickr/dist/flatpickr.min.css"],
  compatibilityDate: "2025-02-27",
});