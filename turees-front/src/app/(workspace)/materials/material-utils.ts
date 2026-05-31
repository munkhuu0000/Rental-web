import { materialCards } from "@/lib/mock-data";
import type { Filters, InventoryMaterial, MaterialMovement } from "./material-types";

const unitLabels: Record<string, string> = {
  PCS: "ширхэг",
  M2: "м2",
  M3: "м3",
  TON: "тн",
};

export function unitLabel(unit: string) {
  return unitLabels[unit] ?? unit;
}

export function formatMoney(amount: number) {
  return `${amount.toLocaleString()}₮`;
}

export function formatQuantity(quantity: number, unit: string) {
  return `${quantity.toLocaleString()} ${unitLabel(unit)}`;
}

export function sumMovements(movements: MaterialMovement[]) {
  return movements.reduce((total, movement) => total + movement.quantity, 0);
}

export function sumMovementAmounts(movements: MaterialMovement[]) {
  return movements.reduce(
    (total, movement) =>
      total + (movement.lineTotal || movement.quantity * movement.unitPrice),
    0,
  );
}

export function sortMovements(movements: MaterialMovement[]) {
  return [...movements].sort((a, b) => {
    const dateCompare = a.movementDate.localeCompare(b.movementDate);
    return dateCompare === 0 ? a.id.localeCompare(b.id) : dateCompare;
  });
}

export function movementMatchesFilter(
  movement: MaterialMovement,
  filters: Filters,
) {
  if (filters.dateFrom && movement.movementDate < filters.dateFrom) {
    return false;
  }

  if (filters.dateTo && movement.movementDate > filters.dateTo) {
    return false;
  }

  if (filters.movementType && movement.movementType !== filters.movementType) {
    return false;
  }

  if (
    filters.usedBy &&
    !movement.usedBy?.toLowerCase().includes(filters.usedBy.toLowerCase())
  ) {
    return false;
  }

  if (
    movement.movementType === "OUT" &&
    filters.usedAt &&
    !movement.usedAt?.toLowerCase().includes(filters.usedAt.toLowerCase())
  ) {
    return false;
  }

  if (
    filters.registeredBy &&
    !`${movement.registeredBy ?? ""} ${movement.registeredByEmail ?? ""}`
      .toLowerCase()
      .includes(filters.registeredBy.toLowerCase())
  ) {
    return false;
  }

  return true;
}

export function fallbackMaterials(): InventoryMaterial[] {
  return materialCards.map((material) => ({
    id: material.name,
    name: material.name,
    unit: material.unit,
    defaultPrice: 0,
    income: material.incomeMovements.map((movement) => ({
      ...movement,
      unit: material.unit,
      unitPrice: 0,
      lineTotal: 0,
      createdAt: movement.movementDate,
      usedBy: "",
      usedAt: "",
      registeredBy: "",
      registeredByEmail: "",
    })),
    expense: material.expenseMovements.map((movement) => ({
      ...movement,
      unit: material.unit,
      unitPrice: 0,
      lineTotal: 0,
      createdAt: movement.movementDate,
      usedBy: "",
      usedAt: "",
      registeredBy: "",
      registeredByEmail: "",
    })),
  }));
}
