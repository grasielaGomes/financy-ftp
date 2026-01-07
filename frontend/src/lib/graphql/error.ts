import { CombinedGraphQLErrors } from '@apollo/client/errors'
import type { GraphQLFormattedError } from 'graphql'

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

    switch (code) {
      case 'UNAUTHENTICATED':
        return 'E-mail ou senha inválidos.'
      case 'CONFLICT':
        return 'Este e-mail já está em uso.'
      case 'BAD_REQUEST':
        return 'Verifique os campos e tente novamente.'
      default:
        return gqlError.message || 'Ocorreu um erro.'
    }
  }

  if (err instanceof Error) return err.message || 'Ocorreu um erro.'
  return 'Ocorreu um erro.'
}
