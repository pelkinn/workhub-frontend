<template>
  <VContainer>
    <VRow>
      <VCol cols="12">
        <VBtn
          variant="text"
          prepend-icon="mdi-arrow-left"
          class="mb-4"
          @click="navigateTo('/projects')"
        >
          Назад к проектам
        </VBtn>

        <VCard v-if="project">
          <VCardTitle class="text-h5 pa-6">
            {{ project.name }}
          </VCardTitle>
          <VCardText>
            <VProgressLinear
              v-if="projectPending || membershipsPending || tasksPending"
              indeterminate
              color="primary"
              class="mb-4"
            />

            <VAlert
              v-if="projectError"
              type="error"
              variant="tonal"
              class="mb-4"
            >
              {{ getErrorMessageResponse(projectError) }}
            </VAlert>

            <div v-if="!projectPending && project">
              <div class="mb-6">
                <h3 class="text-h6 mb-2">Описание</h3>
                <p class="text-body-1">{{ project.description }}</p>
              </div>

              <VRow class="mb-6">
                <VCol cols="12" md="6">
                  <div class="d-flex align-center ga-2">
                    <VIcon icon="mdi-calendar-plus" />
                    <div>
                      <div class="text-caption text-medium-emphasis">
                        Дата создания
                      </div>
                      <div class="text-body-1">
                        {{ formatDate(project.createdAt) }}
                      </div>
                    </div>
                  </div>
                </VCol>
                <VCol cols="12" md="6">
                  <div class="d-flex align-center ga-2">
                    <VIcon icon="mdi-calendar-edit" />
                    <div>
                      <div class="text-caption text-medium-emphasis">
                        Дата обновления
                      </div>
                      <div class="text-body-1">
                        {{ formatDate(project.updatedAt) }}
                      </div>
                    </div>
                  </div>
                </VCol>
              </VRow>

              <VDivider class="my-6" />

              <div class="mb-6">
                <h3 class="text-h6 mb-4">Участники</h3>
                <VAlert
                  v-if="membershipsError"
                  type="error"
                  variant="tonal"
                  class="mb-4"
                >
                  {{ getErrorMessageResponse(membershipsError) }}
                </VAlert>
                <VList v-else-if="memberships && memberships.length > 0">
                  <VListItem
                    v-for="membership in memberships"
                    :key="membership.id"
                    :title="membership.name"
                    :subtitle="`Роль: ${getRoleText(membership.role)}`"
                    class="mb-2"
                  >
                    <template #prepend>
                      <VIcon icon="mdi-account" class="mr-4" />
                    </template>
                    <template #append>
                      <VChip
                        :color="getRoleColor(membership.role)"
                        size="small"
                        variant="tonal"
                      >
                        {{ membership.role }}
                      </VChip>
                    </template>
                  </VListItem>
                </VList>
                <VAlert v-else type="info" variant="tonal">
                  В проекте пока нет участников
                </VAlert>
              </div>

              <VDivider class="my-6" />

              <div>
                <h3 class="text-h6 mb-4">Задачи</h3>
                <VAlert
                  v-if="tasksError"
                  type="error"
                  variant="tonal"
                  class="mb-4"
                >
                  {{ getErrorMessageResponse(tasksError) }}
                </VAlert>
                <VList v-else-if="tasks && tasks.length > 0">
                  <VListItem
                    v-for="task in tasks"
                    :key="task.id"
                    :title="task.title"
                    :subtitle="task.description || 'Без описания'"
                    class="mb-2"
                  >
                    <template #prepend>
                      <VCheckbox
                        :model-value="task.completed"
                        readonly
                        :color="task.completed ? 'success' : 'default'"
                        class="mr-4"
                      />
                    </template>
                    <template #append>
                      <div class="d-flex flex-column align-end ga-2">
                        <VChip
                          :color="task.completed ? 'success' : 'default'"
                          size="small"
                          variant="tonal"
                        >
                          {{ task.completed ? "Выполнена" : "В работе" }}
                        </VChip>
                        <div
                          v-if="task.deadline"
                          class="d-flex align-center ga-1 text-caption text-medium-emphasis"
                        >
                          <VIcon icon="mdi-calendar-clock" size="x-small" />
                          <span>Срок: {{ formatDate(task.deadline) }}</span>
                        </div>
                        <div
                          class="d-flex align-center ga-1 text-caption text-medium-emphasis"
                        >
                          <VIcon icon="mdi-calendar-edit" size="x-small" />
                          <span
                            >Обновлено: {{ formatDate(task.updatedAt) }}</span
                          >
                        </div>
                      </div>
                    </template>
                  </VListItem>
                </VList>
                <VAlert v-else type="info" variant="tonal">
                  В проекте пока нет задач
                </VAlert>
              </div>
            </div>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </VContainer>
</template>

<script setup lang="ts">
import type { Project, Membership, Task } from "@/types/project";
import { MembershipRole } from "@/enums/MembershipRole";
import { formatDate } from "@/utils/date";

const route = useRoute();
const { project: projectService } = useServices();

const projectId = computed(() => route.params.id as string);

const {
  data: project,
  pending: projectPending,
  error: projectError,
} = useAsyncData<Project>(`project-${projectId.value}`, () =>
  projectService.getOne(projectId.value)
);

const {
  data: memberships,
  pending: membershipsPending,
  error: membershipsError,
} = useAsyncData<Membership[]>(`project-memberships-${projectId.value}`, () =>
  projectService.getMemberships(projectId.value)
);

const {
  data: tasks,
  pending: tasksPending,
  error: tasksError,
} = useAsyncData<Task[]>(`project-tasks-${projectId.value}`, () =>
  projectService.getTasks(projectId.value)
);

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
