"use client";

import { useMemo, useState } from "react";
import { RentalRecord } from "@/lib/rental-records";

type RentalRepairTableProps = {
  records: RentalRecord[];
};

type RepairValues = {
  quantity: string;
  unitPrice: string;
};

type RepairRow = {
  key: string;
  material: string;
  kind: "repair" | "scrap";
  label: string;
};

const headClass =
  "border border-[var(--line)] bg-[var(--surface-muted)] px-3 py-2.5 text-center text-[0.72rem] font-semibold uppercase tracking-[0.04em] text-[var(--muted)]";
const cellClass =
  "border border-[var(--line)] px-3 py-2 text-right text-[0.82rem] text-[var(--foreground)]";
const textCellClass =
  "border border-[var(--line)] px-3 py-2 text-[0.82rem] text-[var(--foreground)]";
const inputClass =
  "h-8 w-full min-w-20 rounded border border-[var(--line)] bg-white px-2 text-right text-[0.82rem] text-[var(--foreground)] outline-none focus:border-[var(--accent)]";

function repairTypes(material: string) {
  return material.includes("Хэв хашмал")
    ? ["Паниар солих", "Гагнуур"]
    : ["Засвар"];
}

function uniqueMaterials(records: RentalRecord[]) {
  return [...new Set(records.map((record) => record.material).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b, "mn-MN"));
}

function rowsForMaterial(material: string): RepairRow[] {
  return [
    ...repairTypes(material).map((label) => ({
      key: `${material}::repair::${label}`,
      material,
      kind: "repair" as const,
      label,
    })),
    {
      key: `${material}::scrap`,
      material,
      kind: "scrap",
      label: "Актлах",
    },
  ];
}

function toNumber(value: string) {
  return Number(value || 0);
}

function rowTotal(values: RepairValues) {
  return toNumber(values.quantity) * toNumber(values.unitPrice);
}

const emptyValues: RepairValues = {
  quantity: "",
  unitPrice: "",
};

export function RentalRepairTable({ records }: RentalRepairTableProps) {
  const [values, setValues] = useState<Record<string, RepairValues>>({});
  const materials = useMemo(() => uniqueMaterials(records), [records]);
  const rows = materials.flatMap(rowsForMaterial);
  const total = rows.reduce(
    (sum, row) => sum + rowTotal(values[row.key] ?? emptyValues),
    0,
  );

  function update(rowKey: string, field: keyof RepairValues, value: string) {
    setValues((current) => ({
      ...current,
      [rowKey]: {
        ...(current[rowKey] ?? emptyValues),
        [field]: value,
      },
    }));
  }

  return (
    <div className="app-card overflow-hidden">
      <div className="border-b border-[var(--line)] px-4 py-3">
        <p className="text-sm font-semibold">
          Засвар болон акталсан барааны тооцоо
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="font-data w-full min-w-[820px] border-collapse bg-[var(--surface)]">
          <thead>
            <tr>
              {["Материал", "Төрөл", "Засвар/акт", "Тоо", "Нэгж үнэ", "Дүн"].map((header) => (
                <th key={header} className={headClass}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <RepairTableRow
                key={row.key}
                row={row}
                showMaterial={index === 0 || rows[index - 1]?.material !== row.material}
                values={values[row.key] ?? emptyValues}
                onChange={(field, value) => update(row.key, field, value)}
              />
            ))}
            {rows.length ? (
              <tr className="bg-[var(--accent-soft)] font-semibold">
                <td className={cellClass} colSpan={5}>Нийт</td>
                <td className={cellClass}>{total.toLocaleString()}</td>
              </tr>
            ) : (
              <tr>
                <td colSpan={6} className="px-3 py-8 text-center text-sm text-[var(--muted)]">
                  Засварын тооцоо хийх материал олдсонгүй.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function RepairTableRow(props: {
  row: RepairRow;
  showMaterial: boolean;
  values: RepairValues;
  onChange: (field: keyof RepairValues, value: string) => void;
}) {
  const total = rowTotal(props.values);

  return (
    <tr className="odd:bg-[#fbfcfb] even:bg-[var(--surface)]">
      <td className={`${textCellClass} font-semibold`}>
        {props.showMaterial ? props.row.material : ""}
      </td>
      <td className={textCellClass}>
        {props.row.kind === "repair" ? "Засвар" : "Акталсан бараа"}
      </td>
      <td className={textCellClass}>{props.row.label}</td>
      <EditableCell value={props.values.quantity} onChange={(value) => props.onChange("quantity", value)} />
      <EditableCell value={props.values.unitPrice} onChange={(value) => props.onChange("unitPrice", value)} />
      <td className={`${cellClass} font-semibold`}>{total.toLocaleString()}</td>
    </tr>
  );
}

function EditableCell(props: { value: string; onChange: (value: string) => void }) {
  return (
    <td className={cellClass}>
      <input
        type="number"
        min="0"
        value={props.value}
        onChange={(event) => props.onChange(event.target.value)}
        className={inputClass}
      />
    </td>
  );
}
