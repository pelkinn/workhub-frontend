// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify from "vite-plugin-vuetify";

export default defineNuxtConfig({
  modules: ["@nuxt/eslint", "@pinia/nuxt"],
  plugins: ["~/plugins/vuetify.client", "~/plugins/api", "~/plugins/init"],
  ssr: false,
  devtools: { enabled: false },
  css: ["vuetify/styles"],
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.API_BASE_URL || "http://localhost:3000",
    },
  },
  build: {
    transpile: ["vuetify"],
  },
  vite: {
    plugins: [
      vuetify({
        styles: { configFile: "assets/styles/vuetify.scss" },
      }),
    ],
  },
  compatibilityDate: "2025-07-15",
});
