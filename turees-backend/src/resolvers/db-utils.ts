import type { GraphqlContext } from "../app/api/graphql/route";
import type {
  companies,
  contractRates,
  handoverActs,
  materials,
  rentalMovements,
  rentals,
  settlementItems,
  settlements,
  users,
} from "../db/schema";

type CompanyRow = typeof companies.$inferSelect;
type UserRow = typeof users.$inferSelect;
type MaterialRow = typeof materials.$inferSelect;
type ContractRow = typeof rentals.$inferSelect;
type ContractRateRow = typeof contractRates.$inferSelect;
type RentalUsageRow = typeof rentalMovements.$inferSelect;
type SettlementRow = typeof settlements.$inferSelect;
type SettlementItemRow = typeof settlementItems.$inferSelect;
type HandoverActRow = typeof handoverActs.$inferSelect;

export const getDbOrThrow = (context: GraphqlContext) => {
  if (!context.db) {
    throw new Error("Database is not configured");
  }

  return context.db;
};

export const mapCompany = (company: CompanyRow) => ({
  id: company.id,
  name: company.name,
  registerNumber: company.registerNumber ?? "",
  phone: company.phone,
  email: company.email,
  address: company.address ?? null,
  logoUrl: company.logoUrl ?? null,
  role: company.role,
  createdAt: company.createdAt,
  updatedAt: company.updatedAt,
});

export const mapUser = (user: UserRow) => ({
  id: user.id,
  companyId: user.companyId,
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  phone: user.phone,
  position: user.position ?? null,
  permission:
    user.permission === "QUANTITY_ONLY" || user.permission === "FULL_ACCESS"
      ? user.permission
      : "FULL_ACCESS",
  isCompanyOwner: user.isCompanyOwner === "true",
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

export const mapMaterial = (material: MaterialRow) => ({
  id: material.id,
  ownerCompanyId: material.ownerCompanyId,
  code: material.code ?? null,
  name: material.name,
  description: material.description ?? null,
  unit: material.unit,
  defaultPrice: material.defaultPrice,
  createdAt: material.createdAt,
  updatedAt: material.updatedAt,
});

export const mapMasterContract = (
  contract: ContractRow,
  rates: ContractRateRow[] = [],
) => ({
  id: contract.id,
  contractNumber: contract.contractNumber,
  ownerCompanyId: contract.ownerCompanyId,
  renterCompanyId: contract.renterCompanyId,
  startDate: contract.startDate,
  endDate: contract.endDate ?? contract.startDate,
  status: contract.status,
  notes: contract.notes ?? null,
  rates: rates.map((rate) => ({
    id: rate.id,
    contractId: rate.contractId,
    materialId: rate.materialId,
    unit: rate.unit,
    unitPrice: rate.unitPrice,
    notes: rate.notes ?? null,
  })),
  createdAt: contract.createdAt,
  updatedAt: contract.updatedAt,
});

export const mapRentalUsage = (usage: RentalUsageRow) => ({
  id: usage.id,
  contractId: usage.rentalId,
  materialId: usage.materialId,
  movementType: usage.movementType,
  movementDate: usage.movementDate,
  quantity: usage.quantity,
  unit: usage.unit,
  unitPrice: usage.unitPrice,
  startDate: usage.startDate,
  endDate: usage.endDate,
  usageDays: usage.usageDays,
  lineTotal: usage.lineTotal,
  notes: usage.notes ?? null,
  createdAt: usage.createdAt,
  updatedAt: usage.updatedAt,
});

export const mapSettlementItem = (item: SettlementItemRow) => ({
  id: item.id,
  usageId: item.movementId,
  materialName: item.materialName,
  quantity: item.quantity,
  unit: item.unit,
  unitPrice: item.unitPrice,
  usageDays: item.usageDays,
  lineTotal: item.lineTotal,
});

export const mapSettlement = (
  settlement: SettlementRow,
  items: ReturnType<typeof mapSettlementItem>[] = [],
) => ({
  id: settlement.id,
  contractId: settlement.rentalId,
  settlementNumber: settlement.settlementNumber,
  periodStart: settlement.periodStart,
  periodEnd: settlement.periodEnd,
  items,
  subtotal: settlement.subtotal,
  tax: settlement.tax,
  total: settlement.total,
  status: settlement.status,
  createdAt: settlement.createdAt,
  updatedAt: settlement.updatedAt,
});

export const mapHandoverAct = (
  act: HandoverActRow,
  items: ReturnType<typeof mapSettlementItem>[] = [],
) => ({
  id: act.id,
  contractId: act.contractId,
  settlementId: act.settlementId,
  actNumber: act.actNumber,
  title: act.title,
  ownerCompanyId: act.ownerCompanyId,
  renterCompanyId: act.renterCompanyId,
  actDate: act.actDate,
  items,
  totalAmount: act.totalAmount,
  status: act.status,
  preparedByUserId: act.preparedByUserId ?? null,
  checkedByUserId: act.checkedByUserId ?? null,
  signedByOwnerName: act.signedByOwnerName ?? null,
  signedByRenterName: act.signedByRenterName ?? null,
  notes: act.notes ?? null,
  createdAt: act.createdAt,
  updatedAt: act.updatedAt,
});
