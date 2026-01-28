// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify from "vite-plugin-vuetify";

export default defineNuxtConfig({
  modules: ["@nuxt/eslint", "@pinia/nuxt"],
  plugins: ["~/plugins/vuetify.client", "~/plugins/api", "~/plugins/init"],
  ssr: false,
  devServer: {
    port: 3001,
  },
  app: {
    head: {
      title: "WorkHub",
      meta: [
        {
          name: "description",
          content: "WorkHub — платформа для управления задачами и командной работы.",
        },
      ],
      link: [{ rel: "icon", type: "image/png", href: "/favicon.png" }],
    },
  },
  devtools: { enabled: false },
  css: ["vuetify/styles", "~/assets/styles/app.scss"],
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
