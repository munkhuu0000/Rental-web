import type { GraphqlContext } from "../../../app/api/graphql/route";
import { rentalMovements } from "../../../db/schema";
import type { MutationCreateRentalUsageArgs } from "../../../generated";
import { getDbOrThrow, mapRentalUsage } from "../../db-utils";

export const createRentalUsage = async (
  _: unknown,
  { input }: MutationCreateRentalUsageArgs,
  context: GraphqlContext,
) => {
  const db = getDbOrThrow(context);
  const resolvedUnitPrice = input.unitPrice ?? 0;
  const movementInput = input as typeof input & {
    contractId?: string | null;
    movementDate?: string | null;
    movementType?: "OUT" | "RETURN" | null;
  };
  const movementDate = movementInput.movementDate ?? input.startDate;
  const movementType = movementInput.movementType ?? "OUT";
  const [row] = await db
    .insert(rentalMovements)
    .values({
      rentalId: movementInput.contractId || null,
      materialId: input.materialId,
      movementType,
      quantity: input.quantity,
      unit: input.unit,
      unitPrice: resolvedUnitPrice,
      startDate: input.startDate,
      endDate: input.endDate,
      usageDays: input.usageDays,
      lineTotal: input.quantity * resolvedUnitPrice,
      movementDate,
      notes: input.notes ?? null,
    })
    .returning();

  return mapRentalUsage(row);
};
