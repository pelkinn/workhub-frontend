<template>
  <VContainer class="py-8">
    <VRow>
      <VCol cols="12">
        <VBtn
          variant="text"
          prepend-icon="mdi-arrow-left"
          class="mb-6"
          @click="navigateTo(`/projects/${projectId}`)"
        >
          НАЗАД К ПРОЕКТУ
        </VBtn>

        <h1 class="text-h3 font-weight-bold mb-8">Логи проекта</h1>

        <VProgressLinear
          v-if="logsPending"
          indeterminate
          color="primary"
          class="mb-4"
        />

        <VAlert v-if="logsError" type="error" variant="tonal" class="mb-6">
          {{ getErrorMessageResponse(logsError) }}
        </VAlert>

        <div v-if="!logsPending && logs">
          <VAlert v-if="logs.length === 0" type="info" variant="tonal" class="mb-4">
            Логи проекта отсутствуют
          </VAlert>

          <div v-else class="d-flex flex-column ga-4">
            <VCard
              v-for="log in logs"
              :key="log.id"
              variant="outlined"
              class="pa-4"
            >
              <div class="d-flex flex-column ga-3">
                <div class="d-flex justify-space-between align-start">
                  <div class="d-flex flex-column flex-sm-row flex-sm-grow-1 justify-space-between align-sm-center ga-2">
                    <VChip
                      :color="getActionColor(log.action)"
                      size="small"
                      variant="flat"
                    >
                      {{ getActionText(log.action) }}
                    </VChip>
                    <span class="text-body-2 text-medium-emphasis">
                      {{ formatDate(log.createdAt) }}
                    </span>
                  </div>
                </div>

                <div class="d-flex align-center ga-2">
                  <VIcon icon="mdi-account" size="small" />
                  <span class="text-body-2">
                    {{ log.user.name || log.user.email }}
                  </span>
                </div>

                <div v-if="log.data && Object.keys(log.data).length > 0" class="mt-2">
                  <VExpansionPanels variant="accordion">
                    <VExpansionPanel>
                      <VExpansionPanelTitle>
                        <span class="text-body-2">Данные действия</span>
                      </VExpansionPanelTitle>
                      <VExpansionPanelText>
                        <pre class="text-body-2 pa-2 bg-surface-variant rounded">{{
                          JSON.stringify(log.data, null, 2)
                        }}</pre>
                      </VExpansionPanelText>
                    </VExpansionPanel>
                  </VExpansionPanels>
                </div>

                <div
                  v-if="log.taskId || log.membershipId"
                  class="d-flex flex-wrap ga-3 mt-2"
                >
                  <VChip
                    v-if="log.taskId"
                    size="x-small"
                    variant="outlined"
                    prepend-icon="mdi-format-list-checks"
                  >
                    Задача: {{ log.taskId }}
                  </VChip>
                  <VChip
                    v-if="log.membershipId"
                    size="x-small"
                    variant="outlined"
                    prepend-icon="mdi-account-group"
                  >
                    Членство: {{ log.membershipId }}
                  </VChip>
                </div>
              </div>
            </VCard>
          </div>
        </div>
      </VCol>
    </VRow>
  </VContainer>
</template>

<script setup lang="ts">
import type { AuditLog } from "@/types/audit-log";
import { AuditLogAction } from "@/enums/AuditLogAction";
import { formatDate } from "@/utils/date";
import { getErrorMessageResponse } from "@/utils/error";

const route = useRoute();
const { project: projectService } = useServices();

const projectId = computed(() => route.params.id as string);

const {
  data: logs,
  pending: logsPending,
  error: logsError,
} = useAsyncData<AuditLog[]>(`project-logs-${projectId.value}`, () =>
  projectService.getAuditLogs(projectId.value)
);

const getActionText = (action: AuditLogAction): string => {
  const actionMap: Record<AuditLogAction, string> = {
    [AuditLogAction.CREATE]: "Создание",
    [AuditLogAction.UPDATE]: "Обновление",
    [AuditLogAction.DELETE]: "Удаление",
    [AuditLogAction.INVITE_CREATED]: "Создано приглашение",
    [AuditLogAction.INVITE_ACCEPTED]: "Приглашение принято",
    [AuditLogAction.ROLE_CHANGED]: "Изменена роль",
    [AuditLogAction.MEMBER_REMOVED]: "Удален участник",
    [AuditLogAction.STATUS_CHANGED]: "Изменен статус",
    [AuditLogAction.DEADLINE_CHANGED]: "Изменен срок",
    [AuditLogAction.TASK_CREATED_VIA_TELEGRAM]: "Задача создана через Telegram",
    [AuditLogAction.TASK_CREATED_VIA_WEBHOOK]: "Задача создана через Webhook",
  };
  return actionMap[action] || action;
};

const getActionColor = (action: AuditLogAction): string => {
  if (
    action === AuditLogAction.CREATE ||
    action === AuditLogAction.INVITE_ACCEPTED ||
    action === AuditLogAction.TASK_CREATED_VIA_TELEGRAM ||
    action === AuditLogAction.TASK_CREATED_VIA_WEBHOOK
  ) {
    return "success";
  }
  if (action === AuditLogAction.DELETE || action === AuditLogAction.MEMBER_REMOVED) {
    return "error";
  }
  if (action === AuditLogAction.UPDATE || action === AuditLogAction.ROLE_CHANGED) {
    return "warning";
  }
  return "primary";
};
</script>

