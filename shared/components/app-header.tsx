"use client"

import { AppBar, Toolbar, Button, Box } from "@mui/material"
import { Logout } from "@mui/icons-material"
import { useRouter } from "next/navigation"
import { useServerAction } from "@/shared/hooks/use-server-action"

export function AppHeader() {
  const router = useRouter()
  const { executeAction, isPending } = useServerAction()

  const handleLogout = async () => {
    await executeAction(
      async () => {
        const response = await fetch("/api/auth/logout", { method: "POST" })
        if (!response.ok) throw new Error("Logout failed")
      },
      {
        onSuccess: () => {
          router.push("/login")
        },
      },
    )
  }

  return (
    <AppBar position="static" elevation={2}>
      <Toolbar>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Button
            color="inherit"
            onClick={handleLogout}
            disabled={isPending}
            startIcon={<Logout />}
            variant="outlined"
            sx={{ borderColor: "rgba(255,255,255,0.3)" }}
          >
            {isPending ? "Logging out..." : "Logout"}
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  )
}
