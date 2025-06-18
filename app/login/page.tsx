import { LoginForm } from "@/features/auth/login-form"
import { Container, Paper, Typography, Box } from "@mui/material"

export default function LoginPage() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper elevation={8} sx={{ p: 4, borderRadius: 2 }}>
          <LoginForm />
        </Paper>
      </Container>
    </Box>
  )
}
