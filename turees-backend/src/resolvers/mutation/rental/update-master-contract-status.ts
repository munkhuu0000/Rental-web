import { eq } from "drizzle-orm";
import type { GraphqlContext } from "../../../app/api/graphql/route";
import { contractRates, rentals } from "../../../db/schema";
import type { MutationUpdateMasterContractStatusArgs } from "../../../generated";
import { getDbOrThrow, mapMasterContract } from "../../db-utils";

export const updateMasterContractStatus = async (
  _: unknown,
  { input }: MutationUpdateMasterContractStatusArgs,
  context: GraphqlContext,
) => {
  const db = getDbOrThrow(context);
  const [contract] = await db
    .update(rentals)
    .set({
      status: input.status,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(rentals.id, input.contractId))
    .returning();

  if (!contract) {
    throw new Error("Contract not found");
  }

  const rates = await db
    .select()
    .from(contractRates)
    .where(eq(contractRates.contractId, contract.id));

  return mapMasterContract(contract, rates);
};
