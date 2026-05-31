import { real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { companies } from "./company.schema";
import {
  createdAtColumn,
  idColumn,
  unitTypes,
  updatedAtColumn,
} from "./base.schema";

export const materials = sqliteTable("materials", {
  id: idColumn(),
  ownerCompanyId: text("owner_company_id")
    .notNull()
    .references(() => companies.id),
  code: text("code"),
  name: text("name").notNull(),
  description: text("description"),
  unit: text("unit", { enum: unitTypes }).notNull().default("PCS"),
  defaultPrice: real("default_price").notNull().default(0),
  createdAt: createdAtColumn(),
  updatedAt: updatedAtColumn(),
});
