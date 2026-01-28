<template>
  <div>
    <div class="d-flex align-center justify-space-between mb-6">
      <h2 class="text-h6">Задачи</h2>
      <VBtn
        color="primary"
        prepend-icon="mdi-plus"
        size="large"
        rounded="pill"
        @click="dialogOpen = true"
      >
        Создать задачу
      </VBtn>
    </div>
    <div v-if="tasksPending" class="d-flex justify-center py-8">
      <VProgressCircular indeterminate color="primary" />
    </div>
    <VAlert v-else-if="tasksError" type="error" variant="tonal" class="mb-4">
      {{ getErrorMessageResponse(tasksError) }}
    </VAlert>
    <div v-else-if="tasks && tasks.length > 0" class="d-flex flex-column ga-4">
      <VCard
        v-for="task in tasks"
        :key="task.id"
        variant="tonal"
        class="pa-4 task-card"
        rounded="lg"
      >
        <div class="d-flex ga-4">
          <div class="d-flex align-start pt-1">
            <VCheckbox
              :model-value="task.completed"
              :color="task.completed ? 'success' : 'default'"
              density="compact"
              :loading="updatingTaskId === task.id"
              @update:model-value="
                (value) => handleToggleCompleted(task, !!value)
              "
            />
          </div>
          <div class="flex-grow-1">
            <h3 class="text-h6 mb-2">{{ task.title }}</h3>
            <p
              v-if="task.description"
              class="text-body-2 text-medium-emphasis mb-4"
            >
              {{ task.description }}
            </p>
            <div v-else class="text-body-2 text-medium-emphasis mb-4">
              Без описания
            </div>
          </div>
          <div class="d-flex flex-column align-end ga-3">
            <div class="d-flex ga-2">
              <VBtn
                icon="mdi-pencil"
                size="small"
                variant="text"
                color="primary"
                @click="openEditDialog(task)"
              />
              <VBtn
                icon="mdi-delete"
                size="small"
                variant="text"
                color="error"
                :loading="deletingTaskId === task.id"
                @click="handleDelete(task.id)"
              />
            </div>
            <VChip
              :color="task.completed ? 'success' : 'default'"
              size="small"
              variant="flat"
            >
              {{ task.completed ? "Выполнена" : "В работе" }}
            </VChip>
            <div
              v-if="task.deadline"
              class="d-flex align-center ga-1 text-caption text-medium-emphasis"
            >
              <VIcon icon="mdi-calendar-clock" size="small" />
              <span>Срок: {{ formatDate(task.deadline) }}</span>
            </div>
            <div
              class="d-flex align-center ga-1 text-caption text-medium-emphasis"
            >
              <VIcon icon="mdi-calendar-edit" size="small" />
              <span>Обновлено: {{ formatDate(task.updatedAt) }}</span>
            </div>
          </div>
        </div>
      </VCard>
    </div>
    <VAlert v-else type="info" variant="tonal">
      В проекте пока нет задач
    </VAlert>

    <CreateTaskDialog
      v-model="dialogOpen"
      :project-id="projectId"
      :task-id="editingTaskId"
      :initial-task="editingTask"
      @created="refreshTasks"
      @updated="refreshTasks"
    />
  </div>
</template>

<script setup lang="ts">
import type { Task, UpdateTask } from "@/types/task";
import { formatDate } from "@/utils/date";
import { getErrorMessageResponse } from "@/utils/error";
import CreateTaskDialog from "./CreateTaskDialog.vue";

const props = defineProps<{
  projectId: string;
}>();

const { task: taskService } = useServices();

const dialogOpen = ref(false);
const editingTaskId = ref<string | undefined>(undefined);
const editingTask = ref<
  | {
      title: string;
      description: string;
      deadline: string | null;
    }
  | undefined
>(undefined);
const deletingTaskId = ref<string | null>(null);
const updatingTaskId = ref<string | null>(null);

const {
  data: tasks,
  pending: tasksPending,
  error: tasksError,
  refresh: refreshTasks,
} = useAsyncData<Task[]>(`project-tasks-${props.projectId}`, () =>
  taskService.getTasks(props.projectId)
);

const openEditDialog = (task: Task) => {
  editingTaskId.value = task.id;
  editingTask.value = {
    title: task.title,
    description: task.description || "",
    deadline: task.deadline,
  };
  dialogOpen.value = true;
};

const handleDelete = async (taskId: string) => {
  if (!confirm("Вы уверены, что хотите удалить эту задачу?")) {
    return;
  }

  deletingTaskId.value = taskId;
  try {
    await taskService.delete(props.projectId, taskId);
    await refreshTasks();
  } catch (error: unknown) {
    const message = getErrorMessageResponse(
      error,
      "Произошла ошибка при удалении задачи"
    );
    alert(message);
  } finally {
    deletingTaskId.value = null;
  }
};

const handleToggleCompleted = async (task: Task, completed: boolean) => {
  updatingTaskId.value = task.id;
  try {
    const updateData: UpdateTask = {
      completed,
    };
    const updatedTask = await taskService.update(
      props.projectId,
      task.id,
      updateData
    );

    if (tasks.value) {
      const taskIndex = tasks.value.findIndex((t) => t.id === task.id);
      if (taskIndex !== -1 && tasks.value[taskIndex]) {
        Object.assign(tasks.value[taskIndex], updatedTask);
      }
    }
  } catch (error: unknown) {
    const message = getErrorMessageResponse(
      error,
      "Произошла ошибка при обновлении задачи"
    );
    alert(message);
  } finally {
    updatingTaskId.value = null;
  }
};

watch(dialogOpen, (newValue) => {
  if (!newValue) {
    editingTaskId.value = undefined;
    editingTask.value = undefined;
  }
});
</script>
