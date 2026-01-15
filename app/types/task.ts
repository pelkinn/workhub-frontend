export interface Task {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  deadline: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTask {
  title: string;
  description: string;
  deadline?: string | null;
}

export interface UpdateTask {
  completed?: boolean;
  title?: string;
  description?: string;
  deadline?: string | null;
}
