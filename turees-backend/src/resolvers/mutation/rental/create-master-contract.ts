import type { GraphqlContext } from "../../../app/api/graphql/route";
import { contractRates, rentals } from "../../../db/schema";
import type { MutationCreateMasterContractArgs } from "../../../generated";
import { getDbOrThrow, mapMasterContract } from "../../db-utils";

export const createMasterContract = async (
  _: unknown,
  { input }: MutationCreateMasterContractArgs,
  context: GraphqlContext,
) => {
  const db = getDbOrThrow(context);
  const [contract] = await db
    .insert(rentals)
    .values({
      contractNumber: input.contractNumber,
      ownerCompanyId: input.ownerCompanyId,
      renterCompanyId: input.renterCompanyId,
      startDate: input.startDate,
      endDate: input.endDate,
      status: "DRAFT",
      notes: input.notes ?? null,
    })
    .returning();

  const insertedRates =
    input.rates.length > 0
      ? await db
          .insert(contractRates)
          .values(
            input.rates.map((rate) => ({
              contractId: contract.id,
              materialId: rate.materialId,
              unit: rate.unit,
              unitPrice: rate.unitPrice,
              notes: rate.notes ?? null,
            })),
          )
          .returning()
      : [];

  return mapMasterContract(contract, insertedRates);
};
