"use client"

import type { TaskList } from "@/shared/types"
import { TaskListCard } from "./task-list-card"
import { Grid, Typography, Box } from "@mui/material"

interface TaskListsGridProps {
  taskLists: TaskList[]
}

// Compound Components Pattern Implementation
export function TaskListsGrid({ taskLists }: TaskListsGridProps) {
  if (taskLists.length === 0) {
    return (
      <Box textAlign="center" py={8}>
        <Typography variant="h6" color="text.secondary">
          No task lists yet. Create your first one above!
        </Typography>
      </Box>
    )
  }

  return (
    <Grid container spacing={3}>
      {taskLists.map((taskList) => (
        <Grid item xs={12} sm={6} lg={4} key={taskList.id}>
          <TaskListCard taskList={taskList} />
        </Grid>
      ))}
    </Grid>
  )
}
