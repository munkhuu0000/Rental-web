"use client";

import { useState } from "react";
import { RentalMovementType, RentalRecord } from "@/lib/rental-records";

type RentalRecordsEditorProps = {
  records: RentalRecord[];
  onUpdate: (record: RentalRecord) => void;
};

type EditValues = {
  date: string;
  movementType: RentalMovementType;
  material: string;
  quantity: string;
  unitPrice: string;
  note: string;
};

const headClass =
  "border border-[var(--line)] bg-[var(--surface-muted)] px-3 py-2.5 text-left text-[0.72rem] font-semibold uppercase tracking-[0.04em] text-[var(--muted)]";
const cellClass =
  "border border-[var(--line)] px-3 py-2 text-[0.82rem] text-[var(--foreground)]";
const inputClass =
  "input-shell h-9 w-full px-2 text-[0.82rem] text-[var(--foreground)]";

function isLocalRecord(record: RentalRecord) {
  return record.id.startsWith("local-");
}

function valuesFromRecord(record: RentalRecord): EditValues {
  return {
    date: record.date,
    movementType: record.movementType ?? "OUT",
    material: record.material,
    quantity: String(record.quantity),
    unitPrice: String(record.unitPrice),
    note: record.note,
  };
}

export function RentalRecordsEditor({
  records,
  onUpdate,
}: RentalRecordsEditorProps) {
  const [editingId, setEditingId] = useState("");
  const [values, setValues] = useState<EditValues | null>(null);

  function startEdit(record: RentalRecord) {
    setEditingId(record.id);
    setValues(valuesFromRecord(record));
  }

  function save(record: RentalRecord) {
    if (!values) {
      return;
    }

    onUpdate({
      ...record,
      date: values.date,
      movementType: values.movementType,
      material: values.material.trim(),
      quantity: Math.max(1, Number(values.quantity || 1)),
      unitPrice: Math.max(0, Number(values.unitPrice || 0)),
      note: values.note.trim(),
    });
    setEditingId("");
    setValues(null);
  }

  function update(field: keyof EditValues, value: string) {
    setValues((current) => current ? { ...current, [field]: value } : current);
  }

  return (
    <div className="app-card mb-4 overflow-hidden">
      <div className="border-b border-[var(--line)] px-4 py-3">
        <p className="text-sm font-semibold">Бүртгэлүүд</p>
      </div>
      <div className="overflow-x-auto">
        <table className="font-data w-full min-w-[920px] border-collapse">
          <thead>
            <tr>
              {["Огноо", "Хөдөлгөөн", "Материал", "Тоо", "Нэгж үнэ", "Тэмдэглэл", ""].map((header) => (
                <th key={header} className={headClass}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <RecordRow
                key={record.id}
                record={record}
                editing={editingId === record.id}
                values={values}
                onStartEdit={startEdit}
                onSave={save}
                onCancel={() => { setEditingId(""); setValues(null); }}
                onChange={update}
              />
            ))}
            {records.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-3 py-8 text-center text-sm text-[var(--muted)]">
                  Одоогоор бүртгэл алга.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function RecordRow(props: {
  record: RentalRecord;
  editing: boolean;
  values: EditValues | null;
  onStartEdit: (record: RentalRecord) => void;
  onSave: (record: RentalRecord) => void;
  onCancel: () => void;
  onChange: (field: keyof EditValues, value: string) => void;
}) {
  const { record, editing, values } = props;

  if (editing && values) {
    return (
      <tr className="bg-[var(--accent-soft)]">
        <td className={cellClass}><Input type="date" value={values.date} onChange={(value) => props.onChange("date", value)} /></td>
        <td className={cellClass}>
          <select value={values.movementType} onChange={(event) => props.onChange("movementType", event.target.value as RentalMovementType)} className={inputClass}>
            <option value="RETURN">Орлого</option>
            <option value="OUT">Зарлага</option>
          </select>
        </td>
        <td className={cellClass}><Input value={values.material} onChange={(value) => props.onChange("material", value)} /></td>
        <td className={cellClass}><Input type="number" value={values.quantity} onChange={(value) => props.onChange("quantity", value)} /></td>
        <td className={cellClass}><Input type="number" value={values.unitPrice} onChange={(value) => props.onChange("unitPrice", value)} /></td>
        <td className={cellClass}><Input value={values.note} onChange={(value) => props.onChange("note", value)} /></td>
        <td className={`${cellClass} whitespace-nowrap text-right`}>
          <button type="button" onClick={() => props.onSave(record)} className="soft-chip mr-2 px-3 py-1 font-semibold">Хадгалах</button><button type="button" onClick={props.onCancel} className="soft-chip px-3 py-1 font-semibold">Цуцлах</button>
        </td>
      </tr>
    );
  }

  return (
    <tr className="odd:bg-[#fbfcfb] even:bg-[var(--surface)]">
      <td className={cellClass}>{record.date}</td>
      <td className={cellClass}>{record.movementType === "RETURN" ? "Орлого" : "Зарлага"}</td>
      <td className={cellClass}>{record.material}</td>
      <td className={`${cellClass} text-right`}>{record.quantity.toLocaleString()}</td>
      <td className={`${cellClass} text-right`}>{record.unitPrice.toLocaleString()}</td>
      <td className={cellClass}>{record.note || "-"}</td>
      <td className={`${cellClass} text-right`}>
        {isLocalRecord(record) ? (
          <button type="button" onClick={() => props.onStartEdit(record)} className="soft-chip px-3 py-1 font-semibold">Засах</button>
        ) : <span className="text-[var(--muted)]">Backend</span>}
      </td>
    </tr>
  );
}

function Input(props: { type?: string; value: string; onChange: (value: string) => void }) {
  return (
    <input
      type={props.type ?? "text"}
      value={props.value}
      onChange={(event) => props.onChange(event.target.value)}
      className={inputClass}
    />
  );
}
