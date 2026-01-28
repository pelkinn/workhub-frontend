<template>
  <VAppBar elevation="0" flat class="app-header" height="72">
    <VContainer class="d-flex align-center" fluid>
      <VAppBarTitle class="d-flex align-center">
        <NuxtLink to="/" class="d-flex align-center text-decoration-none">
          <img
            v-if="theme.current.value.dark"
            src="~/assets/workhub_logo.webp"
            alt="WorkHub"
            class="logo"
          />
          <img
            v-else
            src="~/assets/workhub_logo_light.webp"
            alt="WorkHub"
            class="logo"
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

      <VBtn
        v-if="!userStore.isLoggedIn"
        color="primary"
        variant="flat"
        rounded="pill"
        to="/login"
      >
        Войти
      </VBtn>

      <template v-else>
        <VBtn
          color="primary"
          variant="tonal"
          rounded="pill"
          to="/projects"
          class="mr-2"
        >
          Мои проекты
        </VBtn>
        <VMenu>
          <template #activator="{ props }">
            <VChip
              v-bind="props"
              color="secondary"
              variant="tonal"
              label
              class="cursor-pointer"
            >
              {{ userStore.user?.name || userStore.user?.email }}
            </VChip>
          </template>
          <VList>
            <VListItem @click="handleLogout">
              <VListItemTitle>Выйти</VListItemTitle>
            </VListItem>
          </VList>
        </VMenu>
      </template>
    </VContainer>
  </VAppBar>
</template>

<script setup lang="ts">
import { useTheme } from "vuetify";
import { computed } from "vue";

const userStore = useUserStore();
const theme = useTheme();

const themeIcon = computed(() => {
  return theme.current.value.dark ? "mdi-weather-sunny" : "mdi-weather-night";
});

const handleLogout = () => {
  userStore.logout();
  navigateTo("/login");
};
</script>

<style scoped>
.logo {
  height: 40px;
}
</style>
