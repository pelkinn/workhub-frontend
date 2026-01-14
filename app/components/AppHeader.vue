<template>
  <VAppBar elevation="2">
    <VContainer class="d-flex align-center" fluid>
      <VAppBarTitle class="d-flex align-center">
        <NuxtLink to="/" class="d-flex align-center text-decoration-none">
          <img
            :src="logoUrl"
            alt="WorkHub"
            class="mr-3"
            style="height: 40px; width: 40px"
          />
        </NuxtLink>
      </VAppBarTitle>

      <VSpacer />

      <VBtn
        icon
        variant="text"
        class="mr-2"
        @click="theme.toggle(['light', 'dark'])"
      >
        <VIcon>{{ themeIcon }}</VIcon>
      </VBtn>

      <VBtn v-if="!userStore.isLoggedIn" color="secondary" to="/login">
        Войти
      </VBtn>

      <template v-else>
        <VBtn color="primary" variant="text" to="/projects" class="mr-2">
          Мои проекты
        </VBtn>
        <span class="text-body-1">
          {{ userStore.user?.name || userStore.user?.email }}
        </span>
      </template>
    </VContainer>
  </VAppBar>
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
