<template>
  <VDialog v-model="modelValue" max-width="600">
    <VCard>
      <VCardTitle class="text-h5 pa-6"> Отправить приглашение </VCardTitle>
      <VCardText>
        <VForm @submit.prevent="handleSubmit">
          <VTextField
            v-model="v$.email.$model"
            label="Email"
            type="email"
            :error-messages="getErrorMessage(v$.email)"
            :error="v$.email.$error"
            variant="outlined"
            class="mb-4"
          />
          <VSelect
            v-model="v$.role.$model"
            label="Роль"
            :items="roleItems"
            :error-messages="getErrorMessage(v$.role)"
            :error="v$.role.$error"
            variant="outlined"
            class="mb-4"
          />
          <VCardActions>
            <VSpacer />
            <VBtn variant="text" @click="handleCancel"> Отмена </VBtn>
            <VBtn type="submit" color="primary" :loading="loading">
              Отправить приглашение
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
import { required, email, helpers } from "@vuelidate/validators";
import type { CreateInvitation } from "@/types/invitation";
import { MembershipRole } from "@/enums/MembershipRole";
import { getErrorMessage } from "@/utils/validator";
import { getErrorMessageResponse } from "@/utils/error";

const props = defineProps<{
  projectId: string;
}>();

const modelValue = defineModel<boolean>();

const emit = defineEmits<{
  created: [];
}>();

const { invitation: invitationService } = useServices();

const loading = ref(false);

const snackbar = ref({
  show: false,
  text: "",
  color: "success" as "success" | "error",
});

const form = ref<CreateInvitation>({
  email: "",
  role: MembershipRole.EDITOR,
});

const roleItems = [
  { title: "Редактор", value: MembershipRole.EDITOR },
  { title: "Наблюдатель", value: MembershipRole.VIEWER },
];

const rules = {
  email: {
    required: helpers.withMessage("Обязательное поле", required),
    email: helpers.withMessage("Некорректный Email", email),
  },
  role: {
    required: helpers.withMessage("Обязательное поле", required),
  },
};

const v$ = useVuelidate(rules, form);

const handleCancel = () => {
  modelValue.value = false;
  form.value.email = "";
  form.value.role = MembershipRole.EDITOR;
  v$.value.$reset();
};

const handleSubmit = async () => {
  const isValid = await v$.value.$validate();
  if (!isValid) return;

  loading.value = true;
  try {
    await invitationService.create(props.projectId, form.value);
    snackbar.value.text = "Приглашение успешно отправлено";
    snackbar.value.color = "success";
    snackbar.value.show = true;
    emit("created");
    handleCancel();
  } catch (error: unknown) {
    snackbar.value.text = getErrorMessageResponse(
      error,
      "Произошла ошибка при отправке приглашения"
    );
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
      form.value.email = "";
      form.value.role = MembershipRole.EDITOR;
      v$.value.$reset();
    }
  }
);
</script>
