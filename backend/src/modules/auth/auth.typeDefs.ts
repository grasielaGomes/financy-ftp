export const authTypeDefs = /* GraphQL */ `
  type User {
    id: ID!
    email: String!
  }

  type AuthPayload {
    accessToken: String!
    user: User!
  }

  input SignUpInput {
    email: String!
    password: String!
  }

  input SignInInput {
    email: String!
    password: String!
  }

  extend type Query {
    me: User
  }

  extend type Mutation {
    signUp(input: SignUpInput!): AuthPayload!
    signIn(input: SignInInput!): AuthPayload!
  }
`
