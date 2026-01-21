import type { AuditLogAction } from "@/enums/AuditLogAction";
import type { UserProfile } from "./auth";

export interface AuditLog {
  id: string;
  action: AuditLogAction;
  data: object;
  userId: string;
  user: UserProfile;
  createdAt: string;
  updatedAt: string;
  projectId: string | null;
  taskId: string | null;
  membershipId: string | null;
}

