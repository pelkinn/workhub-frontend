import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import "@mdi/font/css/materialdesignicons.css";

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    components,
    directives,
    theme: {
      defaultTheme: "dark",
      themes: {
        dark: {
          colors: {
            primary: "#A3E635",
            "on-primary": "#151A0A",
            secondary: "#F59E0B",
            "on-secondary": "#1A1205",
            background: "#141412",
            surface: "#1A1914",
            "surface-variant": "#27251E",
            "on-background": "#F1F0E8",
            "on-surface": "#F1F0E8",
            outline: "#3A352A",
            success: "#22C55E",
            warning: "#F59E0B",
            error: "#F87171",
            info: "#84CC16",
          },
        },
        light: {
          dark: false,
          colors: {
            primary: "#0F766E",
            "on-primary": "#FFFFFF",
            secondary: "#B45309",
            "on-secondary": "#FFFFFF",
            background: "#F8FAFC",
            surface: "#FFFFFF",
            "surface-variant": "#E2E8F0",
            "on-background": "#0F172A",
            "on-surface": "#0F172A",
            outline: "#CBD5F5",
            success: "#16A34A",
            warning: "#D97706",
            error: "#DC2626",
            info: "#0284C7",
          },
        },
      },
    },
  });

  nuxtApp.vueApp.use(vuetify);
});
