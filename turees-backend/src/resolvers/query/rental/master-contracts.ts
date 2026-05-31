import type { GraphqlContext } from "../../../app/api/graphql/route";
import { contractRates, rentals } from "../../../db/schema";
import { getDbOrThrow, mapMasterContract } from "../../db-utils";

export const masterContracts = async (
  _: unknown,
  __: Record<string, never>,
  context: GraphqlContext,
) => {
  const db = getDbOrThrow(context);
  const [contracts, rates] = await Promise.all([
    db.select().from(rentals),
    db.select().from(contractRates),
  ]);

  return contracts.map((contract) =>
    mapMasterContract(
      contract,
      rates.filter((rate) => rate.contractId === contract.id),
    ),
  );
};
