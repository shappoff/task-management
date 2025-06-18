import { TaskListsWidget } from "@/widgets/task-lists-widget"
import { withAuth } from "@/shared/hoc/with-auth"

async function DashboardPage() {
  return (
    <div style={{minHeight: "100vh"}}>
      <TaskListsWidget />
    </div>
  )
}

export default withAuth(DashboardPage)
