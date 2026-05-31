import { asc, eq } from "drizzle-orm";
import type { GraphqlContext } from "../../../app/api/graphql/route";
import { users as usersTable } from "../../../db/schema";
import type { QueryUsersArgs } from "../../../generated";
import { getDbOrThrow, mapUser } from "../../db-utils";

export const users = async (
  _: unknown,
  args: QueryUsersArgs,
  context: GraphqlContext,
) => {
  const db = getDbOrThrow(context);
  const query = db.select().from(usersTable);
  let rows = args.companyId
    ? await query.where(eq(usersTable.companyId, args.companyId))
    : await query;

  if (args.companyId && rows.length > 0) {
    const hasOwner = rows.some((user) => user.isCompanyOwner === "true");

    if (!hasOwner) {
      const [firstCompanyUser] = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.companyId, args.companyId))
        .orderBy(asc(usersTable.createdAt))
        .limit(1);

      if (firstCompanyUser) {
        rows = rows.map((user) =>
          user.id === firstCompanyUser.id
            ? { ...user, isCompanyOwner: "true" }
            : user,
        );
      }
    }
  }

  return rows.map(mapUser);
};
