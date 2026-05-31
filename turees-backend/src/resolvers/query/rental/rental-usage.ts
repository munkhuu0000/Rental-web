import { eq } from "drizzle-orm";
import type { GraphqlContext } from "../../../app/api/graphql/route";
import { rentalMovements } from "../../../db/schema";
import type { QueryRentalUsageArgs } from "../../../generated";
import { getDbOrThrow, mapRentalUsage } from "../../db-utils";

export const rentalUsage = async (
  _: unknown,
  { id }: QueryRentalUsageArgs,
  context: GraphqlContext,
) => {
  const db = getDbOrThrow(context);
  const [row] = await db
    .select()
    .from(rentalMovements)
    .where(eq(rentalMovements.id, id))
    .limit(1);

  return row ? mapRentalUsage(row) : null;
};
