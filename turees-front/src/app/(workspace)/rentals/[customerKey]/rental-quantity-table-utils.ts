import { RentalRecord } from "@/lib/rental-records";

export type MaterialRow = {
  material: string;
  income: RentalRecord[];
  expense: RentalRecord[];
};

export const cellClass =
  "border border-[var(--line)] px-2.5 py-1.5 text-right";
export const headClass =
  "border border-[var(--line)] bg-[#f6f8f6] px-2.5 py-2 text-center text-[0.72rem] font-semibold uppercase tracking-[0.04em] text-[var(--muted)]";
export const stickyIndexHeadClass = `${headClass} sticky left-0 z-30 min-w-14`;
export const stickyNameHeadClass = `${headClass} sticky left-14 z-30 min-w-64`;
export const stickyIndexCellClass =
  "sticky left-0 z-20 border border-[var(--line)] px-2.5 py-1.5 text-center tabular-nums";
export const stickyNameCellClass =
  "sticky left-14 z-20 min-w-56 border border-[var(--line)] px-2.5 py-1.5 font-medium shadow-[8px_0_12px_-12px_rgba(0,0,0,0.28)]";

export function materialRows(records: RentalRecord[]) {
  const rows = new Map<string, MaterialRow>();

  for (const record of records) {
    const row = rows.get(record.material) ?? {
      material: record.material,
      income: [],
      expense: [],
    };

    if (record.movementType === "RETURN") {
      row.income.push(record);
    } else {
      row.expense.push(record);
    }

    rows.set(record.material, row);
  }

  return [...rows.values()].sort((a, b) =>
    a.material.localeCompare(b.material, "mn-MN"),
  );
}

export function uniqueColumns(
  records: RentalRecord[],
  movementType: "RETURN" | "OUT",
) {
  const columns = new Map<string, RentalRecord>();

  for (const record of records) {
    if ((record.movementType ?? "OUT") === movementType) {
      columns.set(record.id, record);
    }
  }

  return [...columns.values()].sort((a, b) =>
    a.date.localeCompare(b.date) || a.id.localeCompare(b.id),
  );
}

export function sum(records: RentalRecord[]) {
  return records.reduce((total, record) => total + record.quantity, 0);
}

export function columnQuantity(records: RentalRecord[], columnId: string) {
  return records.find((record) => record.id === columnId)?.quantity ?? 0;
}
