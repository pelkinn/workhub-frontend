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
            primary: "#22D3EE",

            background: "#020617",
            surface: "#020617",

            "on-background": "#E5E7EB",
            "on-surface": "#E5E7EB",

            secondary: "#22D3EE",
            "on-secondary": "#020617",

            success: "#22C55E",
            warning: "#F59E0B",
            error: "#F87171",
            info: "#38BDF8",
          },
        },
        light: {
          dark: false,
          colors: {
            primary: "#22D3EE",

            background: "#F8FAFC",
            surface: "#FFFFFF",

            "on-background": "#020617",
            "on-surface": "#020617",

            secondary: "#22D3EE",
            "on-secondary": "#FFFFFF",

            success: "#22C55E",
            warning: "#F59E0B",
            error: "#EF4444",
            info: "#38BDF8",
          },
        },
      },
    },
  });

  nuxtApp.vueApp.use(vuetify);
});
