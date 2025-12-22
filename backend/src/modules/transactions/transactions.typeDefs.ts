export const transactionsTypeDefs = /* GraphQL */ `
  enum TransactionType {
    INCOME
    EXPENSE
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

  extend type Query {
    transactions: [Transaction!]!
  }

  extend type Mutation {
    createTransaction(input: CreateTransactionInput!): Transaction!
    updateTransaction(input: UpdateTransactionInput!): Transaction!
    deleteTransaction(id: ID!): Boolean!
  }
`
