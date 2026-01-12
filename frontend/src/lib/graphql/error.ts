import { CombinedGraphQLErrors } from '@apollo/client/errors'
import type { GraphQLFormattedError } from 'graphql'
import { errorMessages } from '@/lib/errors/messages'

type GraphQLErrorExtensions = {
  code?: string
  http?: { status?: number }
  details?: unknown
}

export const getFirstGraphQLError = (
  err: unknown
): GraphQLFormattedError | null => {
  if (!CombinedGraphQLErrors.is(err)) return null
  return err.errors?.[0] ?? null
}

export const getErrorCode = (err: unknown): string | undefined => {
  const gqlError = getFirstGraphQLError(err)
  return (gqlError?.extensions as GraphQLErrorExtensions | undefined)?.code
}

export const getErrorMessage = (err: unknown): string => {
  const gqlError = getFirstGraphQLError(err)

  if (gqlError) {
    const code = (gqlError.extensions as GraphQLErrorExtensions | undefined)
      ?.code
    if (code && code in errorMessages) return errorMessages[code]
    return gqlError.message || errorMessages.INTERNAL_SERVER_ERROR
  }

  if (err instanceof Error)
    return err.message || errorMessages.INTERNAL_SERVER_ERROR
  return errorMessages.INTERNAL_SERVER_ERROR
}
