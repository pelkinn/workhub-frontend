export default defineNuxtPlugin(async (nuxtApp) => {
  const accessTokenCookie = useCookie("accessToken");

  const { fetchUser } = useUserStore(nuxtApp.vueApp.$nuxt.$pinia);

  if (!accessTokenCookie.value) {
    return;
  }

  try {
    await fetchUser();
  } catch (err: unknown) {
    if (err instanceof Error) {
      const message = err.message || "Что-то пошло не так.йцуйцуйцу..";
      console.log(err);
      showError({ statusCode: 500, message });
    }
  }
});
