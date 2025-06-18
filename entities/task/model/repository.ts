import { type Task, TaskStatus, TaskPriority } from "@/shared/types"

class TaskRepositoryImpl {
  private mockData: Map<string, Task[]> = new Map()

  async getByListId(userId: string, listId: string): Promise<Task[]> {
    const userKey = `${userId}-${listId}`

    if (!this.mockData.has(userKey)) {

      const sampleTasks: Task[] = [
        {
          id: "1",
          title: "Complete project proposal",
          description: "Write and submit the Q4 project proposal",
          status: TaskStatus.IN_PROGRESS,
          priority: TaskPriority.HIGH,
          allottedTime: 120,
          createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
          updatedAt: new Date().toISOString(),
          taskListId: listId,
          comments: [
            {
              id: "1",
              content: "Started working on the outline",
              createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
              taskId: "1",
            },
          ],
        },
        {
          id: "2",
          title: "Review team feedback",
          description: "Go through all the feedback from the team meeting",
          status: TaskStatus.TODO,
          priority: TaskPriority.MEDIUM,
          allottedTime: 60,
          createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(), // 1 hour ago
          updatedAt: new Date().toISOString(),
          taskListId: listId,
          comments: [],
        },
      ]

      this.mockData.set(userKey, sampleTasks)
    }

    return this.mockData.get(userKey) || []
  }

  async getById(userId: string, id: string): Promise<Task | null> {
    for (const [key, tasks] of this.mockData.entries()) {
      if (key.startsWith(userId)) {
        const task = tasks.find((t) => t.id === id)
        if (task) return task
      }
    }
    return null
  }

  async getByAll(): Promise<any> {
    return [...this.mockData.keys()];
  }

  async create(userId: string, data: Partial<Task>): Promise<Task> {
    const userKey = `${userId}-${data.taskListId}`
    const tasks = this.mockData.get(userKey) || []

    const newTask: Task = {
      id: Date.now().toString(),
      title: data.title || "",
      description: data.description,
      status: data.status || TaskStatus.TODO,
      priority: data.priority || TaskPriority.MEDIUM,
      allottedTime: data.allottedTime || 60,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      taskListId: data.taskListId || "",
      comments: [],
    }

    tasks.push(newTask)
    this.mockData.set(userKey, tasks)

    if (data.taskListId) {
      const { TaskListRepository } = await import("@/entities/task-list/model/repository")
      await TaskListRepository.updateTaskCount(userId, data.taskListId)
    }

    return newTask
  }

  async update(userId: string, id: string, updates: Partial<Task>): Promise<Task> {
    for (const [key, tasks] of this.mockData.entries()) {
      if (key.startsWith(userId)) {
        const index = tasks.findIndex((t) => t.id === id)
        if (index !== -1) {
          tasks[index] = {
            ...tasks[index],
            ...updates,
            updatedAt: new Date().toISOString(),
          }
          this.mockData.set(key, tasks)
          return tasks[index]
        }
      }
    }
    throw new Error("Task not found")
  }

  async delete(userId: string, id: string): Promise<void> {
    for (const [key, tasks] of this.mockData.entries()) {
      if (key.startsWith(userId)) {
        const taskToDelete = tasks.find((t) => t.id === id)
        const filtered = tasks.filter((t) => t.id !== id)
        if (filtered.length !== tasks.length) {
          this.mockData.set(key, filtered)

          if (taskToDelete?.taskListId) {
            const { TaskListRepository } = await import("@/entities/task-list/model/repository")
            await TaskListRepository.updateTaskCount(userId, taskToDelete.taskListId)
          }
          return
        }
      }
    }
  }

  async addComment(userId: string, taskId: string, content: string): Promise<Task> {
    const task = await this.getById(userId, taskId)
    if (!task) throw new Error("Task not found")

    const newComment = {
      id: Date.now().toString(),
      content,
      createdAt: new Date().toISOString(),
      taskId,
    }

    task.comments.push(newComment)
    return this.update(userId, taskId, { comments: task.comments })
  }
}

export const TaskRepository = new TaskRepositoryImpl()
