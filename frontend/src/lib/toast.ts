import { toast } from 'sonner'
import { getErrorMessage } from '@/lib/graphql/error'

export const showErrorToast = (err: unknown, fallback?: string) => {
  toast.error(fallback ?? getErrorMessage(err))
}

export const showSuccessToast = (message: string) => {
  toast.success(message)
}
