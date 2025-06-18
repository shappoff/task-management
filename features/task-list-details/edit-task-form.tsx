"use client"

import type React from "react"

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material"
import { Save, Cancel } from "@mui/icons-material"
import { TaskStatus, TaskPriority, type Task } from "@/shared/types"
import { useServerAction } from "@/shared/hooks/use-server-action"
import { useState, useEffect } from "react"

interface EditTaskFormProps {
  task: Task
  open: boolean
  onClose: () => void
  onTaskUpdated: (updatedTask: Task) => void
}

export function EditTaskForm({ task, open, onClose, onTaskUpdated }: EditTaskFormProps) {
  const { executeAction, isPending } = useServerAction()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: TaskPriority.MEDIUM,
    allottedTime: 60,
    status: TaskStatus.TODO,
  })

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || "",
        priority: task.priority,
        allottedTime: task.allottedTime,
        status: task.status,
      })
    }
  }, [task])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title.trim()) return

    await executeAction(
      async () => {
        const response = await fetch(`/api/tasks?id=${task.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        })
        if (!response.ok) throw new Error("Failed to update task")
        return response.json()
      },
      {
        onSuccess: (updatedTask) => {
          onTaskUpdated(updatedTask)
          onClose()
        },
        successMessage: "Task updated successfully",
        errorMessage: "Failed to update task",
      },
    )
  }

  const handleCancel = () => {
    setFormData({
      title: task.title,
      description: task.description || "",
      priority: task.priority,
      allottedTime: task.allottedTime,
      status: task.status,
    })
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleCancel} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          <Box fontWeight="bold" fontSize="1.25rem">
            Edit Task
          </Box>
        </DialogTitle>

        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 1 }}>
            <TextField
              label="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              disabled={isPending}
              fullWidth
              autoFocus
            />

            <TextField
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              disabled={isPending}
              fullWidth
              multiline
              rows={3}
            />

            <Box display="flex" gap={2}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as TaskStatus })}
                  label="Status"
                  disabled={isPending}
                >
                  <MenuItem value={TaskStatus.TODO}>Todo</MenuItem>
                  <MenuItem value={TaskStatus.IN_PROGRESS}>In Progress</MenuItem>
                  <MenuItem value={TaskStatus.COMPLETED}>Completed</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as TaskPriority })}
                  label="Priority"
                  disabled={isPending}
                >
                  <MenuItem value={TaskPriority.LOW}>Low</MenuItem>
                  <MenuItem value={TaskPriority.MEDIUM}>Medium</MenuItem>
                  <MenuItem value={TaskPriority.HIGH}>High</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <TextField
              label="Allotted Time (minutes)"
              type="number"
              value={formData.allottedTime}
              onChange={(e) => setFormData({ ...formData, allottedTime: Number.parseInt(e.target.value) || 0 })}
              required
              disabled={isPending}
              fullWidth
              inputProps={{ min: 1 }}
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCancel} disabled={isPending} startIcon={<Cancel />}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isPending || !formData.title.trim()}
            startIcon={isPending ? <CircularProgress size={16} /> : <Save />}
          >
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
