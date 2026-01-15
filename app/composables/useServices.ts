import { AuthService } from "~/services/AuthService";
import { ProjectService } from "~/services/ProjectService";
import { TaskService } from "~/services/TaskService";
import { InvitationService } from "~/services/InvitationService";

export const useServices = () => {
  const { $api } = useNuxtApp();
  const runtimeConfig = useRuntimeConfig();

  return {
    auth: new AuthService($api, runtimeConfig),
    project: new ProjectService($api, runtimeConfig),
    task: new TaskService($api, runtimeConfig),
    invitation: new InvitationService($api, runtimeConfig),
  };
};
