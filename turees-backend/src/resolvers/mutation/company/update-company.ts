import { eq } from "drizzle-orm";
import type { GraphqlContext } from "../../../app/api/graphql/route";
import { companies } from "../../../db/schema";
import type { MutationUpdateCompanyArgs } from "../../../generated";
import { getDbOrThrow, mapCompany } from "../../db-utils";
import { normalizeLogoUrl } from "../../logo-url";

export const updateCompany = async (
  _: unknown,
  { id, input }: MutationUpdateCompanyArgs,
  context: GraphqlContext,
) => {
  const db = getDbOrThrow(context);

  const [existingCompany] = await db
    .select()
    .from(companies)
    .where(eq(companies.id, id))
    .limit(1);

  if (!existingCompany) {
    throw new Error("Company not found");
  }

  if (input.name != null && input.name !== existingCompany.name) {
    throw new Error("Company name cannot be changed after registration");
  }

  if (
    existingCompany.registerNumber &&
    input.registerNumber !== undefined &&
    input.registerNumber !== existingCompany.registerNumber
  ) {
    throw new Error("Company register number cannot be changed after registration");
  }

  const [row] = await db
    .update(companies)
    .set({
      ...(!existingCompany.registerNumber && input.registerNumber !== undefined
        ? { registerNumber: input.registerNumber }
        : {}),
      ...(input.vatNumber !== undefined ? { vatNumber: input.vatNumber } : {}),
      ...(input.logoUrl !== undefined ? { logoUrl: normalizeLogoUrl(input.logoUrl) } : {}),
      ...(input.phone != null ? { phone: input.phone } : {}),
      ...(input.email != null ? { email: input.email } : {}),
      ...(input.address !== undefined ? { address: input.address } : {}),
      updatedAt: new Date().toISOString(),
    })
    .where(eq(companies.id, id))
    .returning();

  return mapCompany(row);
};
