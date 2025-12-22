import type { GraphQLContext } from '@/graphql/context'
import { unauthenticated } from '@/shared/errors/errors'

export const requireUser = (ctx: GraphQLContext): string => {
  if (ctx.userId) return ctx.userId
  throw unauthenticated()
}
