// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: false },
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.API_BASE_URL || "http://localhost:3000",
    },
  },
  ssr: false,
  css: ["vuetify/styles"],
  build: {
    transpile: ["vuetify"],
  },
  modules: ["@nuxt/eslint", "@pinia/nuxt"],
  plugins: ["~/plugins/vuetify.client", "~/plugins/api", "~/plugins/init"],
  eslint: {
    config: {
      stylistic: true,
    },
  },
});
