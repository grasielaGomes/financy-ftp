import { GraphQLError } from 'graphql'
import { AppError } from './AppError'
import { ErrorCode } from './errorCodes'

const fromAppError = (appErr: AppError, base?: GraphQLError): GraphQLError => {
  return new GraphQLError(appErr.message, {
    // Preserve GraphQL metadata if the error was already wrapped
    nodes: base?.nodes,
    source: base?.source,
    positions: base?.positions,
    path: base?.path,
    originalError: appErr,
    extensions: {
      code: appErr.code,
      http: { status: appErr.httpStatus },
      details: appErr.details,
    },
  })
}

export const toGraphQLError = (error: unknown): GraphQLError => {
  // If GraphQL already wrapped the error, inspect the originalError
  if (error instanceof GraphQLError) {
    const original = error.originalError

    if (original instanceof AppError) {
      return fromAppError(original, error)
    }

    // Keep GraphQLError as-is (it might already have extensions)
    return error
  }

  // If it's our domain error, convert to GraphQLError with extensions
  if (error instanceof AppError) {
    return fromAppError(error)
  }

  // Fallback for unexpected errors
  return new GraphQLError('Unexpected error.', {
    extensions: {
      code: ErrorCode.INTERNAL_ERROR,
      http: { status: 500 },
    },
  })
}
