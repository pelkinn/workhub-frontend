<template>
  <VContainer class="page-shell">
    <VRow>
      <VCol cols="12">
        <VCard class="section-card" variant="tonal" rounded="xl">
          <VCardTitle class="pa-6 d-flex flex-wrap ga-4 align-center">
            <div>
              <div class="text-overline text-secondary">Ваши проекты</div>
              <div class="text-h5">Проекты</div>
            </div>
            <VSpacer />
            <VBtn
              color="primary"
              rounded="pill"
              prepend-icon="mdi-plus"
              @click="showCreateDialog = true"
            >
              Создать проект
            </VBtn>
          </VCardTitle>
          <VDivider />
          <VCardText class="pa-6">
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

            <div
              v-else-if="projects && projects.length > 0"
              class="d-flex flex-column ga-4"
            >
              <VCard
                v-for="project in projects"
                :key="project.id"
                variant="tonal"
                rounded="lg"
                class="pa-4 cursor-pointer"
                @click="navigateTo(`/projects/${project.id}`)"
              >
                <div class="d-flex flex-column flex-md-row ga-4">
                  <div class="d-flex align-start ga-3 flex-grow-1">
                    <VAvatar color="primary" variant="tonal" rounded="lg">
                      <VIcon icon="mdi-folder-outline" />
                    </VAvatar>
                    <div>
                      <div class="text-h6 mb-1">{{ project.name }}</div>
                      <div class="text-body-2 text-medium-emphasis">
                        {{ project.description || "Описание отсутствует" }}
                      </div>
                      <div class="d-flex flex-wrap ga-2 mt-3">
                        <VChip
                          size="small"
                          color="secondary"
                          variant="tonal"
                          prepend-icon="mdi-account-group"
                        >
                          {{ project.membersCount }} участников
                        </VChip>
                        <VChip
                          size="small"
                          color="primary"
                          variant="tonal"
                          prepend-icon="mdi-format-list-checks"
                        >
                          {{ project.tasksCount }} задач
                        </VChip>
                      </div>
                    </div>
                  </div>
                  <div class="d-flex flex-column align-start align-md-end ga-2">
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
                      <span>Обновлен: {{ formatDate(project.updatedAt) }}</span>
                    </div>
                  </div>
                </div>
              </VCard>
            </div>

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
