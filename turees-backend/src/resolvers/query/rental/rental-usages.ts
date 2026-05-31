import { and, eq } from "drizzle-orm";
import type { GraphqlContext } from "../../../app/api/graphql/route";
import { rentalMovements } from "../../../db/schema";
import type { QueryRentalUsagesArgs } from "../../../generated";
import { getDbOrThrow, mapRentalUsage } from "../../db-utils";

export const rentalUsages = async (
  _: unknown,
  args: QueryRentalUsagesArgs,
  context: GraphqlContext,
) => {
  const db = getDbOrThrow(context);
  const filters = [
    args.contractId ? eq(rentalMovements.rentalId, args.contractId) : undefined,
    args.materialId ? eq(rentalMovements.materialId, args.materialId) : undefined,
  ].filter(Boolean);

  const rows =
    filters.length > 0
      ? await db.select().from(rentalMovements).where(and(...filters))
      : await db.select().from(rentalMovements);

  return rows.map(mapRentalUsage);
};
