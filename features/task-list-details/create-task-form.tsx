"use client"

import {
  Button,
  TextField,
  Card,
  CardContent,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material"
import { Add, Cancel } from "@mui/icons-material"
import { TaskStatus, TaskPriority } from "@/shared/types"
import { useServerAction } from "@/shared/hooks/use-server-action"
import { useState } from "react"

interface CreateTaskFormProps {
  listId: string
}

export function CreateTaskForm({ listId }: CreateTaskFormProps) {
  const { executeAction, isPending } = useServerAction()
  const [isOpen, setIsOpen] = useState(false)
  const [priority, setPriority] = useState(TaskPriority.MEDIUM)

  const handleSubmit = async (formData: FormData) => {
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const allottedTime = Number.parseInt(formData.get("allottedTime") as string)

    await executeAction(
      async () => {
        const response = await fetch("/api/tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            description,
            priority,
            allottedTime,
            taskListId: listId,
            status: TaskStatus.TODO,
          }),
        })
        if (!response.ok) throw new Error("Failed to create task")
        return response.json()
      },
      {
        onSuccess: () => {
          setIsOpen(false)
          setPriority(TaskPriority.MEDIUM)
        },
        successMessage: "Task created successfully",
        errorMessage: "Failed to create task",
      },
    )
  }

  const handleCancel = () => {
    setIsOpen(false)
    setPriority(TaskPriority.MEDIUM)
  }

  if (!isOpen) {
    return (
      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={() => setIsOpen(true)}
        size="large"
        sx={{ alignSelf: "flex-start" }}
      >
        Create New Task
      </Button>
    )
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Create New Task
        </Typography>

        <Box component="form" action={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 2 }}>
          <TextField
            name="title"
            label="Title"
            placeholder="Enter task title"
            required
            disabled={isPending}
            fullWidth
          />

          <TextField
            name="description"
            label="Description (optional)"
            placeholder="Enter task description"
            disabled={isPending}
            fullWidth
            multiline
            rows={3}
          />

          <Box display="flex" gap={2}>
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                value={priority}
                onChange={(e) => {
                  console.log("Priority changed to:", e.target.value)
                  setPriority(e.target.value as TaskPriority)
                }}
                disabled={isPending}
                label="Priority"
              >
                <MenuItem value={TaskPriority.LOW}>Low</MenuItem>
                <MenuItem value={TaskPriority.MEDIUM}>Medium</MenuItem>
                <MenuItem value={TaskPriority.HIGH}>High</MenuItem>
              </Select>
            </FormControl>

            <TextField
              name="allottedTime"
              label="Allotted Time (minutes)"
              type="number"
              defaultValue={60}
              required
              disabled={isPending}
              fullWidth
              inputProps={{ min: 1 }}
            />
          </Box>

          <Box display="flex" gap={2}>
            <Button
              type="submit"
              variant="contained"
              disabled={isPending}
              startIcon={isPending ? <CircularProgress size={16} /> : <Add />}
            >
              {isPending ? "Creating..." : "Create Task"}
            </Button>
            <Button type="button" variant="outlined" onClick={handleCancel} disabled={isPending} startIcon={<Cancel />}>
              Cancel
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}
