"use client"

import { Typography, Box, Breadcrumbs, Link as MuiLink } from "@mui/material"
import { Home, ChevronRight } from "@mui/icons-material"
import Link from "next/link"
import type { TaskList } from "@/shared/types"

interface TaskListHeaderProps {
  taskList: TaskList
}

export function TaskListHeader({ taskList }: TaskListHeaderProps) {
  return (
    <Box>
      <Breadcrumbs separator={<ChevronRight fontSize="small" />} sx={{ mb: 2 }}>
        <MuiLink component={Link} href="/dashboard" color="inherit" sx={{ display: "flex", alignItems: "center" }}>
          <Home sx={{ mr: 0.5 }} fontSize="inherit" />
          Dashboard
        </MuiLink>
        <Typography color="text.primary">{taskList.name}</Typography>
      </Breadcrumbs>

      <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
        {taskList.name}
      </Typography>

      {taskList.description && (
        <Typography variant="h6" color="text.secondary">
          {taskList.description}
        </Typography>
      )}
    </Box>
  )
}
