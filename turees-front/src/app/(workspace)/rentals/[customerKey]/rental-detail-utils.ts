import {
  CompanyOption,
  lineTotal,
  remaining,
  RentalRecord,
} from "@/lib/rental-records";

export type MaterialOption = {
  id: string;
  name: string;
  unit: string;
  defaultPrice: number;
};

export type BackendContract = {
  id: string;
  renterCompany?: CompanyOption | null;
};

export type BackendUsage = {
  id: string;
  contractId?: string | null;
  materialId: string;
  material?: MaterialOption | null;
  movementType: "OUT" | "RETURN";
  movementDate: string;
  quantity: number;
  unitPrice: number;
  usageDays: number;
  notes?: string | null;
};

export type RentalDetailData = {
  companies: CompanyOption[];
  materials: MaterialOption[];
  masterContracts: BackendContract[];
  rentalUsages: BackendUsage[];
};

export const NEW_MATERIAL_VALUE = "__new_material__";
export const HIDDEN_MATERIALS_STORAGE_KEY =
  "turees-hidden-rental-materials-v1";

export const unitOptions = [
  ["PCS", "Ширхэг"],
  ["M2", "м2"],
  ["M3", "м3"],
  ["TON", "Тонн"],
];

function parseNotes(notes?: string | null) {
  if (!notes) {
    return {};
  }

  try {
    const parsed = JSON.parse(notes);
    return typeof parsed === "object" && parsed
      ? (parsed as Record<string, string>)
      : {};
  } catch {
    return { note: notes };
  }
}

export function backendRecord(
  usage: BackendUsage,
  contractById: Map<string, BackendContract>,
): RentalRecord {
  const notes = parseNotes(usage.notes);
  const contract = usage.contractId
    ? contractById.get(usage.contractId)
    : undefined;
  const companyId = notes.companyId || contract?.renterCompany?.id;
  const companyName =
    notes.companyName ||
    contract?.renterCompany?.name ||
    notes.usedBy ||
    "Бүртгэлгүй харилцагч";
  const direction =
    notes.direction === "LEASE_IN" || notes.direction === "LEASE_OUT"
      ? notes.direction
      : usage.movementType === "OUT"
        ? "LEASE_OUT"
        : "LEASE_IN";

  return {
    id: `backend-${usage.id}`,
    direction,
    movementType: usage.movementType,
    date: usage.movementDate,
    party: notes.party || notes.usedBy || companyName,
    companyId,
    companyName,
    material: usage.material?.name || usage.materialId,
    quantity: usage.quantity,
    returned: 0,
    unitPrice: usage.unitPrice,
    durationDays: usage.usageDays || 1,
    note: notes.note || notes.usedAt || "",
  };
}

export function totals(records: RentalRecord[]) {
  return records.reduce(
    (summary, record) => {
      if (record.direction === "LEASE_OUT") {
        summary.receivable += lineTotal(record);
        summary.leaseOutRemaining += remaining(record);
      } else {
        summary.payable += lineTotal(record);
        summary.leaseInRemaining += remaining(record);
      }

      return summary;
    },
    {
      receivable: 0,
      payable: 0,
      leaseOutRemaining: 0,
      leaseInRemaining: 0,
    },
  );
}

export function today() {
  return new Date().toISOString().slice(0, 10);
}

export function loadHiddenMaterialIds() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored = window.localStorage.getItem(HIDDEN_MATERIALS_STORAGE_KEY);
    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? (parsed as string[]) : [];
  } catch {
    return [];
  }
}

export function saveHiddenMaterialIds(materialIds: string[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    HIDDEN_MATERIALS_STORAGE_KEY,
    JSON.stringify(materialIds),
  );
}
