import { gql } from "graphql-tag";

export const companySchema = gql`
  enum CompanyRole {
    OWNER
    RENTER
    BOTH
  }

  type Company {
    id: ID!
    name: String!
    registerNumber: String!
    phone: String!
    email: String!
    address: String
    logoUrl: String
    role: CompanyRole!
    createdAt: String!
    updatedAt: String!
  }

  input CreateCompanyInput {
    name: String!
    registerNumber: String
    vatNumber: String
    logoUrl: String
    phone: String!
    email: String!
    address: String
  }

  input UpdateCompanyInput {
    name: String
    registerNumber: String
    vatNumber: String
    logoUrl: String
    phone: String!
    email: String!
    address: String
  }

  extend type Query {
    companies: [Company!]!
    company(id: ID!): Company
  }

  extend type Mutation {
    createCompany(input: CreateCompanyInput!): Company!
    updateCompany(id: ID!, input: UpdateCompanyInput!): Company!
  }
`;
