import { today, unitOptions } from "./rental-detail-utils";

export function MovementField() {
  return (
    <div className="space-y-1 text-sm font-medium text-[var(--muted)]">
      <label>Хөдөлгөөн</label>
      <div className="grid h-10 grid-cols-2 rounded-md border border-[var(--line)] bg-[var(--surface-muted)] p-1">
        {[
          ["RETURN", "Орлого"],
          ["OUT", "Зарлага"],
        ].map(([value, label]) => (
          <label
            key={value}
            className="flex cursor-pointer items-center justify-center rounded text-xs font-semibold text-[var(--muted)] has-[:checked]:bg-white has-[:checked]:text-[var(--foreground)]"
          >
            <input
              type="radio"
              name="movementType"
              value={value}
              defaultChecked={value === "OUT"}
              className="sr-only"
            />
            {label}
          </label>
        ))}
      </div>
    </div>
  );
}

export function DateField() {
  return (
    <label className="space-y-1 text-sm font-medium text-[var(--muted)]">
      Огноо
      <input
        name="date"
        type="date"
        required
        defaultValue={today()}
        className="input-shell h-10 w-full px-3 text-[var(--foreground)]"
      />
    </label>
  );
}

export function NewMaterialFields() {
  return (
    <>
      <label className="space-y-1 text-sm font-medium text-[var(--muted)] xl:col-span-2">
        Шинэ материал
        <input
          name="newMaterialName"
          required
          placeholder="Материалын нэр..."
          className="input-shell h-10 w-full px-3 text-[var(--foreground)]"
        />
      </label>
      <label className="space-y-1 text-sm font-medium text-[var(--muted)]">
        Нэгж
        <select
          name="newMaterialUnit"
          defaultValue="PCS"
          className="input-shell h-10 w-full px-3 text-[var(--foreground)]"
        >
          {unitOptions.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>
    </>
  );
}

export function QuantityField() {
  return (
    <label className="space-y-1 text-sm font-medium text-[var(--muted)]">
      Тоо ширхэг
      <input
        name="quantity"
        type="number"
        min="1"
        required
        className="input-shell h-10 w-full px-3 text-right text-[var(--foreground)]"
      />
    </label>
  );
}

export function UnitPriceField(props: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="space-y-1 text-sm font-medium text-[var(--muted)]">
      Нэгж үнэ
      <input
        name="unitPrice"
        type="number"
        min="0"
        value={props.value}
        onChange={(event) => props.onChange(event.target.value)}
        className="input-shell h-10 w-full px-3 text-right text-[var(--foreground)]"
      />
    </label>
  );
}

export function NoteField() {
  return (
    <label className="space-y-1 text-sm font-medium text-[var(--muted)] xl:col-span-3">
      Тэмдэглэл
      <input
        name="note"
        placeholder="Объект, нөхцөл..."
        className="input-shell h-10 w-full px-3 text-[var(--foreground)]"
      />
    </label>
  );
}
