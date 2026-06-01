"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { SectionHeader } from "@/app/components/menu/section-header";
import { graphqlRequest } from "@/lib/graphql-client";
import {
  accountingParty,
  accountingPartyKey,
  CompanyOption,
  directionLabel,
  emptyRentalFilters,
  formatMoney,
  loadRentalCompanies,
  lineTotal,
  loadRentalRecords,
  matchesRentalFilters,
  remaining,
  RentalDirection,
  RentalFilters,
  RentalRecord,
  saveRentalCompanies,
  saveRentalRecords,
} from "@/lib/rental-records";
import { defaultRentalMaterials, mergeRentalMaterials } from "./[customerKey]/default-rental-materials";
import {
  loadHiddenMaterialIds,
  MaterialOption as SharedMaterialOption,
  saveHiddenMaterialIds,
} from "./[customerKey]/rental-detail-utils";
import { MaterialFilterPicker } from "./material-filter-picker";

type MaterialOption = {
  id: string;
  name: string;
  unit: string;
  defaultPrice: number;
};

type BackendContract = {
  id: string;
  renterCompany?: CompanyOption | null;
  ownerCompany?: CompanyOption | null;
};

type BackendUsage = {
  id: string;
  contractId?: string | null;
  materialId: string;
  material?: MaterialOption | null;
  movementType: "OUT" | "RETURN";
  movementDate: string;
  quantity: number;
  unitPrice: number;
  usageDays: number;
  lineTotal: number;
  notes?: string | null;
};

type RentalPageData = {
  companies: CompanyOption[];
  materials: MaterialOption[];
  masterContracts: BackendContract[];
  rentalUsages: BackendUsage[];
};

type PartySummary = {
  key: string;
  name: string;
  companyId?: string;
  leaseOutRemaining: number;
  leaseInRemaining: number;
  receivable: number;
  payable: number;
  activeCount: number;
};

const RENTAL_PAGE_QUERY = `
  query RentalPageData {
    companies {
      id
      name
      registerNumber
      phone
      email
    }
    materials {
      id
      name
      unit
      defaultPrice
    }
    masterContracts {
      id
      renterCompany {
        id
        name
        registerNumber
        phone
        email
      }
      ownerCompany {
        id
        name
        registerNumber
        phone
        email
      }
    }
    rentalUsages {
      id
      contractId
      materialId
      material {
        id
        name
        unit
        defaultPrice
      }
      movementType
      movementDate
      quantity
      unitPrice
      usageDays
      lineTotal
      notes
    }
  }
`;

function detailHref(key: string, direction: RentalDirection) {
  return `/rentals/${encodeURIComponent(key)}?direction=${direction}`;
}

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

function backendRecord(
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

  return {
    id: `backend-${usage.id}`,
    direction: usage.movementType === "OUT" ? "LEASE_OUT" : "LEASE_IN",
    date: usage.movementDate,
    party: notes.party || notes.usedBy || companyName,
    companyId,
    companyName,
    material: usage.material?.name || usage.materialId,
    movementType: usage.movementType,
    quantity: usage.quantity,
    returned: 0,
    unitPrice: usage.unitPrice,
    durationDays: usage.usageDays || 1,
    note: notes.note || notes.usedAt || "",
  };
}

function backendRecords(data: RentalPageData) {
  const contractById = new Map(
    data.masterContracts.map((contract) => [contract.id, contract]),
  );

  return data.rentalUsages.map((usage) => backendRecord(usage, contractById));
}

export default function RentalsPage() {
  const [localRecords] = useState<RentalRecord[]>(() => loadRentalRecords());
  const [localCompanies, setLocalCompanies] = useState<CompanyOption[]>(() =>
    loadRentalCompanies(),
  );
  const [backendData, setBackendData] = useState<RentalPageData>({
    companies: [],
    materials: [],
    masterContracts: [],
    rentalUsages: [],
  });
  const [direction, setDirection] = useState<RentalDirection>("LEASE_OUT");
  const [filters, setFilters] = useState<RentalFilters>(emptyRentalFilters);
  const [hiddenMaterialIds, setHiddenMaterialIds] = useState<string[]>(() =>
    loadHiddenMaterialIds(),
  );
  const [error, setError] = useState("");

  useEffect(() => {
    saveRentalRecords(localRecords);
  }, [localRecords]);

  useEffect(() => {
    saveRentalCompanies(localCompanies);
  }, [localCompanies]);

  useEffect(() => {
    saveHiddenMaterialIds(hiddenMaterialIds);
  }, [hiddenMaterialIds]);

  useEffect(() => {
    graphqlRequest<RentalPageData>(RENTAL_PAGE_QUERY)
      .then((data) => setBackendData(data))
      .catch((reason: Error) => setError(reason.message));
  }, []);

  const records = useMemo(
    () => [...backendRecords(backendData), ...localRecords],
    [backendData, localRecords],
  );
  const companies = useMemo(() => {
    const byId = new Map<string, CompanyOption>();

    for (const company of backendData.companies) {
      byId.set(company.id, company);
    }

    for (const company of localCompanies) {
      byId.set(company.id, company);
    }

    return [...byId.values()].sort((a, b) =>
      a.name.localeCompare(b.name, "mn-MN"),
    );
  }, [backendData.companies, localCompanies]);
  const selectedDirectionRecords = useMemo(
    () => records.filter((record) => record.direction === direction),
    [direction, records],
  );
  const effectiveFilters = useMemo(
    () => ({ ...filters, direction }),
    [direction, filters],
  );

  const materialOptions = useMemo(() => {
    const recordMaterials: SharedMaterialOption[] = selectedDirectionRecords.map(
      (record) => ({
        id: `record-material-${record.material}`,
        name: record.material,
        unit: "PCS",
        defaultPrice: record.unitPrice,
      }),
    );

    return mergeRentalMaterials([
      ...defaultRentalMaterials,
      ...backendData.materials,
      ...recordMaterials,
    ]).filter((material) => !hiddenMaterialIds.includes(material.id));
  }, [backendData.materials, hiddenMaterialIds, selectedDirectionRecords]);

  const partyOptions = useMemo(() => {
    const options = new Map<string, string>();

    for (const company of companies) {
      options.set(company.id, company.name);
    }

    for (const record of selectedDirectionRecords) {
      options.set(accountingPartyKey(record), accountingParty(record));
    }

    return [...options.entries()]
      .map(([key, name]) => ({ key, name }))
      .sort((a, b) => a.name.localeCompare(b.name, "mn-MN"));
  }, [companies, selectedDirectionRecords]);

  const filteredRecords = useMemo(
    () =>
      selectedDirectionRecords
        .filter((record) => matchesRentalFilters(record, effectiveFilters))
        .sort(
          (a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id),
        ),
    [effectiveFilters, selectedDirectionRecords],
  );

  const partySummaries = useMemo(() => {
    const summaries = new Map<string, PartySummary>();

    for (const company of companies) {
      summaries.set(company.id, {
        key: company.id,
        name: company.name,
        companyId: company.id,
        leaseOutRemaining: 0,
        leaseInRemaining: 0,
        receivable: 0,
        payable: 0,
        activeCount: 0,
      });
    }

    for (const record of filteredRecords) {
      const key = accountingPartyKey(record);
      const summary =
        summaries.get(key) ??
        ({
          key,
          name: accountingParty(record),
          companyId: record.companyId,
          leaseOutRemaining: 0,
          leaseInRemaining: 0,
          receivable: 0,
          payable: 0,
          activeCount: 0,
        } satisfies PartySummary);

      if (record.direction === "LEASE_OUT") {
        summary.leaseOutRemaining += remaining(record);
        summary.receivable += lineTotal(record);
      } else {
        summary.leaseInRemaining += remaining(record);
        summary.payable += lineTotal(record);
      }

      if (remaining(record) > 0) {
        summary.activeCount += 1;
      }

      summaries.set(key, summary);
    }

    return [...summaries.values()].sort((a, b) =>
      a.name.localeCompare(b.name, "mn-MN"),
    );
  }, [companies, filteredRecords]);

  const visibleQuantity = selectedDirectionRecords.reduce(
    (total, record) => total + remaining(record),
    0,
  );
  const visibleAmount = selectedDirectionRecords.reduce(
    (total, record) => total + lineTotal(record),
    0,
  );
  const visibleCompanyCount = new Set(
    selectedDirectionRecords.map((record) => accountingPartyKey(record)),
  ).size;
  const visibleActiveCount = partySummaries.filter((summary) =>
    direction === "LEASE_OUT"
      ? summary.leaseOutRemaining > 0 || summary.receivable > 0
      : summary.leaseInRemaining > 0 || summary.payable > 0,
  ).length;

  function handleCustomerSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = new FormData(event.currentTarget);
    const name = String(form.get("customerName") || "").trim();
    const registerNumber = String(form.get("registerNumber") || "").trim();

    if (!name) {
      return;
    }

    const duplicateRegistered = companies.some(
      (company) => company.name.trim().toLowerCase() === name.toLowerCase(),
    );

    if (duplicateRegistered) {
      event.currentTarget.reset();
      return;
    }

    setLocalCompanies((current) => {
      const duplicate = current.some(
        (company) => company.name.trim().toLowerCase() === name.toLowerCase(),
      );

      if (duplicate) {
        return current;
      }

      return [
        ...current,
        {
          id: `local-company-${Date.now()}`,
          name,
          registerNumber,
        },
      ];
    });

    event.currentTarget.reset();
  }

  function hideFilterMaterial(materialId: string, materialName: string) {
    setHiddenMaterialIds((current) =>
      current.includes(materialId) ? current : [...current, materialId],
    );

    if (filters.material === materialName) {
      setFilters((current) => ({ ...current, material: "" }));
    }
  }

  return (
    <>
      <SectionHeader title="Түрээс" />
      <section className="app-card mb-4 p-4">
        <div className="grid max-w-md grid-cols-2 rounded-md border border-[var(--line)] bg-[var(--surface-muted)] p-1">
          {(["LEASE_OUT", "LEASE_IN"] as RentalDirection[]).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => {
                setDirection(item);
                setFilters(emptyRentalFilters);
              }}
              className={`rounded px-3 py-2 text-sm font-semibold ${
                direction === item
                  ? "bg-[var(--accent)] text-white shadow-sm"
                  : "text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              {directionLabel(item)}
            </button>
          ))}
        </div>
      </section>

      <section className="mb-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <div className="app-card p-4">
          <p className="text-xs font-semibold uppercase text-[var(--muted)]">
            {direction === "LEASE_OUT"
              ? "Түрээслүүлсэн материал"
              : "Түрээсэлсэн материал"}
          </p>
          <p className="mt-2 text-2xl font-semibold">
            {visibleQuantity.toLocaleString()} ш
          </p>
        </div>
        <div className="app-card p-4">
          <p className="text-xs font-semibold uppercase text-[var(--muted)]">
            Харилцагч компани
          </p>
          <p className="mt-2 text-2xl font-semibold">
            {visibleCompanyCount.toLocaleString()}
          </p>
        </div>
        <div className="app-card p-4">
          <p className="text-xs font-semibold uppercase text-[var(--muted)]">
            Идэвхтэй бүртгэл
          </p>
          <p className="mt-2 text-2xl font-semibold">
            {visibleActiveCount.toLocaleString()}
          </p>
        </div>
        <div className="app-card p-4">
          <p className="text-xs font-semibold uppercase text-[var(--muted)]">
            {direction === "LEASE_OUT" ? "Авлага" : "Өглөг"}
          </p>
          <p className="mt-2 text-2xl font-semibold">
            {formatMoney(visibleAmount)}
          </p>
        </div>
      </section>

      <section className="app-card mb-4 border-l-4 border-[var(--accent)] p-4">
        <div className="mb-3">
          <p className="text-sm font-semibold">Шинэ бүртгэл</p>
        </div>

        <form
          onSubmit={handleCustomerSubmit}
          className="mb-4 rounded-md border border-[var(--line)] bg-[var(--surface-muted)] p-3"
        >
          <p className="mb-3 text-sm font-semibold"></p>
          <div className="grid gap-3 md:grid-cols-[1.6fr_1fr_auto]">
            <label className="space-y-1 text-sm font-medium text-[var(--muted)]">
              Харилцагч компанийн нэр
              <input
                name="customerName"
                required
                placeholder="Компанийн нэр..."
                className="input-shell h-10 w-full px-3 text-[var(--foreground)]"
              />
            </label>
            <label className="space-y-1 text-sm font-medium text-[var(--muted)]">
              Регистр
              <input
                name="registerNumber"
                placeholder="Заавал биш"
                className="input-shell h-10 w-full px-3 text-[var(--foreground)]"
              />
            </label>
            <div className="flex items-end">
              <button
                type="submit"
                className="action-button h-10 w-full justify-center px-4"
              >
                Бүртгэх
              </button>
            </div>
          </div>
        </form>

        {error ? (
          <p className="mt-3 text-sm text-[var(--danger)]">
            Backend мэдээлэл уншихад алдаа гарлаа: {error}
          </p>
        ) : null}
      </section>

      <section className="app-card mb-4 p-4">
        <p className="mb-3 text-sm font-semibold">Шүүлтүүр</p>
        <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-5">
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(event) =>
              setFilters((current) => ({
                ...current,
                dateFrom: event.target.value,
              }))
            }
            className="input-shell h-10 px-3 text-[var(--foreground)]"
            aria-label="Эхлэх огноо"
          />
          <input
            type="date"
            value={filters.dateTo}
            onChange={(event) =>
              setFilters((current) => ({
                ...current,
                dateTo: event.target.value,
              }))
            }
            className="input-shell h-10 px-3 text-[var(--foreground)]"
            aria-label="Дуусах огноо"
          />
          <select
            value={filters.party}
            onChange={(event) =>
              setFilters((current) => ({
                ...current,
                party: event.target.value,
              }))
            }
            className="input-shell h-10 px-3 text-[var(--foreground)]"
            aria-label="Харилцагч"
          >
            <option value="">Харилцагч: Бүгд</option>
            {partyOptions.map((party) => (
              <option key={party.key} value={party.key}>
                {party.name}
              </option>
            ))}
          </select>
          <MaterialFilterPicker
            materials={materialOptions}
            value={filters.material}
            onChange={(material) =>
              setFilters((current) => ({ ...current, material }))
            }
            onHide={hideFilterMaterial}
          />
          <button
            type="button"
            onClick={() => setFilters(emptyRentalFilters)}
            className="soft-chip h-10 justify-center px-4 font-medium"
          >
            Цэвэрлэх
          </button>
        </div>
      </section>

      <section className="app-card overflow-hidden">
        <div className="border-b border-[var(--line)] px-4 py-3">
          <p className="text-sm font-semibold">Харилцагч компаниуд</p>
        </div>
        <div className="overflow-x-auto">
          <table className="font-data min-w-[900px] border-collapse">
            <thead>
              <tr className="border-b border-[var(--line)] bg-[var(--surface-muted)] text-left">
                {[
                  "Компани",
                  "Төлөв",
                  "Идэвхтэй",
                  "Материал",
                  direction === "LEASE_OUT" ? "Авлага" : "Өглөг",
                ].map((header) => (
                  <th
                    key={header}
                    className="px-3 py-2.5 text-[0.72rem] font-semibold uppercase tracking-[0.04em] text-[var(--muted)]"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {partySummaries.map((summary) => (
                <tr
                  key={summary.key}
                  className="border-b border-[var(--line)] last:border-b-0 hover:bg-[var(--surface-muted)]"
                >
                  <td className="px-3 py-3 text-[0.82rem] font-semibold">
                    <Link
                      href={detailHref(summary.key, direction)}
                      className="text-[var(--accent-strong)] hover:underline"
                    >
                      {summary.name}
                    </Link>
                  </td>
                  <td className="px-3 py-3 text-[0.82rem] text-[var(--muted)]">
                    {summary.companyId ? "Бүртгэлтэй" : "Гараар"}
                  </td>
                  <td className="px-3 py-3 text-right text-[0.82rem]">
                    {summary.activeCount.toLocaleString()}
                  </td>
                  <td className="px-3 py-3 text-right text-[0.82rem]">
                    {(direction === "LEASE_OUT"
                      ? summary.leaseOutRemaining
                      : summary.leaseInRemaining
                    ).toLocaleString()}
                  </td>
                  <td className="px-3 py-3 text-right text-[0.82rem] font-semibold">
                    {formatMoney(
                      direction === "LEASE_OUT"
                        ? summary.receivable
                        : summary.payable,
                    )}
                  </td>
                </tr>
              ))}
              {partySummaries.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-3 py-8 text-center text-sm text-[var(--muted)]"
                  >
                    Сонгосон төрөл, шүүлтүүрт тохирох компани олдсонгүй.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
