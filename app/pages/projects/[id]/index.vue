<template>
  <VContainer class="py-8">
    <VRow>
      <VCol cols="12">
        <VBtn
          variant="text"
          prepend-icon="mdi-arrow-left"
          class="mb-6"
          @click="navigateTo('/projects')"
        >
          НАЗАД К ПРОЕКТАМ
        </VBtn>

        <VProgressLinear
          v-if="projectPending"
          indeterminate
          color="primary"
          class="mb-4"
        />

        <VAlert v-if="projectError" type="error" variant="tonal" class="mb-6">
          {{ getErrorMessageResponse(projectError) }}
        </VAlert>

        <div v-if="!projectPending && project">
          <div class="d-flex justify-space-between align-center mb-8">
            <h1 class="text-h3 font-weight-bold">
              {{ project.name }}
            </h1>
            <div class="d-flex ga-2">
              <VBtn
                color="primary"
                variant="outlined"
                prepend-icon="mdi-history"
                @click="navigateTo(`/projects/${projectId}/logs`)"
              >
                Логи проекта
              </VBtn>
              <VBtn
                v-if="isOwner"
                color="error"
                variant="outlined"
                prepend-icon="mdi-delete"
                @click="deleteDialogOpen = true"
              >
                Удалить
              </VBtn>
            </div>
          </div>

          <div class="mb-8">
            <h2 class="text-h6 mb-4">Описание</h2>
            <p class="text-body-1 text-medium-emphasis">
              {{ project.description || "Описание отсутствует" }}
            </p>
          </div>

          <VRow class="mb-8">
            <VCol cols="12" md="6">
              <div class="d-flex align-center ga-3">
                <VIcon icon="mdi-calendar-plus" size="large" color="primary" />
                <div>
                  <div class="text-caption text-medium-emphasis mb-1">
                    Дата создания
                  </div>
                  <div class="text-body-1 font-weight-medium">
                    {{ formatDate(project.createdAt) }}
                  </div>
                </div>
              </div>
            </VCol>
            <VCol cols="12" md="6">
              <div class="d-flex align-center ga-3">
                <VIcon icon="mdi-calendar-edit" size="large" color="primary" />
                <div>
                  <div class="text-caption text-medium-emphasis mb-1">
                    Дата обновления
                  </div>
                  <div class="text-body-1 font-weight-medium">
                    {{ formatDate(project.updatedAt) }}
                  </div>
                </div>
              </div>
            </VCol>
          </VRow>

          <VDivider class="my-8" />

          <MemberShipsSection :project-id="projectId" />

          <VDivider class="my-8" />

          <TasksSection :project-id="projectId" />
        </div>
      </VCol>
    </VRow>

    <DeleteProjectDialog
      v-model="deleteDialogOpen"
      :project-id="projectId"
      :project-name="project?.name || ''"
      @deleted="handleDeleteSuccess"
    />
  </VContainer>
</template>

<script setup lang="ts">
import type { ProjectFull } from "@/types/project";
import { formatDate } from "@/utils/date";
import { getErrorMessageResponse } from "@/utils/error";
import TasksSection from "~/components/tasks/TasksSection.vue";
import MemberShipsSection from "~/components/memberships/MemberShipsSection.vue";
import DeleteProjectDialog from "~/components/projects/DeleteProjectDialog.vue";

const route = useRoute();
const { project: projectService } = useServices();
const userStore = useUserStore();

const projectId = computed(() => route.params.id as string);

const deleteDialogOpen = ref(false);

const {
  data: project,
  pending: projectPending,
  error: projectError,
} = useAsyncData<ProjectFull>(`project-${projectId.value}`, () =>
  projectService.getOne(projectId.value)
);

const isOwner = computed(() => {
  if (!userStore.user || !project.value) return false;
  return project.value.owner.id === userStore.user?.id;
});

const handleDeleteSuccess = async () => {
  await navigateTo("/projects");
};
</script>
