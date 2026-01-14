import type { GraphQLContext } from '@/graphql/context'
import { requireUser } from '@/shared/auth/requireUser'
import { authService } from './auth.service'

type AuthArgs = { input: { email: string; password: string } }

export const authResolvers = {
  Query: {
    me: async (_parent: unknown, _args: unknown, ctx: GraphQLContext) => {
      const userId = requireUser(ctx)
      return authService.me(ctx.prisma, userId)
    },
  },
  Mutation: {
    signUp: async (_parent: unknown, args: AuthArgs, ctx: GraphQLContext) => {
      return authService.signUp(ctx.prisma, args.input)
    },
    signIn: async (_parent: unknown, args: AuthArgs, ctx: GraphQLContext) => {
      return authService.signIn(ctx.prisma, args.input)
    },
    updateProfile: async (
      _parent: unknown,
      args: { input: unknown },
      ctx: GraphQLContext
    ) => {
      const userId = requireUser(ctx)
      return authService.updateProfile(ctx.prisma, userId, args.input)
    },
  },
}
