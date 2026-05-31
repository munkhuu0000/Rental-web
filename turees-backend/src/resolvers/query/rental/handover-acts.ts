import { eq } from "drizzle-orm";
import type { GraphqlContext } from "../../../app/api/graphql/route";
import { handoverActs as handoverActsTable, settlementItems } from "../../../db/schema";
import type { QueryHandoverActsArgs } from "../../../generated";
import { getDbOrThrow, mapHandoverAct, mapSettlementItem } from "../../db-utils";

export const handoverActs = async (
  _: unknown,
  args: QueryHandoverActsArgs,
  context: GraphqlContext,
) => {
  const db = getDbOrThrow(context);
  const rows = args.contractId
    ? await db
        .select()
        .from(handoverActsTable)
        .where(eq(handoverActsTable.contractId, args.contractId))
    : await db.select().from(handoverActsTable);
  const items = await db.select().from(settlementItems);

  return rows.map((act) =>
    mapHandoverAct(
      act,
      items
        .filter((item) => item.settlementId === act.settlementId)
        .map(mapSettlementItem),
    ),
  );
};
