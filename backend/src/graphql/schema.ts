import { createSchema } from 'graphql-yoga'
import { authTypeDefs, authResolvers } from '@/modules/auth'
import { categoriesTypeDefs, categoriesResolvers } from '@/modules/categories'
import {
  transactionsTypeDefs,
  transactionsResolvers,
} from '@/modules/transactions'

const baseTypeDefs = /* GraphQL */ `
  type Query {
    health: String!
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
  ],
  resolvers: [
    baseResolvers,
    authResolvers,
    categoriesResolvers,
    transactionsResolvers,
  ],
})
