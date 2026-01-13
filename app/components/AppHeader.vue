<template>
  <v-app-bar elevation="2">
    <v-container class="d-flex align-center" fluid>
      <v-app-bar-title class="d-flex align-center">
        <NuxtLink to="/" class="d-flex align-center text-decoration-none">
          <img
            :src="logoUrl"
            alt="WorkHub"
            class="mr-3"
            style="height: 40px; width: 40px"
          />
        </NuxtLink>
      </v-app-bar-title>

      <v-spacer />

      <v-btn
        icon
        variant="text"
        class="mr-2"
        @click="theme.toggle(['light', 'dark'])"
      >
        <v-icon>{{ themeIcon }}</v-icon>
      </v-btn>

      <v-btn v-if="!userStore.isLoggedIn" color="secondary" to="/login">
        Войти
      </v-btn>

      <span v-else class="text-body-1">
        {{ userStore.currentUser?.name || userStore.currentUser?.email }}
      </span>
    </v-container>
  </v-app-bar>
</template>

<script setup lang="ts">
import logoUrl from "~/assets/logo.svg";
import { useTheme } from "vuetify";
import { computed } from "vue";

const userStore = useUserStore();
const theme = useTheme();

const themeIcon = computed(() => {
  return theme.current.value.dark ? "mdi-weather-sunny" : "mdi-weather-night";
});
</script>
