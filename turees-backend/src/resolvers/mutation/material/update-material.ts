import { eq } from "drizzle-orm";
import type { GraphqlContext } from "../../../app/api/graphql/route";
import { materials } from "../../../db/schema";
import type { MutationUpdateMaterialArgs } from "../../../generated";
import { getDbOrThrow, mapMaterial } from "../../db-utils";

export const updateMaterial = async (
  _: unknown,
  { id, input }: MutationUpdateMaterialArgs,
  context: GraphqlContext,
) => {
  const db = getDbOrThrow(context);
  const [row] = await db
    .update(materials)
    .set({
      ...(input.code !== undefined ? { code: input.code } : {}),
      ...(input.name != null ? { name: input.name } : {}),
      ...(input.description !== undefined
        ? { description: input.description }
        : {}),
      ...(input.unit != null ? { unit: input.unit } : {}),
      ...(input.defaultPrice != null
        ? { defaultPrice: input.defaultPrice }
        : {}),
      updatedAt: new Date().toISOString(),
    })
    .where(eq(materials.id, id))
    .returning();

  if (!row) {
    throw new Error("Material not found");
  }

  return mapMaterial(row);
};
