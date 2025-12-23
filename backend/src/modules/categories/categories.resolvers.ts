import type { GraphQLContext } from '@/graphql/context'
import { requireUser } from '@/shared/auth/requireUser'
import { categoriesService } from './categories.service'

type CreateCategoryArgs = { input: { name: string } }
type UpdateCategoryArgs = { input: { id: string; name: string } }
type DeleteCategoryArgs = { id: string }

export const categoriesResolvers = {
  Query: {
    categories: async (
      _parent: unknown,
      _args: unknown,
      ctx: GraphQLContext
    ) => {
      const userId = requireUser(ctx)
      return categoriesService.list(ctx.prisma, userId)
    },
  },
  Mutation: {
    createCategory: async (
      _parent: unknown,
      args: CreateCategoryArgs,
      ctx: GraphQLContext
    ) => {
      const userId = requireUser(ctx)
      return categoriesService.create(ctx.prisma, userId, args.input)
    },

    updateCategory: async (
      _parent: unknown,
      args: UpdateCategoryArgs,
      ctx: GraphQLContext
    ) => {
      const userId = requireUser(ctx)
      return categoriesService.update(ctx.prisma, userId, args.input)
    },

    deleteCategory: async (
      _parent: unknown,
      args: DeleteCategoryArgs,
      ctx: GraphQLContext
    ) => {
      const userId = requireUser(ctx)
      return categoriesService.remove(ctx.prisma, userId, args.id)
    },
  },
}
