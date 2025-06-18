import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { TaskListRepository } from "@/entities/task-list/model/repository"

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

    if (id) {
      const taskList = await TaskListRepository.getById(authToken, id)
      if (!taskList) {
        return NextResponse.json({ error: "Task list not found" }, { status: 404 })
      }
      return NextResponse.json(taskList)
    } else {
      const taskLists = await TaskListRepository.getAll(authToken)
      return NextResponse.json(taskLists)
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
    const taskList = await TaskListRepository.create(authToken, data)

    return NextResponse.json(taskList, { status: 201 })
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
      return NextResponse.json({ error: "Task list ID is required" }, { status: 400 })
    }

    const updates = await request.json()
    const taskList = await TaskListRepository.update(authToken, id, updates)

    return NextResponse.json(taskList)
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
      return NextResponse.json({ error: "Task list ID is required" }, { status: 400 })
    }

    await TaskListRepository.delete(authToken, id)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
