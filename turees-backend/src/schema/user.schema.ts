import { gql } from "graphql-tag";

export const userSchema = gql`
  enum UserPermission {
    FULL_ACCESS
    QUANTITY_ONLY
  }

  type User {
    id: ID!
    companyId: ID!
    company: Company!
    firstName: String!
    lastName: String!
    email: String!
    phone: String!
    position: String
    permission: UserPermission!
    isCompanyOwner: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  input CreateUserInput {
    companyId: ID!
    firstName: String!
    lastName: String!
    email: String!
    phone: String!
    position: String
    permission: UserPermission
    isCompanyOwner: Boolean
  }

  input UpdateUserInput {
    firstName: String
    lastName: String
    email: String
    phone: String
    position: String
    permission: UserPermission
  }

  extend type Query {
    users(companyId: ID): [User!]!
    user(id: ID!): User
    userByEmail(email: String!): User
  }

  extend type Mutation {
    createUser(input: CreateUserInput!): User!
    updateUser(id: ID!, input: UpdateUserInput!): User!
  }
`;
