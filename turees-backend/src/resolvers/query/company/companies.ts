import type { GraphqlContext } from "../../../app/api/graphql/route";
import { companies as companiesTable } from "../../../db/schema";
import { getDbOrThrow, mapCompany } from "../../db-utils";

export const companies = async (
  _: unknown,
  __: Record<string, never>,
  context: GraphqlContext,
) => {
  const db = getDbOrThrow(context);
  const rows = await db.select().from(companiesTable);

  return rows.map(mapCompany);
};
