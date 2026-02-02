export const categoriesTypeDefs = /* GraphQL */ `
  type Category {
    id: ID!
    name: String!
    description: String
    iconKey: String!
    colorKey: String!
    createdAt: String!
    updatedAt: String!
  }

  input CreateCategoryInput {
    name: String!
    description: String
    iconKey: String!
    colorKey: String!
  }

  input UpdateCategoryInput {
    id: ID!
    name: String
    description: String
    iconKey: String
    colorKey: String
  }

  extend type Query {
    categories: [Category!]!
  }

  extend type Mutation {
    createCategory(input: CreateCategoryInput!): Category!
    updateCategory(input: UpdateCategoryInput!): Category!
    deleteCategory(id: ID!): Boolean!
  }
`
