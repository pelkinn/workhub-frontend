<template>
  <VContainer>
    <VRow>
      <VCol cols="12">
        <VCard>
          <VCardTitle
            class="text-h5 pa-6 d-flex justify-space-between align-center"
          >
            <span>Проекты</span>
            <VBtn color="primary" @click="showCreateDialog = true">
              Создать проект
            </VBtn>
          </VCardTitle>
          <VCardText>
            <CreateProjectDialog
              v-model="showCreateDialog"
              @created="refresh"
            />

            <VProgressLinear
              v-if="pending"
              indeterminate
              color="primary"
              class="mb-4"
            />

            <VAlert v-else-if="error" type="error" variant="tonal" class="mb-4">
              {{ getErrorMessageResponse(error) }}
            </VAlert>

            <VList v-else-if="projects && projects.length > 0">
              <VListItem
                v-for="project in projects"
                :key="project.id"
                :title="project.name"
                :subtitle="project.description"
                class="mb-4"
                style="cursor: pointer"
                @click="navigateTo(`/projects/${project.id}`)"
              >
                <template #prepend>
                  <VIcon icon="mdi-folder" class="mr-4" />
                </template>
                <template #append>
                  <div class="d-flex flex-column align-end ga-2">
                    <div class="d-flex align-center ga-3">
                      <div class="d-flex align-center ga-1">
                        <VIcon icon="mdi-account-group" size="small" />
                        <span class="text-caption">{{
                          project.membersCount
                        }}</span>
                      </div>
                      <div class="d-flex align-center ga-1">
                        <VIcon icon="mdi-format-list-checks" size="small" />
                        <span class="text-caption">{{
                          project.tasksCount
                        }}</span>
                      </div>
                    </div>
                    <div class="d-flex flex-column align-end ga-1">
                      <div
                        class="d-flex align-center ga-1 text-caption text-medium-emphasis"
                      >
                        <VIcon icon="mdi-calendar-plus" size="x-small" />
                        <span>Создан: {{ formatDate(project.createdAt) }}</span>
                      </div>
                      <div
                        class="d-flex align-center ga-1 text-caption text-medium-emphasis"
                      >
                        <VIcon icon="mdi-calendar-edit" size="x-small" />
                        <span
                          >Обновлен: {{ formatDate(project.updatedAt) }}</span
                        >
                      </div>
                    </div>
                  </div>
                </template>
              </VListItem>
            </VList>

            <VAlert v-else type="info" variant="tonal">
              У вас пока нет проектов. Создайте первый проект!
            </VAlert>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </VContainer>
</template>

<script setup lang="ts">
import type { Project } from "@/types/project";

const { project: projectService } = useServices();

const showCreateDialog = ref(false);

const {
  data: projects,
  pending,
  refresh,
  error,
} = useAsyncData<Project[]>("projects", () => projectService.getAll());
</script>
