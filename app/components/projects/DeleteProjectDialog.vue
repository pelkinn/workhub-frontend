<template>
  <VDialog v-model="modelValue" max-width="500">
    <VCard>
      <VCardTitle class="text-h6">Подтверждение удаления</VCardTitle>
      <VCardText>
        Вы уверены, что хотите удалить проект "{{ projectName }}"? Это действие
        нельзя отменить.
      </VCardText>
      <VCardActions>
        <VSpacer />
        <VBtn variant="text" :disabled="loading" @click="handleCancel">
          Отмена
        </VBtn>
        <VBtn color="error" variant="flat" :loading="loading" @click="handleDelete">
          Удалить
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script setup lang="ts">
const props = defineProps<{
  projectId: string;
  projectName: string;
}>();

const modelValue = defineModel<boolean>();

const emit = defineEmits<{
  deleted: [];
}>();

const { project: projectService } = useServices();

const loading = ref(false);

const handleCancel = () => {
  modelValue.value = false;
};

const handleDelete = async () => {
  loading.value = true;
  try {
    await projectService.delete(props.projectId);
    emit("deleted");
    modelValue.value = false;
  } catch (error) {
    console.error("Ошибка при удалении проекта:", error);
  } finally {
    loading.value = false;
  }
};
</script>



