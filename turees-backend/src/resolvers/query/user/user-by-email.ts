import { asc, eq } from "drizzle-orm";
import type { GraphqlContext } from "../../../app/api/graphql/route";
import { users } from "../../../db/schema";
import type { QueryUserByEmailArgs } from "../../../generated";
import { getDbOrThrow, mapUser } from "../../db-utils";

export const userByEmail = async (
  _: unknown,
  { email }: QueryUserByEmailArgs,
  context: GraphqlContext,
) => {
  const db = getDbOrThrow(context);
  const [row] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (!row) {
    return null;
  }

  if (row.isCompanyOwner !== "true") {
    const companyUsers = await db
      .select()
      .from(users)
      .where(eq(users.companyId, row.companyId))
      .orderBy(asc(users.createdAt));
    const hasOwner = companyUsers.some((user) => user.isCompanyOwner === "true");

    if (!hasOwner && companyUsers[0]?.id === row.id) {
      return { ...mapUser(row), isCompanyOwner: true };
    }
  }

  return mapUser(row);
};
