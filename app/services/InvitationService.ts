import type { $Fetch } from "nitropack";
import type { RuntimeConfig } from "nuxt/schema";
import type { Invitation, CreateInvitation } from "@/types/invitation";

export class InvitationService {
  constructor(protected api: $Fetch, protected runtimeConfig: RuntimeConfig) {}

  create(projectId: string, body: CreateInvitation) {
    return this.api<{ token: string }>(`/projects/${projectId}/invitations`, {
      method: "post",
      body,
    });
  }

  getByToken(token: string) {
    return this.api<Invitation>(
      `${this.runtimeConfig.public.apiBaseUrl}/invitations/${token}`
    );
  }

  accept(token: string) {
    return this.api(`/invitations/${token}/accept`, {
      method: "post",
    });
  }
}
