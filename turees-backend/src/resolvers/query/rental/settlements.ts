import { eq } from "drizzle-orm";
import type { GraphqlContext } from "../../../app/api/graphql/route";
import { settlementItems, settlements as settlementsTable } from "../../../db/schema";
import type { QuerySettlementsArgs } from "../../../generated";
import { getDbOrThrow, mapSettlement, mapSettlementItem } from "../../db-utils";

export const settlements = async (
  _: unknown,
  args: QuerySettlementsArgs,
  context: GraphqlContext,
) => {
  const db = getDbOrThrow(context);
  const rows = args.contractId
    ? await db
        .select()
        .from(settlementsTable)
        .where(eq(settlementsTable.rentalId, args.contractId))
    : await db.select().from(settlementsTable);
  const items = await db.select().from(settlementItems);

  return rows.map((settlement) =>
    mapSettlement(
      settlement,
      items
        .filter((item) => item.settlementId === settlement.id)
        .map(mapSettlementItem),
    ),
  );
};
