import type { GraphQLContext } from '@/graphql/context'
import { requireUser } from '@/shared/auth/requireUser'
import { transactionsService } from './transactions.service'

type CreateTransactionArgs = {
  input: {
    title: string
    amount: number
    type: 'INCOME' | 'EXPENSE'
    occurredAt?: string
    categoryId?: string
  }
}

type UpdateTransactionArgs = {
  input: {
    id: string
    title?: string
    amount?: number
    type?: 'INCOME' | 'EXPENSE'
    occurredAt?: string
    categoryId?: string | null
  }
}

type DeleteTransactionArgs = { id: string }

export const transactionsResolvers = {
  Query: {
    transactions: async (
      _parent: unknown,
      _args: unknown,
      ctx: GraphQLContext
    ) => {
      const userId = requireUser(ctx)
      return transactionsService.list(ctx.prisma, userId)
    },
  },
  Mutation: {
    createTransaction: async (
      _parent: unknown,
      args: CreateTransactionArgs,
      ctx: GraphQLContext
    ) => {
      const userId = requireUser(ctx)
      return transactionsService.create(ctx.prisma, userId, args.input)
    },

    updateTransaction: async (
      _parent: unknown,
      args: UpdateTransactionArgs,
      ctx: GraphQLContext
    ) => {
      const userId = requireUser(ctx)
      return transactionsService.update(ctx.prisma, userId, args.input)
    },

    deleteTransaction: async (
      _parent: unknown,
      args: DeleteTransactionArgs,
      ctx: GraphQLContext
    ) => {
      const userId = requireUser(ctx)
      return transactionsService.remove(ctx.prisma, userId, args.id)
    },
  },
}
