import { eq } from "drizzle-orm";
import type { GraphqlContext } from "../../../app/api/graphql/route";
import { materials } from "../../../db/schema";
import type { ResolversParentTypes } from "../../../generated";
import { getDbOrThrow, mapMaterial } from "../../db-utils";

export const contractRateMaterial = async (
  rate: ResolversParentTypes["ContractRate"],
  _: Record<string, never>,
  context: GraphqlContext,
) => {
  const db = getDbOrThrow(context);
  const [row] = await db
    .select()
    .from(materials)
    .where(eq(materials.id, rate.materialId))
    .limit(1);

  return row ? mapMaterial(row) : null;
};
