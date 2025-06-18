import { Container, Typography, Button, Box } from "@mui/material"
import Link from "next/link"

export function WelcomeScreen() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Container maxWidth="lg">
        <Box textAlign="center">
            <Typography variant="h3" color="#000000">
                Welcome!
            </Typography>
            <Link href="/login" style={{ textDecoration: "none" }}>
            <Button
              variant="contained"
              size="large"
            >
              LogIn
            </Button>
          </Link>
        </Box>
      </Container>
    </Box>
  )
}
