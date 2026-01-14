import type { $Fetch } from "nitropack";
import type { RuntimeConfig } from "nuxt/schema";
import type { Project, CreateProject, Membership, Task } from "@/types/project";

export class ProjectService {
  constructor(protected api: $Fetch, protected runtimeConfig: RuntimeConfig) {}

  getAll() {
    return this.api<Project[]>(`/projects`);
  }

  getOne(id: string) {
    return this.api<Project>(`/projects/${id}`);
  }

  create(body: CreateProject) {
    return this.api<Project>(`/projects`, {
      method: "post",
      body,
    });
  }

  getMemberships(projectId: string) {
    return this.api<Membership[]>(`/projects/${projectId}/memberships`);
  }

  getTasks(projectId: string) {
    return this.api<Task[]>(`/projects/${projectId}/tasks`);
  }
}
