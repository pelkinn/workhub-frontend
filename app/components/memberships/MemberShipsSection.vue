<template>
  <VCard variant="flat" color="transparent">
    <VCardTitle class="d-flex justify-space-between align-center px-2 pb-4">
      <div class="d-flex align-center ga-3">
        <VAvatar color="primary" variant="tonal" size="40" rounded="lg">
          <VIcon icon="mdi-account-group" />
        </VAvatar>
        <div>
          <div class="text-h6">Участники</div>
          <div class="text-caption text-medium-emphasis">
            {{ memberships?.length || 0 }}
            {{ getMembersCountText(memberships?.length || 0) }}
          </div>
        </div>
      </div>
      <VBtn
        v-if="canInvite"
        color="primary"
        variant="flat"
        rounded="pill"
        prepend-icon="mdi-account-plus"
        @click="invitationDialogOpen = true"
      >
        Пригласить
      </VBtn>
    </VCardTitle>

    <VDivider class="mb-4" />

    <VCardText class="pa-0">
      <div
        v-if="membershipsPending"
        class="d-flex flex-column align-center py-8 ga-4"
      >
        <VProgressCircular indeterminate color="primary" size="40" />
        <span class="text-body-2 text-medium-emphasis">Загрузка...</span>
      </div>

      <VAlert v-else-if="membershipsError" type="error" variant="tonal">
        {{ getErrorMessageResponse(membershipsError) }}
      </VAlert>

      <VList
        v-else-if="memberships && memberships.length > 0"
        lines="two"
        bg-color="transparent"
      >
        <VListItem
          v-for="membership in memberships"
          :key="membership.id"
          rounded="lg"
          class="mb-2 member-item"
        >
          <template #prepend>
            <VAvatar
              :color="getRoleColor(membership.role)"
              variant="tonal"
              size="44"
              rounded="lg"
            >
              <span class="text-body-1 font-weight-medium">
                {{ getInitials(membership.name) }}
              </span>
            </VAvatar>
          </template>

          <VListItemTitle class="font-weight-medium">
            {{ membership.name }}
          </VListItemTitle>
          <VListItemSubtitle>
            {{ getRoleText(membership.role) }}
          </VListItemSubtitle>

          <template #append>
            <VChip
              :color="getRoleColor(membership.role)"
              :prepend-icon="getRoleIcon(membership.role)"
              variant="tonal"
              size="small"
              label
            >
              {{ getRoleText(membership.role) }}
            </VChip>
          </template>
        </VListItem>
      </VList>

      <VAlert
        v-else
        type="info"
        variant="tonal"
        icon="mdi-account-multiple-outline"
      >
        <VAlertTitle>Пока нет участников</VAlertTitle>
        Пригласите коллег для совместной работы
      </VAlert>
    </VCardText>
  </VCard>

  <CreateInvitationDialog
    v-model="invitationDialogOpen"
    :project-id="projectId"
    @created="handleInvitationCreated"
  />
</template>

<script setup lang="ts">
import type { Membership } from "@/types/project";
import { MembershipRole } from "@/enums/MembershipRole";
import { getErrorMessageResponse } from "@/utils/error";
import CreateInvitationDialog from "~/components/invitations/CreateInvitationDialog.vue";

const props = defineProps<{
  projectId: string;
}>();

const invitationDialogOpen = ref(false);

const { project: projectService } = useServices();

const userStore = useUserStore();

const {
  data: memberships,
  pending: membershipsPending,
  error: membershipsError,
  refresh: refreshMemberships,
} = useAsyncData<Membership[]>(`project-memberships-${props.projectId}`, () =>
  projectService.getMemberships(props.projectId),
);

const canInvite = computed(() => {
  if (!userStore.user || !memberships.value) return false;
  const userMembership = memberships.value.find(
    (m: Membership) => m.userId === userStore.user?.id,
  );
  return (
    userMembership?.role === MembershipRole.OWNER ||
    userMembership?.role === MembershipRole.EDITOR
  );
});

const handleInvitationCreated = async () => {
  await refreshMemberships();
};

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const getMembersCountText = (count: number) => {
  if (count === 1) return "участник";
  if (count >= 2 && count <= 4) return "участника";
  return "участников";
};

const getRoleText = (role: MembershipRole) => {
  const roleMap: Record<MembershipRole, string> = {
    [MembershipRole.OWNER]: "Владелец",
    [MembershipRole.EDITOR]: "Редактор",
    [MembershipRole.VIEWER]: "Наблюдатель",
  };
  return roleMap[role] || role;
};

const getRoleColor = (role: MembershipRole) => {
  const colorMap: Record<MembershipRole, string> = {
    [MembershipRole.OWNER]: "warning",
    [MembershipRole.EDITOR]: "primary",
    [MembershipRole.VIEWER]: "success",
  };
  return colorMap[role] || "default";
};

const getRoleIcon = (role: MembershipRole) => {
  const iconMap: Record<MembershipRole, string> = {
    [MembershipRole.OWNER]: "mdi-crown",
    [MembershipRole.EDITOR]: "mdi-pencil",
    [MembershipRole.VIEWER]: "mdi-eye",
  };
  return iconMap[role] || "mdi-account";
};
</script>

<style scoped>
.member-item {
  background: rgba(var(--v-theme-surface), 0.5);
  border: 1px solid rgba(var(--v-theme-on-surface), 0.06);
}
</style>
