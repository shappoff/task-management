"use client"

import type React from "react"

import type { Task } from "@/shared/types"
import {
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Box,
  LinearProgress,
  Button,
} from "@mui/material"
import { MoreVert, Delete, Edit, PlayArrow } from "@mui/icons-material"
import { RenderPropTimer } from "@/shared/components/render-prop-timer"
import { useServerAction } from "@/shared/hooks/use-server-action"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { EditTaskForm } from "./edit-task-form"
import { TaskStatus } from "@/shared/types"

interface TaskCardProps {
  task: Task
}

const statusColors = {
  todo: "default" as const,
  in_progress: "primary" as const,
  completed: "success" as const,
}

const priorityColors = {
  low: "success" as const,
  medium: "warning" as const,
  high: "error" as const,
}

export function TaskCard({ task }: TaskCardProps) {
  const { executeAction, isPending } = useServerAction()
  const router = useRouter()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [showEditDialog, setShowEditDialog] = useState(false)

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleDelete = async () => {
    handleMenuClose()
    await executeAction(
      async () => {
        const response = await fetch(`/api/tasks?id=${task.id}`, {
          method: "DELETE",
        })
        if (!response.ok) throw new Error("Failed to delete task")
      },
      {
        successMessage: "Task deleted successfully",
        errorMessage: "Failed to delete task",
      },
    )
  }

  const handleViewDetails = () => {
    router.push(`/dashboard/list/${task.taskListId}?task=${task.id}`)
  }

  const handleEditClick = () => {
    handleMenuClose()
    setShowEditDialog(true)
  }

  const handleTaskUpdated = (updatedTask: Task) => {
    // TODO
  }

  const handleStatusChange = async (newStatus: TaskStatus) => {
    await executeAction(
      async () => {
        const response = await fetch(`/api/tasks?id=${task.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        })
        if (!response.ok) throw new Error("Failed to update task status")
        return response.json()
      },
      {
        successMessage: "Task status updated",
        errorMessage: "Failed to update task status",
      },
    )
  }

  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          {false ? (
            <Box sx={{ flexGrow: 1, pr: 1, display: "flex", gap: 1, alignItems: "center" }}></Box>
          ) : (
            <Typography variant="h6" fontWeight="bold" sx={{ flexGrow: 1, pr: 1 }}>
              {task.title}
            </Typography>
          )}
          {!false && (
            <IconButton size="small" onClick={handleMenuOpen}>
              <MoreVert />
            </IconButton>
          )}
        </Box>

        {task.description && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {task.description}
          </Typography>
        )}

        <Box display="flex" gap={1} mb={2} flexWrap="wrap">
          <Button
            size="small"
            onClick={() => {
              const statusOrder = [TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.COMPLETED]
              const currentIndex = statusOrder.indexOf(task.status)
              const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length]
              handleStatusChange(nextStatus)
            }}
            disabled={isPending}
          >
            <Chip label={task.status.replace("_", " ")} color={statusColors[task.status]} size="small" />
          </Button>
          <Chip label={task.priority} color={priorityColors[task.priority]} variant="outlined" size="small" />
        </Box>

        <RenderPropTimer allottedTime={task.allottedTime} createdAt={task.createdAt}>
          {({ formattedTime, progress, isExpired }) => (
            <Box>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="body2" color="text.secondary">
                  Time Remaining
                </Typography>
                <Typography variant="body2" fontWeight="bold" color={isExpired ? "error.main" : "text.primary"}>
                  {formattedTime}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={progress}
                color={isExpired ? "error" : "primary"}
                sx={{ mb: 2 }}
              />
            </Box>
          )}
        </RenderPropTimer>
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
      <EditTaskForm
        task={task}
        open={showEditDialog}
        onClose={() => setShowEditDialog(false)}
        onTaskUpdated={handleTaskUpdated}
      />
    </Card>
  )
}
