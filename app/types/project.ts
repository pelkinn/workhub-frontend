import type { MembershipRole } from "@/enums/MembershipRole";

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

export interface Membership {
  id: string;
  userId: string;
  name: string;
  role: MembershipRole;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  deadline: string | null;
  createdAt: string;
  updatedAt: string;
}
