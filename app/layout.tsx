import type {Metadata} from "next";
import type React from "react"
import {AppHeader} from "@/shared/components/app-header";
import {cookies} from "next/headers";

export const metadata: Metadata = {
    title: 'task management'
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookie = await cookies();
  const authToken = cookie.get("auth-token")?.value || ""
  return (
    <html lang="en">
      <body>
      {authToken ? <AppHeader/> : <></>}
          {children}
      </body>
    </html>
  )
}

