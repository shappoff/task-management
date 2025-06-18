"use client"

import { Button, TextField, Card, CardContent, Typography, Box, CircularProgress } from "@mui/material"
import { Add, Cancel } from "@mui/icons-material"
import { useServerAction } from "@/shared/hooks/use-server-action"
import { useState } from "react"

export function CreateTaskListForm() {
  const { executeAction, isPending } = useServerAction()
  const [isOpen, setIsOpen] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    const name = formData.get("name") as string
    const description = formData.get("description") as string

    await executeAction(
      async () => {
        const response = await fetch("/api/task-lists", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, description }),
        })
        if (!response.ok) throw new Error("Failed to create task list")
        return response.json()
      },
      {
        onSuccess: () => {
          setIsOpen(false)
        },
        successMessage: "Task list created successfully",
        errorMessage: "Failed to create task list",
      },
    )
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
        Create New Task List
      </Button>
    )
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Create New Task List
        </Typography>

        <Box component="form" action={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 2 }}>
          <TextField
            name="name"
            label="Name"
            placeholder="Enter task list name"
            required
            disabled={isPending}
            fullWidth
            variant="outlined"
          />

          <TextField
            name="description"
            label="Description (optional)"
            placeholder="Enter task list description"
            disabled={isPending}
            fullWidth
            multiline
            rows={3}
            variant="outlined"
          />

          <Box display="flex" gap={2}>
            <Button
              type="submit"
              variant="contained"
              disabled={isPending}
              startIcon={isPending ? <CircularProgress size={16} /> : <Add />}
            >
              {isPending ? "Creating..." : "Create"}
            </Button>
            <Button
              type="button"
              variant="outlined"
              onClick={() => setIsOpen(false)}
              disabled={isPending}
              startIcon={<Cancel />}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}
