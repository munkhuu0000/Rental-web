import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { companies } from "./company.schema";
import {
  actStatuses,
  contractStatuses,
  createdAtColumn,
  idColumn,
  movementTypes,
  settlementStatuses,
  unitTypes,
  updatedAtColumn,
} from "./base.schema";
import { materials } from "./materials.schema";
import { users } from "./user.schema";

export const rentals = sqliteTable("rentals", {
  id: idColumn(),
  contractNumber: text("contract_number").notNull(),
  ownerCompanyId: text("owner_company_id")
    .notNull()
    .references(() => companies.id),
  renterCompanyId: text("renter_company_id")
    .notNull()
    .references(() => companies.id),
  startDate: text("start_date").notNull(),
  endDate: text("end_date"),
  status: text("status", { enum: contractStatuses }).notNull().default("DRAFT"),
  notes: text("notes"),
  createdAt: createdAtColumn(),
  updatedAt: updatedAtColumn(),
});

export const contractRates = sqliteTable("contract_rates", {
  id: idColumn(),
  contractId: text("contract_id")
    .notNull()
    .references(() => rentals.id),
  materialId: text("material_id")
    .notNull()
    .references(() => materials.id),
  unit: text("unit", { enum: unitTypes }).notNull().default("PCS"),
  unitPrice: real("unit_price").notNull().default(0),
  notes: text("notes"),
  createdAt: createdAtColumn(),
  updatedAt: updatedAtColumn(),
});

export const rentalMovements = sqliteTable("rental_movements", {
  id: idColumn(),
  rentalId: text("rental_id").references(() => rentals.id),
  materialId: text("material_id")
    .notNull()
    .references(() => materials.id),
  movementType: text("movement_type", { enum: movementTypes })
    .notNull()
    .default("OUT"),
  quantity: real("quantity").notNull().default(0),
  unit: text("unit", { enum: unitTypes }).notNull().default("PCS"),
  unitPrice: real("unit_price").notNull().default(0),
  startDate: text("start_date").notNull(),
  endDate: text("end_date").notNull(),
  usageDays: integer("usage_days").notNull().default(0),
  lineTotal: real("line_total").notNull().default(0),
  movementDate: text("movement_date").notNull(),
  notes: text("notes"),
  createdAt: createdAtColumn(),
  updatedAt: updatedAtColumn(),
});

export const settlements = sqliteTable("settlements", {
  id: idColumn(),
  rentalId: text("rental_id")
    .notNull()
    .references(() => rentals.id),
  settlementNumber: text("settlement_number").notNull(),
  periodStart: text("period_start").notNull(),
  periodEnd: text("period_end").notNull(),
  subtotal: real("subtotal").notNull().default(0),
  tax: real("tax").notNull().default(0),
  total: real("total").notNull().default(0),
  status: text("status", { enum: settlementStatuses })
    .notNull()
    .default("DRAFT"),
  createdAt: createdAtColumn(),
  updatedAt: updatedAtColumn(),
});

export const settlementItems = sqliteTable("settlement_items", {
  id: idColumn(),
  settlementId: text("settlement_id")
    .notNull()
    .references(() => settlements.id),
  movementId: text("movement_id")
    .notNull()
    .references(() => rentalMovements.id),
  materialName: text("material_name").notNull(),
  quantity: real("quantity").notNull().default(0),
  unit: text("unit", { enum: unitTypes }).notNull().default("PCS"),
  unitPrice: real("unit_price").notNull().default(0),
  usageDays: integer("usage_days").notNull().default(0),
  lineTotal: real("line_total").notNull().default(0),
  createdAt: createdAtColumn(),
  updatedAt: updatedAtColumn(),
});

export const handoverActs = sqliteTable("handover_acts", {
  id: idColumn(),
  contractId: text("contract_id")
    .notNull()
    .references(() => rentals.id),
  settlementId: text("settlement_id")
    .notNull()
    .references(() => settlements.id),
  actNumber: text("act_number").notNull(),
  title: text("title").notNull(),
  ownerCompanyId: text("owner_company_id")
    .notNull()
    .references(() => companies.id),
  renterCompanyId: text("renter_company_id")
    .notNull()
    .references(() => companies.id),
  actDate: text("act_date").notNull(),
  totalAmount: real("total_amount").notNull().default(0),
  status: text("status", { enum: actStatuses }).notNull().default("DRAFT"),
  preparedByUserId: text("prepared_by_user_id").references(() => users.id),
  checkedByUserId: text("checked_by_user_id").references(() => users.id),
  signedByOwnerName: text("signed_by_owner_name"),
  signedByRenterName: text("signed_by_renter_name"),
  notes: text("notes"),
  createdAt: createdAtColumn(),
  updatedAt: updatedAtColumn(),
});
