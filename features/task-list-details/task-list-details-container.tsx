import { cookies } from "next/headers"
import { TaskListRepository } from "@/entities/task-list/model/repository"
import { TaskRepository } from "@/entities/task/model/repository"
import { TaskListHeader } from "./task-list-header"
import { TasksGrid } from "./tasks-grid"
import { CreateTaskForm } from "./create-task-form"
import { TaskDetailsModal } from "./task-details-modal"
import { Box, Typography } from "@mui/material"

interface TaskListDetailsContainerProps {
  listId: string
  selectedTaskId?: string
}

export async function TaskListDetailsContainer({ listId, selectedTaskId }: TaskListDetailsContainerProps) {
  const cookie = await cookies();
  const authToken = cookie.get("auth-token")?.value || ""
  const taskList = await TaskListRepository.getById(authToken, listId)
  const tasks = await TaskRepository.getByListId(authToken, listId)

  if (!taskList) {
    return (
      <Box textAlign="center" py={8}>
        <Typography variant="h5" color="error">
          Task list not found
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <TaskListHeader taskList={taskList} />
      <CreateTaskForm listId={listId} />
      <TasksGrid tasks={tasks} />
      {selectedTaskId && <TaskDetailsModal taskId={selectedTaskId} />}
    </Box>
  )
}
