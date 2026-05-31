import type { GraphqlContext } from "../../../app/api/graphql/route";
import { companies } from "../../../db/schema";
import type { MutationCreateCompanyArgs } from "../../../generated";
import { getDbOrThrow, mapCompany } from "../../db-utils";
import { normalizeLogoUrl } from "../../logo-url";

export const createCompany = async (
  _: unknown,
  { input }: MutationCreateCompanyArgs,
  context: GraphqlContext,
) => {
  const db = getDbOrThrow(context);
  const [row] = await db
    .insert(companies)
    .values({
      name: input.name,
      registerNumber: input.registerNumber ?? null,
      vatNumber: input.vatNumber ?? null,
      logoUrl: normalizeLogoUrl(input.logoUrl),
      phone: input.phone,
      email: input.email,
      address: input.address ?? null,
    })
    .returning();

  return mapCompany(row);
};
