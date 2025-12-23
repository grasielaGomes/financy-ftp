import { GraphQLError } from 'graphql'
import { AppError } from './AppError'
import { ErrorCode } from './errorCodes'

const fromAppError = (appErr: AppError, base?: GraphQLError): GraphQLError => {
  return new GraphQLError(appErr.message, {
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
  if (error instanceof GraphQLError) {
    const original = error.originalError

    if (original instanceof AppError) {
      return fromAppError(original, error)
    }

    return error
  }

  if (error instanceof AppError) {
    return fromAppError(error)
  }

  return new GraphQLError('Unexpected error.', {
    extensions: {
      code: ErrorCode.INTERNAL_ERROR,
      http: { status: 500 },
    },
  })
}
