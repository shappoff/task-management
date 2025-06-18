"use client"

import { Button, TextField, Box, CircularProgress } from "@mui/material"
import { useRouter } from "next/navigation"
import { useServerAction } from "@/shared/hooks/use-server-action"

export function LoginForm() {
  const router = useRouter()
  const { executeAction, isPending } = useServerAction()

  const handleSubmit = async (formData: FormData) => {
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    await executeAction(
      async () => {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || "Login failed")
        }

        return response.json()
      },
      {
        onSuccess: () => {
          router.push("/dashboard")
        },
        successMessage: "Login successful!",
        errorMessage: "Invalid credentials. Please try again.",
      },
    )
  }

  return (
    <Box component="form" action={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <TextField
        name="email"
        type="email"
        label="Email"
        placeholder="Enter your email"
        value="admin@test.com"
        required
        disabled={isPending}
        fullWidth
        variant="outlined"
      />

      <TextField
        name="password"
        type="password"
        label="Password"
        placeholder="Enter your password"
        required
        value="Admin123*$"
        disabled={isPending}
        fullWidth
        variant="outlined"
      />

      <Button type="submit" variant="contained" size="large" disabled={isPending} fullWidth sx={{ py: 1.5 }}>
        {isPending ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CircularProgress size={20} color="inherit" />
            Signing in...
          </Box>
        ) : (
          "Sign In"
        )}
      </Button>
    </Box>
  )
}
