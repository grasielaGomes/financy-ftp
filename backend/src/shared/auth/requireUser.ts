import { GraphQLError } from 'graphql'
import type { GraphQLContext } from '@/graphql/context'

export const requireUser = (ctx: GraphQLContext): string => {
  if (ctx.userId) return ctx.userId

  throw new GraphQLError('Authentication required.', {
    extensions: {
      code: 'UNAUTHENTICATED',
      http: { status: 401 },
    },
  })
}
