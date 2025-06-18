"use client"

import type { Task } from "@/shared/types"
import { TaskCard } from "./task-card"
import { Grid, Typography, Box } from "@mui/material"

interface TasksGridProps {
  tasks: Task[]
}

export function TasksGrid({ tasks }: TasksGridProps) {
  if (tasks.length === 0) {
    return (
      <Box textAlign="center" py={8}>
        <Typography variant="h6" color="text.secondary">
          No tasks yet. Create your first task above!
        </Typography>
      </Box>
    )
  }

  return (
    <Grid container spacing={3}>
      {tasks.map((task) => (
        <Grid item xs={12} sm={6} lg={4} key={task.id}>
          <TaskCard task={task} />
        </Grid>
      ))}
    </Grid>
  )
}
