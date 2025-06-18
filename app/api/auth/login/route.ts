import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

const MOCK_USERS = [
  {
    id: "1",
    email: "admin@test.com",
    password: "Admin123*$",
    name: "Admin User",
  },
]

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validate credentials
    const user = MOCK_USERS.find((u) => u.email === email && u.password === password)

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Set authentication cookie
    const cookie = await cookies();
    cookie.set("auth-token", user.id, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email, name: user.name },
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
