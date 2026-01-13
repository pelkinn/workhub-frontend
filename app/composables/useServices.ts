import { AuthService } from "~/services/AuthService";

export const useServices = () => {
  const { $api } = useNuxtApp();
  const runtimeConfig = useRuntimeConfig();

  return {
    auth: new AuthService($api, runtimeConfig),
  };
};
