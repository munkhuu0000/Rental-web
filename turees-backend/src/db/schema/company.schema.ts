import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import {
  companyRoles,
  createdAtColumn,
  idColumn,
  updatedAtColumn,
} from "./base.schema";

export const companies = sqliteTable("companies", {
  id: idColumn(),
  name: text("name").notNull(),
  registerNumber: text("register_number"),
  vatNumber: text("vat_number"),
  logoUrl: text("logo_url"),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  address: text("address"),
  role: text("role", { enum: companyRoles }).notNull().default("BOTH"),
  createdAt: createdAtColumn(),
  updatedAt: updatedAtColumn(),
});
