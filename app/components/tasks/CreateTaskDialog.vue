<template>
  <VDialog v-model="modelValue" max-width="600">
    <VCard>
      <VCardTitle class="text-h5 pa-6">
        {{ isEditMode ? "Редактировать задачу" : "Создать задачу" }}
      </VCardTitle>
      <VCardText>
        <VForm @submit.prevent="handleSubmit">
          <VTextField
            v-model="v$.title.$model"
            label="Название"
            :error-messages="getErrorMessage(v$.title)"
            :error="v$.title.$error"
            variant="outlined"
            class="mb-4"
          />
          <VTextarea
            v-model="v$.description.$model"
            label="Описание"
            :error-messages="getErrorMessage(v$.description)"
            :error="v$.description.$error"
            variant="outlined"
            rows="5"
            class="mb-4"
          />
          <VTextField
            :model-value="deadlineDateDisplay"
            label="Дата выполнения"
            prepend-icon="mdi-calendar"
            readonly
            variant="outlined"
            class="mb-4"
          >
            <VDialog
              v-model="deadlineDateDialogOpen"
              activator="parent"
              width="auto"
            >
              <VCard>
                <VCardText>
                  <VDatePicker v-model="deadlineDate" />
                </VCardText>
                <VCardActions>
                  <VSpacer />
                  <VBtn variant="text" @click="deadlineDateDialogOpen = false">
                    Закрыть
                  </VBtn>
                </VCardActions>
              </VCard>
            </VDialog>
          </VTextField>
          <VTextField
            :model-value="deadlineTimeDisplay"
            label="Время выполнения"
            prepend-icon="mdi-clock-time-four-outline"
            readonly
            variant="outlined"
            class="mb-4"
          >
            <VDialog
              v-model="deadlineTimeDialogOpen"
              activator="parent"
              width="auto"
            >
              <VCard>
                <VCardText>
                  <VTimePicker v-model="deadlineTime" />
                </VCardText>
                <VCardActions>
                  <VSpacer />
                  <VBtn variant="text" @click="deadlineTimeDialogOpen = false">
                    Закрыть
                  </VBtn>
                </VCardActions>
              </VCard>
            </VDialog>
          </VTextField>
          <VCardActions>
            <VSpacer />
            <VBtn variant="text" @click="handleCancel"> Отмена </VBtn>
            <VBtn type="submit" color="primary" :loading="loading">
              {{ isEditMode ? "Сохранить" : "Создать" }}
            </VBtn>
          </VCardActions>
        </VForm>
      </VCardText>
    </VCard>

    <VSnackbar
      v-model="snackbar.show"
      :text="snackbar.text"
      location="top right"
      :color="snackbar.color"
      timeout="5000"
    />
  </VDialog>
</template>

<script setup lang="ts">
import { useVuelidate } from "@vuelidate/core";
import { required, minLength, maxLength, helpers } from "@vuelidate/validators";
import type { CreateTask, UpdateTask } from "@/types/task";
import { getErrorMessage } from "@/utils/validator";
import { getErrorMessageResponse } from "@/utils/error";

const props = defineProps<{
  projectId: string;
  taskId?: string;
  initialTask?: {
    title: string;
    description: string;
    deadline: string | null;
  };
}>();

const modelValue = defineModel<boolean>();

const emit = defineEmits<{
  created: [];
  updated: [];
}>();

const isEditMode = computed(() => !!props.taskId);

const { task: taskService } = useServices();

const loading = ref(false);

const snackbar = ref({
  show: false,
  text: "",
  color: "success",
});

const form = ref<CreateTask>({
  title: "",
  description: "",
  deadline: null,
});

const deadlineDate = ref<string | null>(null);
const deadlineTime = ref<string | null>(null);
const deadlineDateDialogOpen = ref(false);
const deadlineTimeDialogOpen = ref(false);

const deadlineDateDisplay = computed(() => {
  if (!deadlineDate.value) return "";
  const date = new Date(deadlineDate.value);
  return date.toLocaleDateString("ru-RU");
});

const deadlineTimeDisplay = computed(() => {
  if (!deadlineTime.value) return "";
  return deadlineTime.value;
});

const rules = {
  title: {
    required: helpers.withMessage("Обязательное поле", required),
    minLength: helpers.withMessage("Минимум 3 символа", minLength(3)),
    maxLength: helpers.withMessage("Максимум 500 символов", maxLength(500)),
  },
  description: {
    required: helpers.withMessage("Обязательное поле", required),
    minLength: helpers.withMessage("Минимум 3 символа", minLength(3)),
    maxLength: helpers.withMessage("Максимум 5000 символов", maxLength(5000)),
  },
};

const v$ = useVuelidate(rules, form);

const initializeForm = () => {
  if (props.initialTask) {
    form.value.title = props.initialTask.title;
    form.value.description = props.initialTask.description || "";
    form.value.deadline = props.initialTask.deadline;

    if (props.initialTask.deadline) {
      const date = new Date(props.initialTask.deadline);
      deadlineDate.value = date.toISOString().split("T")[0] || null;
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      deadlineTime.value = `${hours}:${minutes}`;
    } else {
      deadlineDate.value = null;
      deadlineTime.value = null;
    }
  } else {
    form.value.title = "";
    form.value.description = "";
    form.value.deadline = null;
    deadlineDate.value = null;
    deadlineTime.value = null;
  }
  deadlineDateDialogOpen.value = false;
  deadlineTimeDialogOpen.value = false;
  v$.value.$reset();
};

const handleCancel = () => {
  modelValue.value = false;
  initializeForm();
};

const getDeadlineISO = () => {
  if (!deadlineDate.value) return null;
  const date = new Date(deadlineDate.value);

  if (deadlineTime.value) {
    const [hours, minutes] = deadlineTime.value.split(":").map(Number);
    date.setHours(hours || 0, minutes || 0);
  }

  return date.toISOString();
};

const showSnackbar = (text: string, color: "success" | "error") => {
  snackbar.value.text = text;
  snackbar.value.color = color;
  snackbar.value.show = true;
};

const handleSubmit = async () => {
  const isValid = await v$.value.$validate();
  if (!isValid) return;

  loading.value = true;
  try {
    if (isEditMode.value && props.taskId) {
      const updateData: UpdateTask = {
        title: form.value.title,
        description: form.value.description,
        deadline: getDeadlineISO(),
      };
      await taskService.update(props.projectId, props.taskId, updateData);
      showSnackbar("Задача успешно обновлена", "success");
      emit("updated");
    } else {
      const createData: CreateTask = {
        title: form.value.title,
        description: form.value.description,
        deadline: getDeadlineISO(),
      };
      await taskService.create(props.projectId, createData);
      showSnackbar("Задача успешно создана", "success");
      emit("created");
    }

    handleCancel();
  } catch (error: unknown) {
    showSnackbar(getErrorMessageResponse(error), "error");
  } finally {
    loading.value = false;
  }
};

watch(
  () => modelValue.value,
  (newValue) => {
    if (!newValue) {
      initializeForm();
    } else if (newValue && props.initialTask) {
      initializeForm();
    }
  }
);

watch(
  () => props.initialTask,
  () => {
    if (modelValue.value && props.initialTask) {
      initializeForm();
    }
  },
  { deep: true }
);
</script>
