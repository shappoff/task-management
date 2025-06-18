import { cookies } from "next/headers"
import { TaskListRepository } from "@/entities/task-list/model/repository"
import { TaskListsGrid } from "./task-lists-grid"
import { CreateTaskListForm } from "./create-task-list-form"
import { Box } from "@mui/material"

export async function TaskListsContainer() {
  const cookie = await cookies();
  const authToken = cookie.get("auth-token")?.value || ""
  const taskLists = await TaskListRepository.getAll(authToken)

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <CreateTaskListForm />
      <TaskListsGrid taskLists={taskLists} />
    </Box>
  )
}
