export const authTypeDefs = /* GraphQL */ `
  type User {
    id: ID!
    email: String!
    fullName: String!
  }

  type AuthPayload {
    accessToken: String!
    user: User!
  }

  input SignUpInput {
    email: String!
    password: String!
    fullName: String!
  }

  input SignInInput {
    email: String!
    password: String!
  }

  input UpdateProfileInput {
    fullName: String!
  }

  extend type Query {
    me: User
  }

  extend type Mutation {
    signUp(input: SignUpInput!): AuthPayload!
    signIn(input: SignInInput!): AuthPayload!
    updateProfile(input: UpdateProfileInput!): User!
  }
`
