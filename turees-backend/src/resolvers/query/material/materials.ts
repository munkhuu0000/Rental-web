import { eq } from "drizzle-orm";
import type { GraphqlContext } from "../../../app/api/graphql/route";
import { materials as materialsTable } from "../../../db/schema";
import type { QueryMaterialsArgs } from "../../../generated";
import { getDbOrThrow, mapMaterial } from "../../db-utils";

export const materials = async (
  _: unknown,
  args: QueryMaterialsArgs,
  context: GraphqlContext,
) => {
  const db = getDbOrThrow(context);
  const query = db.select().from(materialsTable);
  const rows = args.ownerCompanyId
    ? await query.where(eq(materialsTable.ownerCompanyId, args.ownerCompanyId))
    : await query;

  return rows.map(mapMaterial);
};
