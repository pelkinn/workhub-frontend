<template>
  <VContainer class="fill-height" fluid>
    <VRow align="center" justify="center">
      <VCol cols="12" sm="8" md="6" lg="4">
        <VProgressLinear
          v-if="invitationPending"
          indeterminate
          color="primary"
          class="mb-4"
        />

        <VAlert v-if="!token" type="error" variant="tonal" class="mb-4">
          Токен приглашения не найден в URL
        </VAlert>

        <VAlert
          v-if="invitationError"
          type="error"
          variant="tonal"
          class="mb-4"
        >
          {{ getErrorMessageResponse(invitationError) }}
        </VAlert>

        <VCard v-if="!invitationPending && invitation">
          <VCardTitle class="text-h5 text-center pa-6">
            Приглашение в проект
          </VCardTitle>
          <VCardText>
            <!-- Состояние A: Пользователь не авторизован -->
            <div v-if="!userStore.isLoggedIn">
              <VAlert type="info" variant="tonal" class="mb-4">
                Вас пригласили присоединиться к проекту. Для принятия
                приглашения необходимо войти в систему.
              </VAlert>

              <div class="mb-4">
                <h3 class="text-h6 mb-2">{{ invitation.project.name }}</h3>
                <p class="text-body-2 text-medium-emphasis mb-2">
                  {{ invitation.project.description || "Описание отсутствует" }}
                </p>
                <div class="text-body-2 text-medium-emphasis">
                  Email: <strong>{{ invitation.email }}</strong>
                </div>
                <div class="text-body-2 text-medium-emphasis">
                  Роль: <strong>{{ getRoleText(invitation.role) }}</strong>
                </div>
              </div>

              <VBtn
                color="primary"
                block
                size="large"
                :to="`/login?redirect=${encodeURIComponent(
                  `/invite?token=${invitation.token}`
                )}`"
              >
                Войти
              </VBtn>
            </div>

            <!-- Состояние B: Авторизован, email не совпадает -->
            <div
              v-else-if="
                userStore.user && userStore.user.email !== invitation.email
              "
            >
              <VAlert type="error" variant="tonal" class="mb-4">
                Это приглашение предназначено для другого email
              </VAlert>
              <div class="mb-4">
                <p class="text-body-1 mb-2">
                  Приглашение отправлено на:
                  <strong>{{ invitation.email }}</strong>
                </p>
                <p class="text-body-1">
                  Вы вошли как: <strong>{{ userStore.user.email }}</strong>
                </p>
              </div>
              <VBtn color="error" block size="large" @click="handleLogout">
                Выйти и войти с правильным аккаунтом
              </VBtn>
            </div>

            <!-- Состояние C: Авторизован, email совпадает -->
            <div
              v-else-if="
                userStore.user && userStore.user.email === invitation.email
              "
            >
              <VAlert type="success" variant="tonal" class="mb-4">
                Вы можете принять это приглашение
              </VAlert>

              <div class="mb-4">
                <h3 class="text-h6 mb-2">{{ invitation.project.name }}</h3>
                <p class="text-body-2 text-medium-emphasis mb-2">
                  {{ invitation.project.description || "Описание отсутствует" }}
                </p>
                <div class="text-body-2 text-medium-emphasis">
                  Роль: <strong>{{ getRoleText(invitation.role) }}</strong>
                </div>
              </div>

              <VBtn
                color="primary"
                block
                size="large"
                :loading="accepting"
                @click="handleAccept"
              >
                Принять приглашение
              </VBtn>
            </div>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </VContainer>
</template>

<script setup lang="ts">
import type { Invitation } from "@/types/invitation";
import { MembershipRole } from "@/enums/MembershipRole";
import { getErrorMessageResponse } from "@/utils/error";

const route = useRoute();
const router = useRouter();
const { invitation: invitationService } = useServices();
const userStore = useUserStore();

const token = computed(() => route.query.token as string | undefined);

const accepting = ref(false);

const {
  data: invitation,
  pending: invitationPending,
  error: invitationError,
} = useAsyncData<Invitation>(
  `invitation-${token.value}`,
  () => {
    if (!token.value) {
      throw new Error("Токен приглашения не найден");
    }
    return invitationService.getByToken(token.value);
  },
  {
    immediate: !!token.value,
  }
);

const getRoleText = (role: MembershipRole) => {
  const roleMap: Record<MembershipRole, string> = {
    [MembershipRole.OWNER]: "Владелец",
    [MembershipRole.EDITOR]: "Редактор",
    [MembershipRole.VIEWER]: "Наблюдатель",
  };
  return roleMap[role] || role;
};

const handleAccept = async () => {
  if (!token.value || !invitation.value) return;

  accepting.value = true;
  try {
    await invitationService.accept(token.value);
    await router.push(`/projects/${invitation.value.projectId}`);
  } catch (error: unknown) {
    const message = getErrorMessageResponse(
      error,
      "Произошла ошибка при принятии приглашения"
    );
    alert(message);
  } finally {
    accepting.value = false;
  }
};

const handleLogout = () => {
  userStore.logout();
  navigateTo(
    `/login?redirect=${encodeURIComponent(`/invite?token=${token.value}`)}`
  );
};
</script>
