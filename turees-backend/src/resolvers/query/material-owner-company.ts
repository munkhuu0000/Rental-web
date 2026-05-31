import { eq } from "drizzle-orm";
import type { GraphqlContext } from "../../app/api/graphql/route";
import { companies } from "../../db/schema";
import type { ResolversParentTypes } from "../../generated";
import { getDbOrThrow, mapCompany } from "../db-utils";

export const materialOwnerCompany = async (
  material: ResolversParentTypes["Material"],
  _: Record<string, never>,
  context: GraphqlContext,
) => {
  const db = getDbOrThrow(context);
  const [row] = await db
    .select()
    .from(companies)
    .where(eq(companies.id, material.ownerCompanyId))
    .limit(1);

  return row ? mapCompany(row) : null;
};
