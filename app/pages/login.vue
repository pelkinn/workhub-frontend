<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card>
          <v-card-title class="text-h5 text-center pa-6">
            Авторизация
          </v-card-title>
          <v-card-text>
            <v-form @submit.prevent="handleSubmit">
              <v-text-field
                v-model="v$.email.$model"
                label="Email"
                type="email"
                :error-messages="getErrorMessage(v$.email)"
                :error="v$.email.$error"
                variant="outlined"
                class="mb-4"
              />
              <v-text-field
                v-model="v$.password.$model"
                label="Пароль"
                type="password"
                :error-messages="getErrorMessage(v$.password)"
                :error="v$.password.$error"
                variant="outlined"
                class="mb-4"
              />
              <v-btn
                type="submit"
                color="primary"
                block
                size="large"
                :loading="loading"
              >
                Войти
              </v-btn>
            </v-form>
          </v-card-text>
          <v-card-actions class="justify-center pb-4">
            <v-btn variant="text" to="/register">
              Нет аккаунта? Зарегистрироваться
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-snackbar
      v-model="snackbar.show"
      :text="snackbar.text"
      location="top right"
      color="error"
      timeout="5000"
    />
  </v-container>
</template>

<script setup lang="ts">
import { useVuelidate } from "@vuelidate/core";
import { required, email, minLength, helpers } from "@vuelidate/validators";
import type { Login } from "@/types/auth";
import { getErrorMessage } from "@/utils/validator";

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
    await navigateTo("/");
  } catch (error: unknown) {
    const message = (error as { response: { data: { message: string } } })
      ?.response?.data?.message;
    snackbar.text = message || "Произошла ошибка при авторизации";
    snackbar.show = true;
  } finally {
    loading.value = false;
  }
};
</script>
