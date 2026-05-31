import { eq } from "drizzle-orm";
import type { GraphqlContext } from "../../../app/api/graphql/route";
import { handoverActs, rentals, settlements } from "../../../db/schema";
import type { MutationCreateHandoverActArgs } from "../../../generated";
import { getDbOrThrow, mapHandoverAct } from "../../db-utils";

export const createHandoverAct = async (
  _: unknown,
  { input }: MutationCreateHandoverActArgs,
  context: GraphqlContext,
) => {
  const db = getDbOrThrow(context);
  const [settlement] = await db
    .select()
    .from(settlements)
    .where(eq(settlements.id, input.settlementId))
    .limit(1);

  if (!settlement) {
    throw new Error("Settlement not found");
  }

  const [contract] = await db
    .select()
    .from(rentals)
    .where(eq(rentals.id, input.contractId))
    .limit(1);

  if (!contract) {
    throw new Error("Contract not found");
  }

  const [act] = await db
    .insert(handoverActs)
    .values({
      contractId: input.contractId,
      settlementId: input.settlementId,
      actNumber: input.actNumber,
      title: input.title,
      ownerCompanyId: contract.ownerCompanyId,
      renterCompanyId: contract.renterCompanyId,
      actDate: input.actDate,
      totalAmount: settlement.total,
      status: "DRAFT",
      preparedByUserId: input.preparedByUserId ?? null,
      checkedByUserId: input.checkedByUserId ?? null,
      signedByOwnerName: input.signedByOwnerName ?? null,
      signedByRenterName: input.signedByRenterName ?? null,
      notes: input.notes ?? null,
    })
    .returning();

  return mapHandoverAct(act, []);
};
