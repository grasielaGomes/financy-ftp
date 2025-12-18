export const categoriesResolvers = {
  Query: {
    categories: async () => {
      // TODO: Implement with Prisma + multi-tenant
      return []
    },
  },
  Mutation: {
    createCategory: async () => {
      throw new Error('Not implemented')
    },
    updateCategory: async () => {
      throw new Error('Not implemented')
    },
    deleteCategory: async () => {
      throw new Error('Not implemented')
    },
  },
}
