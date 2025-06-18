import { TaskListDetailsContainer } from "@/features/task-list-details/task-list-details-container"
import { AppHeader } from "@/shared/components/app-header"
import { Container, Box } from "@mui/material"

interface TaskListDetailsWidgetProps {
  listId: string
  selectedTaskId?: string
}

export function TaskListDetailsWidget({ listId, selectedTaskId }: TaskListDetailsWidgetProps) {
  return (
    <Box sx={{ minHeight: "100vh" }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <TaskListDetailsContainer listId={listId} selectedTaskId={selectedTaskId} />
      </Container>
    </Box>
  )
}
