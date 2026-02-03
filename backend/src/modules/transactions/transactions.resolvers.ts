import type { GraphQLContext } from '@/graphql/context'
import { requireUser } from '@/shared/auth/requireUser'
import { TransactionType } from '@financy/contracts'
import { transactionsService } from './transactions.service'

type CreateTransactionArgs = {
  input: {
    title: string
    amount: number
    type: TransactionType
    occurredAt?: string
    categoryId?: string
  }
}

type UpdateTransactionArgs = {
  input: {
    id: string
    title?: string
    amount?: number
    type?: TransactionType
    occurredAt?: string
    categoryId?: string | null
  }
}

type DeleteTransactionArgs = { id: string }

type TransactionsQueryArgs = {
  input?: {
    search?: string
    type?: TransactionType
    categoryId?: string
    period?: string
    page?: number
    perPage?: number
  }
}

export const transactionsResolvers = {
  Query: {
    transactions: async (
      _parent: unknown,
      args: TransactionsQueryArgs,
      ctx: GraphQLContext,
    ) => {
      const userId = requireUser(ctx)
      return transactionsService.list(ctx.prisma, userId, args.input)
    },
  },
  Mutation: {
    createTransaction: async (
      _parent: unknown,
      args: CreateTransactionArgs,
      ctx: GraphQLContext,
    ) => {
      const userId = requireUser(ctx)
      return transactionsService.create(ctx.prisma, userId, args.input)
    },

    updateTransaction: async (
      _parent: unknown,
      args: UpdateTransactionArgs,
      ctx: GraphQLContext,
    ) => {
      const userId = requireUser(ctx)
      return transactionsService.update(ctx.prisma, userId, args.input)
    },

    deleteTransaction: async (
      _parent: unknown,
      args: DeleteTransactionArgs,
      ctx: GraphQLContext,
    ) => {
      const userId = requireUser(ctx)
      return transactionsService.remove(ctx.prisma, userId, args.id)
    },
  },
}
