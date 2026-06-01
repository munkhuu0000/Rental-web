import { RentalRecord } from "@/lib/rental-records";

export type TakenBatch = {
  record: RentalRecord;
  remaining: number;
};

export type SettlementLine = {
  material: string;
  taken?: RentalRecord;
  returnRecord?: RentalRecord;
  returnedQuantity: number;
  fieldRemaining: number;
};

export const settlementHeadClass =
  "border border-[var(--line)] bg-[var(--surface-muted)] px-3 py-2.5 text-center text-[0.72rem] font-semibold uppercase tracking-[0.04em] text-[var(--muted)]";
export const settlementCellClass =
  "border border-[var(--line)] px-3 py-2 text-right text-[0.82rem] text-[var(--foreground)]";
export const settlementLabelClass =
  "border border-[var(--line)] bg-[var(--surface-muted)] px-3 py-2 text-[0.82rem] font-semibold text-[var(--foreground)]";

export function formatDate(value?: string) {
  return value ? value.replaceAll("-", "/") : "";
}

export function daysBetween(start?: string, end?: string) {
  if (!start || !end) {
    return 0;
  }

  const startTime = new Date(`${start}T00:00:00`).getTime();
  const endTime = new Date(`${end}T00:00:00`).getTime();
  return Math.max(Math.round((endTime - startTime) / 86_400_000), 0);
}

export function money(value: number) {
  return value ? value.toLocaleString() : "";
}

export function buildSettlementLines(records: RentalRecord[]) {
  const materials = new Map<string, RentalRecord[]>();

  for (const record of records) {
    materials.set(record.material, [...(materials.get(record.material) ?? []), record]);
  }

  return [...materials.entries()]
    .sort(([a], [b]) => a.localeCompare(b, "mn-MN"))
    .flatMap(([material, materialRecords]) =>
      buildMaterialSettlementLines(material, materialRecords),
    );
}

function buildMaterialSettlementLines(material: string, records: RentalRecord[]) {
  const batches = records
    .filter((record) => record.movementType !== "RETURN")
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((record) => ({ record, remaining: record.quantity }));
  const returns = records
    .filter((record) => record.movementType === "RETURN")
    .sort((a, b) => a.date.localeCompare(b.date));
  const lines: SettlementLine[] = [];

  for (const returnRecord of returns) {
    consumeReturn(material, returnRecord, batches, lines);
  }

  for (const batch of batches.filter((batch) => batch.remaining > 0)) {
    lines.push({
      material,
      taken: batch.record,
      returnedQuantity: 0,
      fieldRemaining: batch.remaining,
    });
  }

  return lines.length ? lines : [{ material, returnedQuantity: 0, fieldRemaining: 0 }];
}

function consumeReturn(
  material: string,
  returnRecord: RentalRecord,
  batches: TakenBatch[],
  lines: SettlementLine[],
) {
  let quantity = returnRecord.quantity;

  for (const batch of batches) {
    if (quantity <= 0 || batch.remaining <= 0) {
      continue;
    }

    const returnedQuantity = Math.min(quantity, batch.remaining);
    batch.remaining -= returnedQuantity;
    quantity -= returnedQuantity;
    lines.push({
      material,
      taken: batch.record,
      returnRecord,
      returnedQuantity,
      fieldRemaining: batch.remaining,
    });
  }
}

export function groupedSettlementLines(records: RentalRecord[]) {
  return buildSettlementLines(records).reduce((groups, line) => {
    groups.set(line.material, [...(groups.get(line.material) ?? []), line]);
    return groups;
  }, new Map<string, SettlementLine[]>());
}

export function lineDays(line: SettlementLine) {
  return daysBetween(line.taken?.date, line.returnRecord?.date);
}

export function lineTotal(line: SettlementLine) {
  return line.returnedQuantity * (line.taken?.unitPrice ?? 0) * lineDays(line);
}
