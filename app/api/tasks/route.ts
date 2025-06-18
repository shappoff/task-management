import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { TaskRepository } from "@/entities/task/model/repository"

export const dynamic = "force-static";

export async function GET(request: NextRequest) {
  try {
    const cookie = await cookies();
    const authToken = cookie.get("auth-token")?.value
    if (!authToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    const taskListId = searchParams.get("taskListId")

    if (id) {
      const task = await TaskRepository.getById(authToken, id)
      if (!task) {
        return NextResponse.json({ error: "Task not found" }, { status: 404 })
      }
      return NextResponse.json(task)
    } else if (taskListId) {
      // Get tasks by task list ID
      const tasks = await TaskRepository.getByTaskListId(authToken, taskListId)
      return NextResponse.json(tasks)
    } else {
      // Get all tasks
      const tasks = await TaskRepository.getAll(authToken)
      return NextResponse.json(tasks)
    }
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookie = await cookies();
    const authToken = cookie.get("auth-token")?.value
    if (!authToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    const task = await TaskRepository.create(authToken, data)

    return NextResponse.json(task, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const cookie = await cookies();
    const authToken = cookie.get("auth-token")?.value
    if (!authToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Task ID is required" }, { status: 400 })
    }

    const updates = await request.json()
    const task = await TaskRepository.update(authToken, id, updates)

    return NextResponse.json(task)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const cookie = await cookies();
    const authToken = cookie.get("auth-token")?.value
    if (!authToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Task ID is required" }, { status: 400 })
    }

    await TaskRepository.delete(authToken, id)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
