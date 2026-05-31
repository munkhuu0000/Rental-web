import { baseSchema } from "./base.schema";
import { companySchema } from "./company.schema";
import { materialsSchema } from "./materials.schema";
import { rentalSchema } from "./rental.schema";
import { userSchema } from "./user.schema";

export const typeDefs = [
  baseSchema,
  companySchema,
  userSchema,
  materialsSchema,
  rentalSchema,
];
