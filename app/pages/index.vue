<template>
  <VContainer class="page-shell" fluid>
    <VRow class="align-center" dense>
      <VCol cols="12" md="7">
        <VChip
          color="secondary"
          variant="tonal"
          class="mb-4"
          prepend-icon="mdi-shimmer"
        >
          WorkHub для команд
        </VChip>
        <h1 class="text-h2 text-md-h1 font-weight-bold mb-4 hero-highlight">
          Управляйте проектами так, будто у вас личный штаб
        </h1>
        <p class="text-body-1 text-medium-emphasis mb-6">
          Задачи, участники и история проекта — в одном пространстве, где все
          видно сразу и ничего не теряется.
        </p>
        <div class="d-flex flex-wrap ga-3">
          <VBtn color="primary" size="large" rounded="pill" to="/projects">
            Перейти к проектам
          </VBtn>
          <VBtn
            color="secondary"
            variant="tonal"
            size="large"
            rounded="pill"
            to="/register"
          >
            Создать аккаунт
          </VBtn>
          <VBtn variant="text" size="large" to="/login">
            Уже есть аккаунт?
          </VBtn>
        </div>

        <div class="d-flex flex-wrap ga-4 mt-10">
          <VCard class="stat-card" variant="tonal">
            <VCardText>
              <div class="text-h5 font-weight-bold">1 место</div>
              <div class="text-caption text-medium-emphasis">для задач</div>
            </VCardText>
          </VCard>
          <VCard class="stat-card" variant="tonal">
            <VCardText>
              <div class="text-h5 font-weight-bold">24/7</div>
              <div class="text-caption text-medium-emphasis">
                доступ к проектам
              </div>
            </VCardText>
          </VCard>
          <VCard class="stat-card" variant="tonal">
            <VCardText>
              <div class="text-h5 font-weight-bold">0</div>
              <div class="text-caption text-medium-emphasis">
                лишних вкладок
              </div>
            </VCardText>
          </VCard>
        </div>
      </VCol>

      <VCol cols="12" md="5">
        <VCard class="hero-card pa-8" variant="tonal" rounded="xl">
          <VCardTitle class="text-h6 d-flex align-center ga-2">
            <VIcon icon="mdi-view-dashboard-outline" />
            Что внутри
          </VCardTitle>
          <VCardText>
            <VList bg-color="transparent" lines="two">
              <VListItem
                title="Проекты с контекстом"
                subtitle="Собирайте описание, сроки и историю в одном месте."
                prepend-icon="mdi-folder-outline"
              />
              <VListItem
                title="Команда в фокусе"
                subtitle="Роли, приглашения и доступы без лишней рутины."
                prepend-icon="mdi-account-group-outline"
              />
              <VListItem
                title="Задачи по приоритету"
                subtitle="Статусы, дедлайны и быстрые правки на лету."
                prepend-icon="mdi-check-circle-outline"
              />
              <VListItem
                title="Логи изменений"
                subtitle="Всегда понятно, что происходило в проекте."
                prepend-icon="mdi-history"
              />
            </VList>
          </VCardText>
          <VCardActions class="pt-0">
            <VBtn color="primary" variant="flat" rounded="pill" to="/register">
              Попробовать бесплатно
            </VBtn>
          </VCardActions>
        </VCard>
      </VCol>
    </VRow>

    <VRow class="mt-12" dense>
      <VCol cols="12" md="4">
        <VCard class="section-card" variant="tonal">
          <VCardText>
            <VAvatar color="primary" variant="tonal" size="48" class="mb-4">
              <VIcon icon="mdi-layers-outline" />
            </VAvatar>
            <div class="text-h6 mb-2">Структура без хаоса</div>
            <p class="text-body-2 text-medium-emphasis">
              Разделяйте задачи по этапам и держите все договоренности на виду.
            </p>
          </VCardText>
        </VCard>
      </VCol>
      <VCol cols="12" md="4">
        <VCard class="section-card" variant="tonal">
          <VCardText>
            <VAvatar color="secondary" variant="tonal" size="48" class="mb-4">
              <VIcon icon="mdi-rocket-launch-outline" />
            </VAvatar>
            <div class="text-h6 mb-2">Быстрый старт</div>
            <p class="text-body-2 text-medium-emphasis">
              Создайте проект за минуту и пригласите команду одним кликом.
            </p>
          </VCardText>
        </VCard>
      </VCol>
      <VCol cols="12" md="4">
        <VCard class="section-card" variant="tonal">
          <VCardText>
            <VAvatar color="info" variant="tonal" size="48" class="mb-4">
              <VIcon icon="mdi-radar" />
            </VAvatar>
            <div class="text-h6 mb-2">Прозрачность работы</div>
            <p class="text-body-2 text-medium-emphasis">
              Отслеживайте прогресс без созвонов и лишних таблиц.
            </p>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </VContainer>
</template>

<style scoped>
.hero-highlight {
  max-width: 560px;
}

.stat-card {
  min-width: 180px;
}
</style>
