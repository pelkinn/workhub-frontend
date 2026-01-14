<template>
  <VContainer class="fill-height" fluid>
    <VRow align="center" justify="center">
      <VCol cols="12" sm="8" md="6" lg="4">
        <VCard>
          <VCardTitle class="text-h5 text-center pa-6">
            Регистрация
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
              <VTextField
                v-model="v$.name.$model"
                label="Имя (необязательно)"
                :error-messages="getErrorMessage(v$.name)"
                :error="v$.name.$error"
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
                Зарегистрироваться
              </VBtn>
            </VForm>
          </VCardText>
          <VCardActions class="justify-center pb-4">
            <VBtn variant="text" to="/login"> Уже есть аккаунт? Войти </VBtn>
          </VCardActions>
        </VCard>
      </VCol>
    </VRow>
  </VContainer>
</template>

<script setup lang="ts">
import { useVuelidate } from "@vuelidate/core";
import { required, email, minLength, helpers } from "@vuelidate/validators";
import type { Register } from "@/types/auth";
import { getErrorMessage } from "@/utils/validator";

const { auth } = useServices();

const form = ref<Register>({
  email: "",
  password: "",
  name: null,
});

const loading = ref(false);

const rules = computed(() => ({
  email: {
    required: helpers.withMessage("Обязательное поле", required),
    email: helpers.withMessage("Некорректный Email", email),
  },
  password: {
    required: helpers.withMessage("Обязательное поле", required),
    minLength: helpers.withMessage("Минимум 8 символов", minLength(8)),
    containsDigit: helpers.withMessage("Минимум одна цифра", containsDigit),
  },
  name: {
    minLength: helpers.withMessage("Минимум 2 символа", minLength(2)),
  },
}));

const v$ = useVuelidate(rules, form);

const handleSubmit = async () => {
  const isValid = await v$.value.$validate();
  if (!isValid) return;

  loading.value = true;
  try {
    await auth.register(form.value);
    await navigateTo("/login");
  } catch (error) {
    console.error("Ошибка регистрации:", error);
  } finally {
    loading.value = false;
  }
};
</script>
