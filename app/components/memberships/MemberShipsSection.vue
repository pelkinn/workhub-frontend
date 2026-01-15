<template>
  <div>
    <div class="d-flex justify-space-between align-center mb-6">
      <h2 class="text-h6">Участники</h2>
      <VBtn
        v-if="canInvite"
        color="primary"
        prepend-icon="mdi-account-plus"
        size="large"
        @click="invitationDialogOpen = true"
      >
        Пригласить участника
      </VBtn>
    </div>

    <div v-if="membershipsPending" class="d-flex justify-center py-8">
      <VProgressCircular indeterminate color="primary" />
    </div>
    <VAlert
      v-else-if="membershipsError"
      type="error"
      variant="tonal"
      class="mb-4"
    >
      {{ getErrorMessageResponse(membershipsError) }}
    </VAlert>
    <div
      v-else-if="memberships && memberships.length > 0"
      class="d-flex flex-column ga-4"
    >
      <VCard
        v-for="membership in memberships"
        :key="membership.id"
        variant="outlined"
        class="pa-4"
      >
        <div class="d-flex align-center justify-space-between">
          <div class="d-flex align-center ga-3">
            <VIcon icon="mdi-account" size="large" color="primary" />
            <div>
              <div class="text-h6 mb-1">{{ membership.name }}</div>
              <div class="text-body-2 text-medium-emphasis">
                Роль: {{ getRoleText(membership.role) }}
              </div>
            </div>
          </div>
          <VChip
            :color="getRoleColor(membership.role)"
            size="small"
            variant="flat"
          >
            {{ membership.role }}
          </VChip>
        </div>
      </VCard>
    </div>
    <VAlert v-else type="info" variant="tonal">
      В проекте пока нет участников
    </VAlert>
  </div>

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
  projectService.getMemberships(props.projectId)
);

const canInvite = computed(() => {
  if (!userStore.user || !memberships.value) return false;
  const userMembership = memberships.value.find(
    (m: Membership) => m.userId === userStore.user?.id
  );
  return (
    userMembership?.role === MembershipRole.OWNER ||
    userMembership?.role === MembershipRole.EDITOR
  );
});

const handleInvitationCreated = async () => {
  await refreshMemberships();
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
    [MembershipRole.OWNER]: "error",
    [MembershipRole.EDITOR]: "primary",
    [MembershipRole.VIEWER]: "default",
  };
  return colorMap[role] || "default";
};
</script>
