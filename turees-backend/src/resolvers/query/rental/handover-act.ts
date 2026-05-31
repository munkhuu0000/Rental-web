import { eq } from "drizzle-orm";
import type { GraphqlContext } from "../../../app/api/graphql/route";
import { handoverActs as handoverActsTable, settlementItems } from "../../../db/schema";
import type { QueryHandoverActArgs } from "../../../generated";
import { getDbOrThrow, mapHandoverAct, mapSettlementItem } from "../../db-utils";

export const handoverAct = async (
  _: unknown,
  { id }: QueryHandoverActArgs,
  context: GraphqlContext,
) => {
  const db = getDbOrThrow(context);
  const [row] = await db
    .select()
    .from(handoverActsTable)
    .where(eq(handoverActsTable.id, id))
    .limit(1);

  if (!row) {
    return null;
  }

  const items = await db
    .select()
    .from(settlementItems)
    .where(eq(settlementItems.settlementId, row.settlementId));

  return mapHandoverAct(row, items.map(mapSettlementItem));
};
