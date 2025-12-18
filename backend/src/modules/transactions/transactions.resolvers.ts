export const transactionsResolvers = {
  Query: {
    transactions: async () => {
      // TODO: Implement with Prisma + multi-tenant
      return []
    },
  },
  Mutation: {
    createTransaction: async () => {
      throw new Error('Not implemented')
    },
    updateTransaction: async () => {
      throw new Error('Not implemented')
    },
    deleteTransaction: async () => {
      throw new Error('Not implemented')
    },
  },
}
