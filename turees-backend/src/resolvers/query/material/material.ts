import { eq } from "drizzle-orm";
import type { GraphqlContext } from "../../../app/api/graphql/route";
import { materials } from "../../../db/schema";
import type { QueryMaterialArgs } from "../../../generated";
import { getDbOrThrow, mapMaterial } from "../../db-utils";

export const material = async (
  _: unknown,
  { id }: QueryMaterialArgs,
  context: GraphqlContext,
) => {
  const db = getDbOrThrow(context);
  const [row] = await db.select().from(materials).where(eq(materials.id, id)).limit(1);

  return row ? mapMaterial(row) : null;
};
