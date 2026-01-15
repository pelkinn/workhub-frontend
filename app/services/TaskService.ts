import type { $Fetch } from "nitropack";
import type { RuntimeConfig } from "nuxt/schema";
import type { Task, CreateTask, UpdateTask } from "@/types/task";

export class TaskService {
  constructor(protected api: $Fetch, protected runtimeConfig: RuntimeConfig) {}

  getTasks(projectId: string) {
    return this.api<Task[]>(`/projects/${projectId}/tasks`);
  }

  create(projectId: string, body: CreateTask) {
    return this.api<Task>(`/projects/${projectId}/tasks`, {
      method: "post",
      body,
    });
  }

  update(projectId: string, taskId: string, body: UpdateTask) {
    return this.api<Task>(`/projects/${projectId}/tasks/${taskId}`, {
      method: "put",
      body,
    });
  }

  delete(projectId: string, taskId: string) {
    return this.api(`/projects/${projectId}/tasks/${taskId}`, {
      method: "delete",
    });
  }
}
