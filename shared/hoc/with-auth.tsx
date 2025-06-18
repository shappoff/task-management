import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import type { ComponentType } from "react"

// Higher-Order Component Pattern Implementation
export function withAuth<T extends {}>(WrappedComponent: ComponentType<T>) {
  return async function AuthenticatedComponent(props: T) {
    const cookie = await cookies();
    const authToken = cookie.get("auth-token")?.value

    if (!authToken) {
      redirect("/login")
    }

    return <WrappedComponent {...props} />
  }
}
