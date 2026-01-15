import type { MembershipRole } from "@/enums/MembershipRole";
import type { UserProfile } from "./auth";

export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  membersCount: number;
  tasksCount: number;
}

export interface CreateProject {
  name: string;
  description: string;
}

export interface ProjectFull {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  owner: UserProfile;
}

export interface Membership {
  id: string;
  userId: string;
  name: string;
  role: MembershipRole;
  createdAt: string;
  updatedAt: string;
}
