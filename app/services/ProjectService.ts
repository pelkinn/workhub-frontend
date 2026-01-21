import type { $Fetch } from "nitropack";
import type { RuntimeConfig } from "nuxt/schema";
import type {
  Project,
  CreateProject,
  Membership,
  ProjectFull,
} from "@/types/project";
import type { AuditLog } from "@/types/audit-log";

export class ProjectService {
  constructor(protected api: $Fetch, protected runtimeConfig: RuntimeConfig) {}

  getAll() {
    return this.api<Project[]>(`/projects`);
  }

  getOne(id: string) {
    return this.api<ProjectFull>(`/projects/${id}`);
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

  delete(id: string) {
    return this.api(`/projects/${id}`, {
      method: "delete",
    });
  }

  getAuditLogs(projectId: string) {
    return this.api<AuditLog[]>(`/projects/${projectId}/audit-logs`);
  }
}
