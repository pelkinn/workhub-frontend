<template>
  <VDialog v-model="modelValue" max-width="600">
    <VCard>
      <VCardTitle class="text-h5 pa-6"> Создать проект </VCardTitle>
      <VCardText>
        <VForm @submit.prevent="handleSubmit">
          <VTextField
            v-model="v$.name.$model"
            label="Название"
            :error-messages="getErrorMessage(v$.name)"
            :error="v$.name.$error"
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
          <VCardActions>
            <VSpacer />
            <VBtn variant="text" @click="handleCancel"> Отмена </VBtn>
            <VBtn type="submit" color="primary" :loading="loading">
              Создать
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
import type { CreateProject } from "@/types/project";
import { getErrorMessage } from "@/utils/validator";

const modelValue = defineModel<boolean>();

const emit = defineEmits<{
  created: [];
}>();

const { project: projectService } = useServices();

const loading = ref(false);

const snackbar = ref({
  show: false,
  text: "",
  color: "success" as "success" | "error",
});

const form = ref<CreateProject>({
  name: "",
  description: "",
});

const rules = {
  name: {
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

const handleCancel = () => {
  modelValue.value = false;
  form.value.name = "";
  form.value.description = "";
  v$.value.$reset();
};

const handleSubmit = async () => {
  const isValid = await v$.value.$validate();
  if (!isValid) return;

  loading.value = true;
  try {
    await projectService.create(form.value);
    snackbar.value.text = "Проект успешно создан";
    snackbar.value.color = "success";
    snackbar.value.show = true;
    emit("created");
    handleCancel();
  } catch (error: unknown) {
    const message = (error as { response: { data: { message: string } } })
      ?.response?.data?.message;
    snackbar.value.text = message || "Произошла ошибка при создании проекта";
    snackbar.value.color = "error";
    snackbar.value.show = true;
  } finally {
    loading.value = false;
  }
};

watch(
  () => modelValue.value,
  (newValue) => {
    if (!newValue) {
      form.value.name = "";
      form.value.description = "";
      v$.value.$reset();
    }
  }
);
</script>
