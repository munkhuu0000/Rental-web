import { text } from "drizzle-orm/sqlite-core";

export const companyRoles = ["OWNER", "RENTER", "BOTH"] as const;
export const userPermissions = ["FULL_ACCESS", "QUANTITY_ONLY"] as const;
export const unitTypes = [
  "PCS",
  "M2",
  "M3",
  "TON",
] as const;
export const rentalStatuses = ["OPEN", "CLOSED", "CANCELLED"] as const;
export const movementTypes = ["OUT", "RETURN"] as const;
export const settlementStatuses = [
  "DRAFT",
  "CONFIRMED",
  "PAID",
  "CANCELLED",
] as const;
export const contractStatuses = [
  "DRAFT",
  "ACTIVE",
  "EXPIRED",
  "TERMINATED",
] as const;
export const actStatuses = ["DRAFT", "READY", "SIGNED", "VOID"] as const;

export const idColumn = (name = "id") =>
  text(name)
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID());

export const createdAtColumn = () =>
  text("created_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString());

export const updatedAtColumn = () =>
  text("updated_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString());
