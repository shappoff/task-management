"use client"

import type React from "react"

import Link from "next/link"
import type { TaskList } from "@/shared/types"
import {
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Box,
  CircularProgress,
} from "@mui/material"
import { MoreVert, Delete, Edit } from "@mui/icons-material"
import { useServerAction } from "@/shared/hooks/use-server-action"
import { useState } from "react"
import { EditTaskListForm } from "./edit-task-list-form"

interface TaskListCardProps {
  taskList: TaskList
}

export function TaskListCard({ taskList }: TaskListCardProps) {
  const { executeAction, isPending } = useServerAction()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [showEditDialog, setShowEditDialog] = useState(false)

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleEditClick = () => {
    handleMenuClose()
    setShowEditDialog(true)
  }

  const handleDelete = async () => {
    handleMenuClose()
    await executeAction(
      async () => {
        const response = await fetch(`/api/task-lists?id=${taskList.id}`, {
          method: "DELETE",
        })
        if (!response.ok) throw new Error("Failed to delete task list")
      },
      {
        successMessage: "Task list deleted successfully",
        errorMessage: "Failed to delete task list",
      },
    )
  }

  const handleTaskListUpdated = (updatedTaskList: TaskList) => {
    //TODO
  }

  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box flexGrow={1}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              {taskList.name}
            </Typography>
            {taskList.description && (
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {taskList.description}
              </Typography>
            )}
          </Box>
          <IconButton size="small" onClick={handleMenuOpen} disabled={isPending}>
            {isPending ? <CircularProgress size={16} /> : <MoreVert />}
          </IconButton>
        </Box>

        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Chip
            label={`${taskList.taskCount} ${taskList.taskCount === 1 ? "task" : "tasks"}`}
            variant="outlined"
            size="small"
          />
          <Link href={`/dashboard/list/${taskList.id}`} style={{ textDecoration: "none" }}>
            <Button variant="contained" size="small">
              View Tasks
            </Button>
          </Link>
        </Box>
      </CardContent>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleEditClick}>
          <Edit sx={{ mr: 1 }} fontSize="small" />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>
          <Delete sx={{ mr: 1 }} fontSize="small" />
          Delete
        </MenuItem>
      </Menu>

      <EditTaskListForm
        taskList={taskList}
        open={showEditDialog}
        onClose={() => setShowEditDialog(false)}
        onTaskListUpdated={handleTaskListUpdated}
      />
    </Card>
  )
}
