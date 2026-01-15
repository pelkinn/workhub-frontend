<template>
  <VContainer class="fill-height" fluid>
    <VRow align="center" justify="center">
      <VCol cols="12" sm="8" md="6" lg="4">
        <VCard>
          <VCardTitle class="text-h5 text-center pa-6">
            Авторизация
          </VCardTitle>
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
              <VTextField
                v-model="v$.password.$model"
                label="Пароль"
                type="password"
                :error-messages="getErrorMessage(v$.password)"
                :error="v$.password.$error"
                variant="outlined"
                class="mb-4"
              />
              <VBtn
                type="submit"
                color="primary"
                block
                size="large"
                :loading="loading"
              >
                Войти
              </VBtn>
            </VForm>
          </VCardText>
          <VCardActions class="justify-center pb-4">
            <VBtn variant="text" to="/register">
              Нет аккаунта? Зарегистрироваться
            </VBtn>
          </VCardActions>
        </VCard>
      </VCol>
    </VRow>

    <VSnackbar
      v-model="snackbar.show"
      :text="snackbar.text"
      location="top right"
      color="error"
      timeout="5000"
    />
  </VContainer>
</template>

<script setup lang="ts">
import { useVuelidate } from "@vuelidate/core";
import { required, email, minLength, helpers } from "@vuelidate/validators";
import type { Login } from "@/types/auth";
import { getErrorMessage } from "@/utils/validator";
import { getErrorMessageResponse } from "@/utils/error";

const route = useRoute();
const { login } = useUserStore();

const form = reactive<Login>({
  email: "",
  password: "",
});

const loading = ref(false);

const snackbar = reactive({
  show: false,
  text: "",
});

const redirectUrl = computed(() => {
  const redirect = route.query.redirect as string | undefined;
  const returnUrl = route.query.returnUrl as string | undefined;
  return redirect || returnUrl || "/projects";
});

const rules = {
  email: {
    required: helpers.withMessage("Обязательное поле", required),
    email: helpers.withMessage("Некорректный Email", email),
  },
  password: {
    required: helpers.withMessage("Обязательное поле", required),
    minLength: helpers.withMessage("Обязательное поле", minLength(6)),
  },
};

const v$ = useVuelidate(rules, form);

const handleSubmit = async () => {
  const isValid = await v$.value.$validate();
  if (!isValid) return;

  loading.value = true;
  try {
    await login(form.email, form.password);
    await navigateTo(redirectUrl.value);
  } catch (error: unknown) {
    snackbar.text = getErrorMessageResponse(
      error,
      "Произошла ошибка при авторизации"
    );
    snackbar.show = true;
  } finally {
    loading.value = false;
  }
};
</script>
