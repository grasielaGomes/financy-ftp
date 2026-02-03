import { TRANSACTION_TYPES } from '@financy/contracts'

const transactionTypeSDL = TRANSACTION_TYPES.map((value) => `  ${value}`).join(
  '\n',
)

export const transactionsTypeDefs = /* GraphQL */ `
  enum TransactionType {
${transactionTypeSDL}
  }

  type Transaction {
    id: ID!
    title: String!
    amount: Float!
    type: TransactionType!
    occurredAt: String!
    createdAt: String!
    updatedAt: String!
    category: Category
  }

  input CreateTransactionInput {
    title: String!
    amount: Float!
    type: TransactionType!
    occurredAt: String
    categoryId: ID
  }

  input UpdateTransactionInput {
    id: ID!
    title: String
    amount: Float
    type: TransactionType
    occurredAt: String
    categoryId: ID
  }

  input TransactionsQueryInput {
    search: String
    type: TransactionType
    categoryId: ID
    period: String
    page: Int
    perPage: Int
  }

  type TransactionsResult {
    items: [Transaction!]!
    total: Int!
  }

  type TransactionPeriod {
    period: String!
    count: Int!
  }

  extend type Query {
    transactions(input: TransactionsQueryInput): TransactionsResult!
    transactionPeriods: [TransactionPeriod!]!
  }

  extend type Mutation {
    createTransaction(input: CreateTransactionInput!): Transaction!
    updateTransaction(input: UpdateTransactionInput!): Transaction!
    deleteTransaction(id: ID!): Boolean!
  }
`
