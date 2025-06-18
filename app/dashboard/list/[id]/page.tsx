import { TaskListDetailsWidget } from "@/widgets/task-list-details-widget"
import { withAuth } from "@/shared/hoc/with-auth"

interface TaskListPageProps {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateStaticParams() {
  return new Array<any>(2).fill(null).map((item: null, id: number) => ({id: `${id}`}));
}

async function TaskListPage({ params, searchParams }: TaskListPageProps) {
  const {id: paramsId} = await params;
  const {task: task} = await searchParams;
  return (
    <div style={{minHeight: "100vh"}}>
      <TaskListDetailsWidget listId={paramsId} selectedTaskId={task as string} />
    </div>
  )
}

export default withAuth(TaskListPage)
