import { gql } from "graphql-tag";

export const rentalSchema = gql`
  enum ContractStatus {
    DRAFT
    ACTIVE
    EXPIRED
    TERMINATED
  }

  enum SettlementStatus {
    DRAFT
    CONFIRMED
    PAID
    CANCELLED
  }

  enum ActStatus {
    DRAFT
    READY
    SIGNED
    VOID
  }

  enum MovementType {
    OUT
    RETURN
  }

  type ContractRate {
    id: ID!
    contractId: ID!
    materialId: ID!
    material: Material!
    unit: UnitType!
    unitPrice: Float!
    notes: String
  }

  type MasterContract {
    id: ID!
    contractNumber: String!
    ownerCompanyId: ID!
    renterCompanyId: ID!
    ownerCompany: Company!
    renterCompany: Company!
    startDate: String!
    endDate: String!
    status: ContractStatus!
    notes: String
    rates: [ContractRate!]!
    createdAt: String!
    updatedAt: String!
  }

  type RentalUsage {
    id: ID!
    contractId: ID
    materialId: ID!
    material: Material!
    movementType: MovementType!
    movementDate: String!
    quantity: Float!
    unit: UnitType!
    unitPrice: Float!
    startDate: String!
    endDate: String!
    usageDays: Int!
    lineTotal: Float!
    notes: String
    createdAt: String!
    updatedAt: String!
  }

  type SettlementItem {
    id: ID!
    usageId: ID!
    materialName: String!
    quantity: Float!
    unit: UnitType!
    unitPrice: Float!
    usageDays: Int!
    lineTotal: Float!
  }

  type Settlement {
    id: ID!
    contractId: ID!
    contract: MasterContract!
    settlementNumber: String!
    periodStart: String!
    periodEnd: String!
    items: [SettlementItem!]!
    subtotal: Float!
    tax: Float!
    total: Float!
    status: SettlementStatus!
    createdAt: String!
    updatedAt: String!
  }

  type HandoverAct {
    id: ID!
    contractId: ID!
    settlementId: ID!
    actNumber: String!
    title: String!
    ownerCompanyId: ID!
    renterCompanyId: ID!
    ownerCompany: Company!
    renterCompany: Company!
    actDate: String!
    items: [SettlementItem!]!
    totalAmount: Float!
    status: ActStatus!
    preparedByUserId: ID
    checkedByUserId: ID
    signedByOwnerName: String
    signedByRenterName: String
    notes: String
    createdAt: String!
    updatedAt: String!
  }

  input CreateContractRateInput {
    materialId: ID!
    unit: UnitType!
    unitPrice: Float!
    notes: String
  }

  input CreateMasterContractInput {
    contractNumber: String!
    ownerCompanyId: ID!
    renterCompanyId: ID!
    startDate: String!
    endDate: String!
    notes: String
    rates: [CreateContractRateInput!]!
  }

  input UpdateMasterContractStatusInput {
    contractId: ID!
    status: ContractStatus!
  }

  input CreateRentalUsageInput {
    contractId: ID
    materialId: ID!
    movementType: MovementType
    movementDate: String
    quantity: Float!
    unit: UnitType!
    unitPrice: Float
    startDate: String!
    endDate: String!
    usageDays: Int!
    notes: String
  }

  input CreateSettlementInput {
    contractId: ID!
    settlementNumber: String!
    periodStart: String!
    periodEnd: String!
    tax: Float!
  }

  input CreateHandoverActInput {
    contractId: ID!
    settlementId: ID!
    actNumber: String!
    title: String!
    actDate: String!
    preparedByUserId: ID
    checkedByUserId: ID
    signedByOwnerName: String
    signedByRenterName: String
    notes: String
  }

  extend type Query {
    masterContracts: [MasterContract!]!
    masterContract(id: ID!): MasterContract

    rentalUsages(contractId: ID, materialId: ID): [RentalUsage!]!
    rentalUsage(id: ID!): RentalUsage

    settlements(contractId: ID): [Settlement!]!
    settlement(id: ID!): Settlement

    handoverActs(contractId: ID): [HandoverAct!]!
    handoverAct(id: ID!): HandoverAct
  }

  extend type Mutation {
    createMasterContract(input: CreateMasterContractInput!): MasterContract!
    updateMasterContractStatus(
      input: UpdateMasterContractStatusInput!
    ): MasterContract!

    createRentalUsage(input: CreateRentalUsageInput!): RentalUsage!

    createSettlement(input: CreateSettlementInput!): Settlement!
    createHandoverAct(input: CreateHandoverActInput!): HandoverAct!
  }
`;
