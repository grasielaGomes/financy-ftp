import { GraphQLError } from 'graphql'
import { AppError } from './AppError'

export const toGraphQLError = (error: unknown): GraphQLError => {
  if (error instanceof GraphQLError) return error

  if (error instanceof AppError) {
    return new GraphQLError(error.message, {
      extensions: {
        code: error.code,
        // Yoga uses `extensions.http` to set HTTP status/headers
        http: { status: error.httpStatus },
        details: error.details,
      },
    })
  }

  // Fallback: let Yoga mask unexpected errors
  return new GraphQLError('Unexpected error.')
}
