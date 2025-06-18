"use client"

import type React from "react"
import { useEffect, useState } from "react"

interface TimerRenderProps {
  timeRemaining: number
  isExpired: boolean
  formattedTime: string
  progress: number
}

interface RenderPropTimerProps {
  allottedTime: number
  createdAt: string
  children: (props: TimerRenderProps) => React.ReactNode
}

// Render Props Pattern Implementation
export function RenderPropTimer({ allottedTime, createdAt, children }: RenderPropTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(0)

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date().getTime()
      const created = new Date(createdAt).getTime()
      const allottedMs = allottedTime * 60 * 1000
      const elapsed = now - created
      const remaining = Math.max(0, allottedMs - elapsed)

      setTimeRemaining(remaining)
    }

    calculateTimeRemaining()
    const interval = setInterval(calculateTimeRemaining, 1000)

    return () => clearInterval(interval)
  }, [allottedTime, createdAt])

  const isExpired = timeRemaining === 0
  const totalMs = allottedTime * 60 * 1000
  const progress = ((totalMs - timeRemaining) / totalMs) * 100

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  return (
    <>
      {children({
        timeRemaining,
        isExpired,
        formattedTime: formatTime(timeRemaining),
        progress: Math.min(100, Math.max(0, progress)),
      })}
    </>
  )
}
