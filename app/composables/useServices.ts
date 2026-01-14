import { AuthService } from "~/services/AuthService";
import { ProjectService } from "~/services/ProjectService";

export const useServices = () => {
  const { $api } = useNuxtApp();
  const runtimeConfig = useRuntimeConfig();

  return {
    auth: new AuthService($api, runtimeConfig),
    project: new ProjectService($api, runtimeConfig),
  };
};
