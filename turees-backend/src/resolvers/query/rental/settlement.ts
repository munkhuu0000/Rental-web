import { eq } from "drizzle-orm";
import type { GraphqlContext } from "../../../app/api/graphql/route";
import { settlementItems, settlements as settlementsTable } from "../../../db/schema";
import type { QuerySettlementArgs } from "../../../generated";
import { getDbOrThrow, mapSettlement, mapSettlementItem } from "../../db-utils";

export const settlement = async (
  _: unknown,
  { id }: QuerySettlementArgs,
  context: GraphqlContext,
) => {
  const db = getDbOrThrow(context);
  const [row] = await db
    .select()
    .from(settlementsTable)
    .where(eq(settlementsTable.id, id))
    .limit(1);

  if (!row) {
    return null;
  }

  const items = await db
    .select()
    .from(settlementItems)
    .where(eq(settlementItems.settlementId, row.id));

  return mapSettlement(row, items.map(mapSettlementItem));
};
