import type { GraphqlContext } from "../../../app/api/graphql/route";
import { materials } from "../../../db/schema";
import type { MutationCreateMaterialArgs } from "../../../generated";
import { getDbOrThrow, mapMaterial } from "../../db-utils";

export const createMaterial = async (
  _: unknown,
  { input }: MutationCreateMaterialArgs,
  context: GraphqlContext,
) => {
  const db = getDbOrThrow(context);
  const [row] = await db
    .insert(materials)
    .values({
      ownerCompanyId: input.ownerCompanyId,
      code: input.code ?? null,
      name: input.name,
      description: input.description ?? null,
      unit: input.unit,
      defaultPrice: input.defaultPrice,
    })
    .returning();

  return mapMaterial(row);
};
