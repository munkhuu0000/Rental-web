import * as Mutation from "./mutation";
import {
  companies,
  company,
  contractRateMaterial,
  handoverAct,
  handoverActs,
  handoverActOwnerCompany,
  handoverActRenterCompany,
  masterContract,
  masterContracts,
  masterContractOwnerCompany,
  masterContractRenterCompany,
  material,
  materialOwnerCompany,
  materials,
  rentalUsage,
  rentalUsages,
  rentalUsageMaterial,
  settlement,
  settlementContract,
  settlements,
  user,
  userByEmail,
  userCompany,
  users,
} from "./query";

export const resolvers = {
  Query: {
    companies,
    company,
    materials,
    material,
    users,
    user,
    userByEmail,
    masterContracts,
    masterContract,
    rentalUsages,
    rentalUsage,
    settlements,
    settlement,
    handoverActs,
    handoverAct,
  },
  Mutation,
  User: {
    company: userCompany,
  },
  Material: {
    ownerCompany: materialOwnerCompany,
  },
  ContractRate: {
    material: contractRateMaterial,
  },
  MasterContract: {
    ownerCompany: masterContractOwnerCompany,
    renterCompany: masterContractRenterCompany,
  },
  RentalUsage: {
    material: rentalUsageMaterial,
  },
  Settlement: {
    contract: settlementContract,
  },
  HandoverAct: {
    ownerCompany: handoverActOwnerCompany,
    renterCompany: handoverActRenterCompany,
  },
};
