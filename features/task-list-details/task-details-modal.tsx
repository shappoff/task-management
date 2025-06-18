"use client"

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  LinearProgress,
  TextField,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material"
import { Close, Delete, Edit, Send } from "@mui/icons-material"
import { useRouter } from "next/navigation"
import { useServerAction } from "@/shared/hooks/use-server-action"
import { RenderPropTimer } from "@/shared/components/render-prop-timer"
import { useEffect, useState } from "react"
import type { Task } from "@/shared/types"
import { TaskStatus, TaskPriority } from "@/shared/types"

interface TaskDetailsModalProps {
  taskId: string
}

export function TaskDetailsModal({ taskId }: TaskDetailsModalProps) {
  const router = useRouter()
  const { executeAction, isPending } = useServerAction()
  const [task, setTask] = useState<Task | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    priority: TaskPriority.MEDIUM,
    allottedTime: 60,
    status: TaskStatus.TODO,
  })

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await fetch(`/api/tasks?id=${taskId}`)
        if (response.ok) {
          const taskData = await response.json()
          setTask(taskData)
        }
      } catch (error) {
        console.error("Failed to fetch task:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTask()
  }, [taskId])

  useEffect(() => {
    if (task) {
      setEditForm({
        title: task.title,
        description: task.description || "",
        priority: task.priority,
        allottedTime: task.allottedTime,
        status: task.status,
      })
    }
  }, [task])

  const handleClose = () => {
    router.back()
  }

  const handleDelete = async () => {
    if (!task) return

    await executeAction(
      async () => {
        const response = await fetch(`/api/tasks?id=${task.id}`, {
          method: "DELETE",
        })
        if (!response.ok) throw new Error("Failed to delete task")
      },
      {
        onSuccess: () => {
          router.back()
        },
        successMessage: "Task deleted successfully",
        errorMessage: "Failed to delete task",
      },
    )
  }

  const handleEditClick = () => {
    setIsEditing(true)
  }

  const handleSaveEdit = async () => {
    if (!task) return

    await executeAction(
      async () => {
        const response = await fetch(`/api/tasks?id=${task.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editForm),
        })
        if (!response.ok) throw new Error("Failed to update task")
        return response.json()
      },
      {
        onSuccess: (updatedTask) => {
          setTask(updatedTask)
          setIsEditing(false)
        },
        successMessage: "Task updated successfully",
        errorMessage: "Failed to update task",
      },
    )
  }

  const handleCancelEdit = () => {
    if (task) {
      setEditForm({
        title: task.title,
        description: task.description || "",
        priority: task.priority,
        allottedTime: task.allottedTime,
        status: task.status,
      })
    }
    setIsEditing(false)
  }

  if (loading) {
    return (
      <Dialog open onClose={handleClose} maxWidth="md" fullWidth>
        <DialogContent sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </DialogContent>
      </Dialog>
    )
  }

  if (!task) {
    return (
      <Dialog open onClose={handleClose} maxWidth="md" fullWidth>
        <DialogContent>
          <Typography color="error">Task not found</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    )
  }

  return (
    <Dialog open onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {isEditing ? (
          <TextField
            value={editForm.title}
            onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
            variant="outlined"
            size="small"
            sx={{ flexGrow: 1, mr: 2 }}
            disabled={isPending}
          />
        ) : (
          <Box fontWeight="bold" fontSize="1.25rem" sx={{ flexGrow: 1 }}>
            {task.title}
          </Box>
        )}
        <Button onClick={handleClose} color="inherit">
          <Close />
        </Button>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {task.description !== undefined && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Description
              </Typography>
              {isEditing ? (
                <TextField
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  multiline
                  rows={3}
                  fullWidth
                  variant="outlined"
                  disabled={isPending}
                />
              ) : (
                <Typography variant="body1" color="text.secondary">
                  {task.description || "No description"}
                </Typography>
              )}
            </Box>
          )}

          {isEditing ? (
            <Box display="flex" gap={2} flexWrap="wrap">
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value as TaskStatus })}
                  label="Status"
                  disabled={isPending}
                >
                  <MenuItem value={TaskStatus.TODO}>Todo</MenuItem>
                  <MenuItem value={TaskStatus.IN_PROGRESS}>In Progress</MenuItem>
                  <MenuItem value={TaskStatus.COMPLETED}>Completed</MenuItem>
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={editForm.priority}
                  onChange={(e) => setEditForm({ ...editForm, priority: e.target.value as TaskPriority })}
                  label="Priority"
                  disabled={isPending}
                >
                  <MenuItem value={TaskPriority.LOW}>Low</MenuItem>
                  <MenuItem value={TaskPriority.MEDIUM}>Medium</MenuItem>
                  <MenuItem value={TaskPriority.HIGH}>High</MenuItem>
                </Select>
              </FormControl>

              <TextField
                label="Allotted Time (min)"
                type="number"
                size="small"
                value={editForm.allottedTime}
                onChange={(e) => setEditForm({ ...editForm, allottedTime: Number.parseInt(e.target.value) || 0 })}
                inputProps={{ min: 1 }}
                sx={{ width: 150 }}
                disabled={isPending}
              />
            </Box>
          ) : (
            <Box display="flex" gap={2} flexWrap="wrap">
              <Chip label={`Status: ${task.status.replace("_", " ")}`} color="primary" />
              <Chip label={`Priority: ${task.priority}`} variant="outlined" />
              <Chip label={`Allotted: ${task.allottedTime} min`} variant="outlined" />
            </Box>
          )}

          <RenderPropTimer allottedTime={task.allottedTime} createdAt={task.createdAt}>
            {({ formattedTime, progress, isExpired }) => (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Time Tracking
                </Typography>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography variant="body2">Time Remaining</Typography>
                  <Typography variant="h6" fontWeight="bold" color={isExpired ? "error.main" : "primary.main"}>
                    {formattedTime}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={progress}
                  color={isExpired ? "error" : "primary"}
                  sx={{ height: 8, borderRadius: 4 }}
                />
                {isExpired && (
                  <Typography variant="body2" color="error.main" sx={{ mt: 1 }}>
                    Task time has expired!
                  </Typography>
                )}
              </Box>
            )}
          </RenderPropTimer>
        </Box>
      </DialogContent>

      <DialogActions>
        {isEditing ? (
          <>
            <Button onClick={handleCancelEdit} disabled={isPending}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveEdit}
              variant="contained"
              disabled={isPending || !editForm.title.trim()}
              startIcon={isPending ? <CircularProgress size={16} /> : <Edit />}
            >
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </>
        ) : (
          <>
            <Button startIcon={<Edit />} color="primary" onClick={handleEditClick}>
              Edit Task
            </Button>
            <Button startIcon={<Delete />} color="error" onClick={handleDelete} disabled={isPending}>
              Delete Task
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  )
}
