import { eq } from "drizzle-orm";
import type { GraphqlContext } from "../../../app/api/graphql/route";
import { users } from "../../../db/schema";
import type { MutationUpdateUserArgs } from "../../../generated";
import { getDbOrThrow, mapUser } from "../../db-utils";

export const updateUser = async (
  _: unknown,
  { id, input }: MutationUpdateUserArgs,
  context: GraphqlContext,
) => {
  const db = getDbOrThrow(context);
  const [row] = await db
    .update(users)
    .set({
      ...(input.firstName != null ? { firstName: input.firstName } : {}),
      ...(input.lastName != null ? { lastName: input.lastName } : {}),
      ...(input.email != null ? { email: input.email } : {}),
      ...(input.phone != null ? { phone: input.phone } : {}),
      ...(input.position !== undefined ? { position: input.position } : {}),
      ...(input.permission != null ? { permission: input.permission } : {}),
      updatedAt: new Date().toISOString(),
    })
    .where(eq(users.id, id))
    .returning();

  if (!row) {
    throw new Error("User not found");
  }

  return mapUser(row);
};
