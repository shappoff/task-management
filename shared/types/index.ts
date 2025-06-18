export interface User {
  id: string
  email: string
  name: string
}

export interface TaskList {
  id: string
  name: string
  description?: string
  userId: string
  createdAt: string
  updatedAt: string
  taskCount: number
}

export interface Task {
  id: string
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  allottedTime: number // in minutes
  createdAt: string
  updatedAt: string
  dueDate?: string
  taskListId: string
  comments: Comment[]
}

export interface Comment {
  id: string
  content: string
  createdAt: string
  taskId: string
}

export enum TaskStatus {
  TODO = "todo",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
}

export enum TaskPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
}
