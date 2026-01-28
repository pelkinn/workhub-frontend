<template>
  <VContainer class="page-shell">
    <VRow>
      <VCol cols="12">
        <VBtn
          variant="text"
          prepend-icon="mdi-arrow-left"
          class="mb-6 back-link"
          @click="navigateTo('/projects')"
        >
          Назад к проектам
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
          <VSheet class="hero-card pa-6 pa-md-8 mb-8" rounded="xl">
            <div
              class="d-flex flex-column flex-md-row justify-space-between align-start ga-6"
            >
              <div>
                <div class="text-overline text-secondary mb-2">
                  Проект
                </div>
                <h1 class="text-h3 text-md-h2 font-weight-bold mb-2">
                  {{ project.name }}
                </h1>
                <p class="text-body-1 text-medium-emphasis">
                  {{ project.description || "Описание отсутствует" }}
                </p>
              </div>
              <div class="d-flex flex-wrap ga-2">
                <VBtn
                  color="primary"
                  variant="flat"
                  rounded="pill"
                  prepend-icon="mdi-history"
                  @click="navigateTo(`/projects/${projectId}/logs`)"
                >
                  Логи проекта
                </VBtn>
                <VBtn
                  v-if="isOwner"
                  color="error"
                  variant="tonal"
                  rounded="pill"
                  prepend-icon="mdi-delete"
                  @click="deleteDialogOpen = true"
                >
                  Удалить
                </VBtn>
              </div>
            </div>

            <VRow class="mt-6">
              <VCol cols="12" md="6">
                <VSheet class="meta-card pa-4" rounded="lg">
                  <div class="d-flex align-center ga-3">
                    <VIcon
                      icon="mdi-calendar-plus"
                      size="large"
                      color="primary"
                    />
                    <div>
                      <div class="text-caption text-medium-emphasis mb-1">
                        Дата создания
                      </div>
                      <div class="text-body-1 font-weight-medium">
                        {{ formatDate(project.createdAt) }}
                      </div>
                    </div>
                  </div>
                </VSheet>
              </VCol>
              <VCol cols="12" md="6">
                <VSheet class="meta-card pa-4" rounded="lg">
                  <div class="d-flex align-center ga-3">
                    <VIcon
                      icon="mdi-calendar-edit"
                      size="large"
                      color="primary"
                    />
                    <div>
                      <div class="text-caption text-medium-emphasis mb-1">
                        Дата обновления
                      </div>
                      <div class="text-body-1 font-weight-medium">
                        {{ formatDate(project.updatedAt) }}
                      </div>
                    </div>
                  </div>
                </VSheet>
              </VCol>
            </VRow>
          </VSheet>

          <VCard class="section-card mb-8" variant="tonal">
            <VCardText>
              <MemberShipsSection :project-id="projectId" />
            </VCardText>
          </VCard>

          <VCard class="section-card" variant="tonal">
            <VCardText>
              <TasksSection :project-id="projectId" />
            </VCardText>
          </VCard>
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

<style scoped>
.back-link {
  letter-spacing: 0.08em;
}
</style>
