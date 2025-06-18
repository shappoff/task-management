"use client"

import { useRouter } from "next/navigation"
import { useSnackbar } from "notistack"
import { useTransition } from "react"

// Custom Hook Pattern Implementation
export function useServerAction() {
  const router = useRouter()
  const { enqueueSnackbar } = useSnackbar()
  const [isPending, startTransition] = useTransition()

  const executeAction = async (
    action: () => Promise<any>,
    options?: {
      onSuccess?: (result: any) => void
      onError?: (error: any) => void
      successMessage?: string
      errorMessage?: string
    },
  ) => {
    startTransition(async () => {
      try {
        const result = await action()

        if (options?.successMessage) {
          enqueueSnackbar(options.successMessage, { variant: "success" })
        }

        options?.onSuccess?.(result)
        router.refresh()
      } catch (error) {
        const message = options?.errorMessage || "An error occurred"
        enqueueSnackbar(message, { variant: "error" })
        options?.onError?.(error)
      }
    })
  }

  return { executeAction, isPending }
}
