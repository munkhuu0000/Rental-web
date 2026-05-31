import { eq } from "drizzle-orm";
import type { GraphqlContext } from "../../../app/api/graphql/route";
import { companies } from "../../../db/schema";
import type { QueryCompanyArgs } from "../../../generated";
import { getDbOrThrow, mapCompany } from "../../db-utils";

export const company = async (
  _: unknown,
  { id }: QueryCompanyArgs,
  context: GraphqlContext,
) => {
  const db = getDbOrThrow(context);
  const [row] = await db.select().from(companies).where(eq(companies.id, id)).limit(1);

  return row ? mapCompany(row) : null;
};
