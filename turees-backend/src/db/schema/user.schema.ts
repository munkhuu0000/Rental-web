import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { companies } from "./company.schema";
import {
  createdAtColumn,
  idColumn,
  updatedAtColumn,
  userPermissions,
} from "./base.schema";

export const users = sqliteTable("users", {
  id: idColumn(),
  companyId: text("company_id")
    .notNull()
    .references(() => companies.id),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone").notNull(),
  position: text("position"),
  permission: text("permission", { enum: userPermissions })
    .notNull()
    .default("FULL_ACCESS"),
  isCompanyOwner: text("is_company_owner").notNull().default("false"),
  createdAt: createdAtColumn(),
  updatedAt: updatedAtColumn(),
});
