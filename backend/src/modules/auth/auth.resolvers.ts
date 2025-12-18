import type { GraphQLContext } from '@/graphql/context'

export const authResolvers = {
  Query: {
    me: async (_: unknown, __: unknown, ctx: GraphQLContext) => {
      // TODO: Implement after Prisma models are ready
      if (!ctx.userId) return null
      return { id: ctx.userId, email: 'TODO' }
    },
  },
  Mutation: {
    signUp: async (_: unknown, __: unknown) => {
      // TODO: Implement (hash password, create user, return token)
      throw new Error('Not implemented')
    },
    signIn: async (_: unknown, __: unknown) => {
      // TODO: Implement (verify password, return token)
      throw new Error('Not implemented')
    },
  },
}
