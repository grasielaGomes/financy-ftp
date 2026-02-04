import { createSchema } from 'graphql-yoga'
import { authTypeDefs, authResolvers } from '@/modules/auth'
import { categoriesTypeDefs, categoriesResolvers } from '@/modules/categories'
import {
  transactionsTypeDefs,
  transactionsResolvers,
} from '@/modules/transactions'
import { dashboardResolvers, dashboardTypeDefs } from '@/modules/dashboard'

const baseTypeDefs = /* GraphQL */ `
  type Query {
    health: String!
  }

  # Base Mutation type is required because modules extend it.
  type Mutation {
    _empty: String
  }
`

const baseResolvers = {
  Query: {
    health: () => 'ok',
  },
}

export const schema = createSchema({
  typeDefs: [
    baseTypeDefs,
    authTypeDefs,
    categoriesTypeDefs,
    transactionsTypeDefs,
    dashboardTypeDefs,
  ],
  resolvers: [
    baseResolvers,
    authResolvers,
    categoriesResolvers,
    transactionsResolvers,
    dashboardResolvers,
  ],
})
