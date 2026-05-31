import { eq } from "drizzle-orm";
import type { GraphqlContext } from "../../../app/api/graphql/route";
import { contractRates, rentals } from "../../../db/schema";
import type { ResolversParentTypes } from "../../../generated";
import { getDbOrThrow, mapMasterContract } from "../../db-utils";

export const settlementContract = async (
  settlement: ResolversParentTypes["Settlement"],
  _: Record<string, never>,
  context: GraphqlContext,
) => {
  const db = getDbOrThrow(context);
  const [contract] = await db
    .select()
    .from(rentals)
    .where(eq(rentals.id, settlement.contractId))
    .limit(1);

  if (!contract) {
    return null;
  }

  const rates = await db
    .select()
    .from(contractRates)
    .where(eq(contractRates.contractId, contract.id));

  return mapMasterContract(contract, rates);
};
