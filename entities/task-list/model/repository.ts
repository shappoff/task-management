import type { TaskList } from "@/shared/types"

class TaskListRepositoryImpl {
  private mockData: Map<string, TaskList[]> = new Map()

  async getAll(userId: string): Promise<TaskList[]> {
    if (!this.mockData.has(userId)) {
      // Initialize with sample data
      this.mockData.set(userId, [
        {
          id: "1",
          name: "Personal Tasks",
          description: "My personal todo items",
          userId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          taskCount: 0, // Will be calculated dynamically
        },
        {
          id: "2",
          name: "Work Projects",
          description: "Professional tasks and deadlines",
          userId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          taskCount: 0, // Will be calculated dynamically
        },
      ])
    }

    // Get the lists and update task counts dynamically
    const lists = this.mockData.get(userId) || []
    const { TaskRepository } = await import("@/entities/task/model/repository")

    // Update task counts for each list
    for (const list of lists) {
      const tasks = await TaskRepository.getByListId(userId, list.id)
      list.taskCount = tasks.length
    }

    return lists
  }

  async getById(userId: string, id: string): Promise<TaskList | null> {
    const lists = await this.getAll(userId)
    return lists.find((list) => list.id === id) || null
  }

  async create(userId: string, data: Partial<TaskList>): Promise<TaskList> {
    const lists = await this.getAll(userId)
    const newList: TaskList = {
      id: Date.now().toString(),
      name: data.name || "",
      description: data.description,
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      taskCount: 0,
    }

    lists.push(newList)
    this.mockData.set(userId, lists)
    return newList
  }

  async update(userId: string, id: string, updates: Partial<TaskList>): Promise<TaskList> {
    const lists = await this.getAll(userId)
    const index = lists.findIndex((list) => list.id === id)

    if (index === -1) {
      throw new Error("Task list not found")
    }

    lists[index] = {
      ...lists[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    this.mockData.set(userId, lists)
    return lists[index]
  }

  async delete(userId: string, id: string): Promise<void> {
    const lists = await this.getAll(userId)
    const filtered = lists.filter((list) => list.id !== id)
    this.mockData.set(userId, filtered)
  }

  // Method to update task count for a specific list
  async updateTaskCount(userId: string, listId: string): Promise<void> {
    const lists = this.mockData.get(userId) || []
    const listIndex = lists.findIndex((list) => list.id === listId)

    if (listIndex !== -1) {
      const { TaskRepository } = await import("@/entities/task/model/repository")
      const tasks = await TaskRepository.getByListId(userId, listId)
      lists[listIndex].taskCount = tasks.length
      this.mockData.set(userId, lists)
    }
  }
}

export const TaskListRepository = new TaskListRepositoryImpl()
