import { toast } from 'sonner'
import { getErrorMessage, getFirstGraphQLError } from '@/lib/graphql/error'

export const showErrorToast = (err: unknown, fallback?: string) => {
  const isGraphQLError = !!getFirstGraphQLError(err)
  const message = isGraphQLError
    ? fallback ?? getErrorMessage(err)
    : fallback ?? getErrorMessage(err)

  toast.error(message)
}

export const showSuccessToast = (message: string) => {
  toast.success(message)
}
