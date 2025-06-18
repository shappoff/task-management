import { TaskListsContainer } from "@/features/task-lists/task-lists-container"
import { Container, Typography, Box } from "@mui/material"

export function TaskListsWidget() {
  return (
    <Box sx={{ minHeight: "100vh" }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <TaskListsContainer />
      </Container>
    </Box>
  )
}
