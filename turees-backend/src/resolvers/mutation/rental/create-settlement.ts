import { eq } from "drizzle-orm";
import type { GraphqlContext } from "../../../app/api/graphql/route";
import { rentalMovements, settlementItems, settlements } from "../../../db/schema";
import type { MutationCreateSettlementArgs } from "../../../generated";
import { getDbOrThrow, mapSettlement, mapSettlementItem } from "../../db-utils";

export const createSettlement = async (
  _: unknown,
  { input }: MutationCreateSettlementArgs,
  context: GraphqlContext,
) => {
  const db = getDbOrThrow(context);
  const usages = await db
    .select()
    .from(rentalMovements)
    .where(eq(rentalMovements.rentalId, input.contractId));

  const subtotal = usages.reduce((sum, usage) => sum + usage.lineTotal, 0);
  const [settlement] = await db
    .insert(settlements)
    .values({
      rentalId: input.contractId,
      settlementNumber: input.settlementNumber,
      periodStart: input.periodStart,
      periodEnd: input.periodEnd,
      subtotal,
      tax: input.tax,
      total: subtotal + input.tax,
      status: "DRAFT",
    })
    .returning();

  const createdItems =
    usages.length > 0
      ? await db
          .insert(settlementItems)
          .values(
            usages.map((usage) => ({
              settlementId: settlement.id,
              movementId: usage.id,
              materialName: usage.materialId,
              quantity: usage.quantity,
              unit: usage.unit,
              unitPrice: usage.unitPrice,
              usageDays: usage.usageDays,
              lineTotal: usage.lineTotal,
            })),
          )
          .returning()
      : [];

  return mapSettlement(settlement, createdItems.map(mapSettlementItem));
};
