import { eq } from "drizzle-orm";
import type { GraphqlContext } from "../../../app/api/graphql/route";
import { users } from "../../../db/schema";
import type { MutationCreateUserArgs } from "../../../generated";
import { getDbOrThrow, mapUser } from "../../db-utils";

export const createUser = async (
  _: unknown,
  { input }: MutationCreateUserArgs,
  context: GraphqlContext,
) => {
  const db = getDbOrThrow(context);

  const [existingUser] = await db
    .select()
    .from(users)
    .where(eq(users.email, input.email))
    .limit(1);

  if (existingUser) {
    return mapUser(existingUser);
  }

  const [createdUser] = await db
    .insert(users)
    .values({
      companyId: input.companyId,
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      phone: input.phone,
      position: input.position ?? null,
      permission: input.permission ?? "FULL_ACCESS",
      isCompanyOwner: input.isCompanyOwner ? "true" : "false",
    })
    .returning();

  return mapUser(createdUser);
};
