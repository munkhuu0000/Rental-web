export type Material = {
  id: string;
  name: string;
  unit: string;
  defaultPrice: number;
};

export type MaterialMovement = {
  id: string;
  contractId?: string | null;
  materialId: string;
  movementType: "OUT" | "RETURN";
  movementDate: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  lineTotal: number;
  createdAt: string;
  notes?: string | null;
  usedBy?: string;
  usedAt?: string;
  registeredBy?: string;
  registeredByEmail?: string;
};

export type MasterContract = {
  id: string;
  notes?: string | null;
  renterCompany?: {
    name: string;
  } | null;
};

export type InventoryMaterial = Material & {
  income: MaterialMovement[];
  expense: MaterialMovement[];
};

export type Filters = {
  dateFrom: string;
  dateTo: string;
  usedBy: string;
  usedAt: string;
  registeredBy: string;
  movementType: string;
};
