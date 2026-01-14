// https://nuxt.com/docs/api/configuration/nuxt-config
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
  compatibilityDate: "2025-07-15",
});
