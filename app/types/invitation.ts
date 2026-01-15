import type { MembershipRole } from "@/enums/MembershipRole";

export interface Invitation {
  id: string;
  email: string;
  role: MembershipRole.EDITOR | MembershipRole.VIEWER;
  token: string;
  projectId: string;
  project: {
    id: string;
    name: string;
    description: string;
  };
  createdAt: string;
}

export interface CreateInvitation {
  email: string;
  role: MembershipRole.EDITOR | MembershipRole.VIEWER;
}
