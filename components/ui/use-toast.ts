import type React from "react"
// Simplified version of the toast hook
import { toast as sonnerToast } from "sonner"

type ToastProps = {
  title?: string
  description?: string
  action?: React.ReactNode
  variant?: "default" | "destructive"
}

export function toast(props: ToastProps) {
  sonnerToast(props.title, {
    description: props.description,
    action: props.action,
  })
}

