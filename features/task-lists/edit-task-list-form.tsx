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
  CircularProgress,
} from "@mui/material"
import { Save, Cancel } from "@mui/icons-material"
import { useServerAction } from "@/shared/hooks/use-server-action"
import { useState, useEffect } from "react"
import type { TaskList } from "@/shared/types"

interface EditTaskListFormProps {
  taskList: TaskList
  open: boolean
  onClose: () => void
  onTaskListUpdated: (updatedTaskList: TaskList) => void
}

export function EditTaskListForm({ taskList, open, onClose, onTaskListUpdated }: EditTaskListFormProps) {
  const { executeAction, isPending } = useServerAction()
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  })

  useEffect(() => {
    if (taskList) {
      setFormData({
        name: taskList.name,
        description: taskList.description || "",
      })
    }
  }, [taskList])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) return

    await executeAction(
      async () => {
        const response = await fetch(`/api/task-lists?id=${taskList.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        })
        if (!response.ok) throw new Error("Failed to update task list")
        return response.json()
      },
      {
        onSuccess: (updatedTaskList) => {
          onTaskListUpdated(updatedTaskList)
          onClose()
        },
        successMessage: "Task list updated successfully",
        errorMessage: "Failed to update task list",
      },
    )
  }

  const handleCancel = () => {
    setFormData({
      name: taskList.name,
      description: taskList.description || "",
    })
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleCancel} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          <Box fontWeight="bold" fontSize="1.25rem">
            Edit Task List
          </Box>
        </DialogTitle>

        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 1 }}>
            <TextField
              label="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              disabled={isPending}
              fullWidth
              autoFocus
              variant="outlined"
            />

            <TextField
              label="Description (optional)"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              disabled={isPending}
              fullWidth
              multiline
              rows={3}
              variant="outlined"
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
            disabled={isPending || !formData.name.trim()}
            startIcon={isPending ? <CircularProgress size={16} /> : <Save />}
          >
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
