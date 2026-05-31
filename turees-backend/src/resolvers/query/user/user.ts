import { eq } from "drizzle-orm";
import type { GraphqlContext } from "../../../app/api/graphql/route";
import { users } from "../../../db/schema";
import type { QueryUserArgs } from "../../../generated";
import { getDbOrThrow, mapUser } from "../../db-utils";

export const user = async (
  _: unknown,
  { id }: QueryUserArgs,
  context: GraphqlContext,
) => {
  const db = getDbOrThrow(context);
  const [row] = await db.select().from(users).where(eq(users.id, id)).limit(1);

  return row ? mapUser(row) : null;
};
