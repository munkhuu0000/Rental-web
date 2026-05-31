"use client";

import { FormEvent, useMemo, useState } from "react";
import { SectionHeader } from "@/app/components/menu/section-header";

type RentalDirection = "LEASE_OUT" | "LEASE_IN";

type RentalRecord = {
  id: string;
  direction: RentalDirection;
  date: string;
  party: string;
  material: string;
  quantity: number;
  returned: number;
  unitPrice: number;
  durationDays: number;
  note: string;
};

type RentalFilters = {
  dateFrom: string;
  dateTo: string;
  direction: string;
  party: string;
  material: string;
};

const initialRentals: RentalRecord[] = [
  {
    id: "rental-1",
    direction: "LEASE_OUT",
    date: "2026-05-22",
    party: "Эрдэнэт Барилга ХХК",
    material: "Хэв хашмал",
    quantity: 240,
    returned: 120,
    unitPrice: 1200,
    durationDays: 14,
    note: "А блок",
  },
  {
    id: "rental-2",
    direction: "LEASE_OUT",
    date: "2026-05-20",
    party: "Алтан Гэр ХХК",
    material: "Тулаас",
    quantity: 500,
    returned: 40,
    unitPrice: 900,
    durationDays: 20,
    note: "Суурийн ажил",
  },
  {
    id: "rental-3",
    direction: "LEASE_IN",
    date: "2026-05-19",
    party: "Хан Констракшн",
    material: "Шат",
    quantity: 18,
    returned: 6,
    unitPrice: 1500,
    durationDays: 10,
    note: "Дотоод хэрэгцээ",
  },
];

const emptyFilters: RentalFilters = {
  dateFrom: "",
  dateTo: "",
  direction: "",
  party: "",
  material: "",
};

function directionLabel(direction: RentalDirection) {
  return direction === "LEASE_OUT" ? "Түрээслүүлэх" : "Түрээслэх";
}

function formatMoney(value: number) {
  return `${value.toLocaleString()} ₮`;
}

function uniqueOptions(values: string[]) {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b, "mn-MN"),
  );
}

function remaining(record: RentalRecord) {
  return Math.max(record.quantity - record.returned, 0);
}

function lineTotal(record: RentalRecord) {
  return record.quantity * record.unitPrice * Math.max(record.durationDays, 1);
}

function matchesFilters(record: RentalRecord, filters: RentalFilters) {
  if (filters.dateFrom && record.date < filters.dateFrom) {
    return false;
  }

  if (filters.dateTo && record.date > filters.dateTo) {
    return false;
  }

  if (filters.direction && record.direction !== filters.direction) {
    return false;
  }

  if (filters.party && record.party !== filters.party) {
    return false;
  }

  if (filters.material && record.material !== filters.material) {
    return false;
  }

  return true;
}

export default function RentalsPage() {
  const [records, setRecords] = useState<RentalRecord[]>(initialRentals);
  const [direction, setDirection] = useState<RentalDirection>("LEASE_OUT");
  const [filters, setFilters] = useState<RentalFilters>(emptyFilters);

  const partyOptions = useMemo(
    () => uniqueOptions(records.map((record) => record.party)),
    [records],
  );
  const materialOptions = useMemo(
    () => uniqueOptions(records.map((record) => record.material)),
    [records],
  );
  const filteredRecords = useMemo(
    () =>
      records
        .filter((record) => matchesFilters(record, filters))
        .sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id)),
    [filters, records],
  );

  const leaseOutRemaining = records
    .filter((record) => record.direction === "LEASE_OUT")
    .reduce((total, record) => total + remaining(record), 0);
  const leaseInRemaining = records
    .filter((record) => record.direction === "LEASE_IN")
    .reduce((total, record) => total + remaining(record), 0);
  const totalReceivable = records
    .filter((record) => record.direction === "LEASE_OUT")
    .reduce((total, record) => total + lineTotal(record), 0);
  const totalPayable = records
    .filter((record) => record.direction === "LEASE_IN")
    .reduce((total, record) => total + lineTotal(record), 0);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = new FormData(event.currentTarget);
    const quantity = Number(form.get("quantity") || 0);
    const returned = Number(form.get("returned") || 0);
    const unitPrice = Number(form.get("unitPrice") || 0);
    const durationDays = Number(form.get("durationDays") || 1);
    const party = String(form.get("party") || "").trim();
    const material = String(form.get("material") || "").trim();
    const date = String(form.get("date") || "").trim();

    if (!party || !material || !date || quantity <= 0) {
      return;
    }

    setRecords((current) => [
      {
        id: `rental-${Date.now()}`,
        direction,
        date,
        party,
        material,
        quantity,
        returned: Math.max(0, Math.min(returned, quantity)),
        unitPrice: Math.max(0, unitPrice),
        durationDays: Math.max(1, durationDays),
        note: String(form.get("note") || "").trim(),
      },
      ...current,
    ]);

    event.currentTarget.reset();
  }

  return (
    <>
      <SectionHeader
        title="Түрээс"
        description="Түрээслүүлэх болон түрээслэх бүртгэлийг нэг дор оруулж, үлдэгдэл болон дүнг хянана."
      />

      <section className="mb-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <div className="app-card p-4">
          <p className="text-xs font-semibold uppercase text-[var(--muted)]">Түрээслүүлсэн үлдэгдэл</p>
          <p className="mt-2 text-2xl font-semibold">{leaseOutRemaining.toLocaleString()}</p>
        </div>
        <div className="app-card p-4">
          <p className="text-xs font-semibold uppercase text-[var(--muted)]">Түрээсэлсэн үлдэгдэл</p>
          <p className="mt-2 text-2xl font-semibold">{leaseInRemaining.toLocaleString()}</p>
        </div>
        <div className="app-card p-4">
          <p className="text-xs font-semibold uppercase text-[var(--muted)]">Авлагын дүн</p>
          <p className="mt-2 text-2xl font-semibold">{formatMoney(totalReceivable)}</p>
        </div>
        <div className="app-card p-4">
          <p className="text-xs font-semibold uppercase text-[var(--muted)]">Өглөгийн дүн</p>
          <p className="mt-2 text-2xl font-semibold">{formatMoney(totalPayable)}</p>
        </div>
      </section>

      <form onSubmit={handleSubmit} className="app-card mb-4 border-l-4 border-[var(--accent)] p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-sm font-semibold">Шинэ түрээс бүртгэх</p>
            <p className="text-xs text-[var(--muted)]">Түрээслүүлэх эсвэл түрээслэх хөдөлгөөн нэмнэ.</p>
          </div>
          <div className="grid grid-cols-2 rounded-md border border-[var(--line)] bg-[var(--surface-muted)] p-1">
            {(["LEASE_OUT", "LEASE_IN"] as RentalDirection[]).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setDirection(item)}
                className={`rounded px-3 py-1.5 text-sm font-semibold ${
                  direction === item
                    ? "bg-[var(--accent)] text-white shadow-sm"
                    : "text-[var(--muted)] hover:text-[var(--foreground)]"
                }`}
              >
                {directionLabel(item)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-8">
          <label className="space-y-1 text-sm font-medium text-[var(--muted)] xl:col-span-1">
            Огноо
            <input name="date" type="date" required className="input-shell h-10 w-full px-3 text-[var(--foreground)]" />
          </label>
          <label className="space-y-1 text-sm font-medium text-[var(--muted)] xl:col-span-2">
            Харилцагч
            <input
              name="party"
              list="rental-party-options"
              required
              placeholder={direction === "LEASE_OUT" ? "Түрээслэгч..." : "Нийлүүлэгч..."}
              className="input-shell h-10 w-full px-3 text-[var(--foreground)]"
            />
          </label>
          <label className="space-y-1 text-sm font-medium text-[var(--muted)] xl:col-span-2">
            Материал
            <input
              name="material"
              list="rental-material-options"
              required
              placeholder="Материал..."
              className="input-shell h-10 w-full px-3 text-[var(--foreground)]"
            />
          </label>
          <label className="space-y-1 text-sm font-medium text-[var(--muted)]">
            Тоо
            <input name="quantity" type="number" min="1" required className="input-shell h-10 w-full px-3 text-right text-[var(--foreground)]" />
          </label>
          <label className="space-y-1 text-sm font-medium text-[var(--muted)]">
            Буцаасан
            <input name="returned" type="number" min="0" defaultValue="0" className="input-shell h-10 w-full px-3 text-right text-[var(--foreground)]" />
          </label>
          <label className="space-y-1 text-sm font-medium text-[var(--muted)]">
            Өдөр
            <input name="durationDays" type="number" min="1" defaultValue="1" className="input-shell h-10 w-full px-3 text-right text-[var(--foreground)]" />
          </label>
          <label className="space-y-1 text-sm font-medium text-[var(--muted)]">
            Нэгж үнэ
            <input name="unitPrice" type="number" min="0" defaultValue="0" className="input-shell h-10 w-full px-3 text-right text-[var(--foreground)]" />
          </label>
          <label className="space-y-1 text-sm font-medium text-[var(--muted)] xl:col-span-3">
            Тэмдэглэл
            <input name="note" placeholder="Объект, нөхцөл..." className="input-shell h-10 w-full px-3 text-[var(--foreground)]" />
          </label>
          <div className="flex items-end xl:col-span-1">
            <button type="submit" className="action-button h-10 w-full justify-center px-4">
              Бүртгэх
            </button>
          </div>
        </div>
        <datalist id="rental-party-options">
          {partyOptions.map((party) => (
            <option key={party} value={party} />
          ))}
        </datalist>
        <datalist id="rental-material-options">
          {materialOptions.map((material) => (
            <option key={material} value={material} />
          ))}
        </datalist>
      </form>

      <div className="app-card mb-4 p-4">
        <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-6">
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(event) => setFilters((current) => ({ ...current, dateFrom: event.target.value }))}
            className="input-shell h-10 px-3 text-[var(--foreground)]"
            aria-label="Эхлэх огноо"
          />
          <input
            type="date"
            value={filters.dateTo}
            onChange={(event) => setFilters((current) => ({ ...current, dateTo: event.target.value }))}
            className="input-shell h-10 px-3 text-[var(--foreground)]"
            aria-label="Дуусах огноо"
          />
          <select
            value={filters.direction}
            onChange={(event) => setFilters((current) => ({ ...current, direction: event.target.value }))}
            className="input-shell h-10 px-3 text-[var(--foreground)]"
            aria-label="Төрөл"
          >
            <option value="">Төрөл: Бүгд</option>
            <option value="LEASE_OUT">Түрээслүүлэх</option>
            <option value="LEASE_IN">Түрээслэх</option>
          </select>
          <select
            value={filters.party}
            onChange={(event) => setFilters((current) => ({ ...current, party: event.target.value }))}
            className="input-shell h-10 px-3 text-[var(--foreground)]"
            aria-label="Харилцагч"
          >
            <option value="">Харилцагч: Бүгд</option>
            {partyOptions.map((party) => (
              <option key={party} value={party}>
                {party}
              </option>
            ))}
          </select>
          <select
            value={filters.material}
            onChange={(event) => setFilters((current) => ({ ...current, material: event.target.value }))}
            className="input-shell h-10 px-3 text-[var(--foreground)]"
            aria-label="Материал"
          >
            <option value="">Материал: Бүгд</option>
            {materialOptions.map((material) => (
              <option key={material} value={material}>
                {material}
              </option>
            ))}
          </select>
          <button type="button" onClick={() => setFilters(emptyFilters)} className="soft-chip h-10 justify-center px-4 font-medium">
            Цэвэрлэх
          </button>
        </div>
      </div>

      <div className="app-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="font-data min-w-[1180px] border-collapse">
            <thead>
              <tr className="border-b border-[var(--line)] bg-[var(--surface-muted)] text-left">
                {["Огноо", "Төрөл", "Харилцагч", "Материал", "Тоо", "Буцаасан", "Үлдэгдэл", "Өдөр", "Нэгж үнэ", "Дүн", "Тэмдэглэл"].map(
                  (header) => (
                    <th key={header} className="px-3 py-2.5 text-[0.72rem] font-semibold uppercase tracking-[0.04em] text-[var(--muted)]">
                      {header}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((record) => (
                <tr key={record.id} className="border-b border-[var(--line)] last:border-b-0">
                  <td className="px-3 py-3 text-[0.82rem]">{record.date}</td>
                  <td className="px-3 py-3 text-[0.82rem]">
                    <span
                      className={`soft-chip px-2.5 py-1 text-xs font-semibold ${
                        record.direction === "LEASE_OUT"
                          ? "text-[var(--accent-strong)]"
                          : "text-[var(--warning)]"
                      }`}
                    >
                      {directionLabel(record.direction)}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-[0.82rem] font-medium">{record.party}</td>
                  <td className="px-3 py-3 text-[0.82rem]">{record.material}</td>
                  <td className="px-3 py-3 text-right text-[0.82rem]">{record.quantity.toLocaleString()}</td>
                  <td className="px-3 py-3 text-right text-[0.82rem]">{record.returned.toLocaleString()}</td>
                  <td className="px-3 py-3 text-right text-[0.82rem] font-semibold">{remaining(record).toLocaleString()}</td>
                  <td className="px-3 py-3 text-right text-[0.82rem]">{record.durationDays.toLocaleString()}</td>
                  <td className="px-3 py-3 text-right text-[0.82rem]">{formatMoney(record.unitPrice)}</td>
                  <td className="px-3 py-3 text-right text-[0.82rem] font-semibold">{formatMoney(lineTotal(record))}</td>
                  <td className="px-3 py-3 text-[0.82rem] text-[var(--muted)]">{record.note || "-"}</td>
                </tr>
              ))}
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={11} className="px-3 py-8 text-center text-sm text-[var(--muted)]">
                    Сонгосон нөхцөлд тохирох түрээсийн бүртгэл олдсонгүй.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
