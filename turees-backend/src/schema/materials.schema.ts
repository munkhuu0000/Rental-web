import { gql } from "graphql-tag";

export const materialsSchema = gql`
  enum UnitType {
    PCS
    M2
    M3
    TON
  }

  type Material {
    id: ID!
    ownerCompanyId: ID!
    ownerCompany: Company!
    code: String
    name: String!
    description: String
    unit: UnitType!
    defaultPrice: Float!
    createdAt: String!
    updatedAt: String!
  }

  input CreateMaterialInput {
    ownerCompanyId: ID!
    code: String
    name: String!
    description: String
    unit: UnitType!
    defaultPrice: Float!
  }

  input UpdateMaterialInput {
    code: String
    name: String
    description: String
    unit: UnitType
    defaultPrice: Float
  }

  extend type Query {
    materials(ownerCompanyId: ID): [Material!]!
    material(id: ID!): Material
  }

  extend type Mutation {
    createMaterial(input: CreateMaterialInput!): Material!
    updateMaterial(id: ID!, input: UpdateMaterialInput!): Material!
  }
`;
