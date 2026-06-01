"use client";

import { useEffect, useMemo, useState } from "react";
import { SectionHeader } from "@/app/components/menu/section-header";
import { graphqlRequest } from "@/lib/graphql-client";
import {
  accountingParty,
  accountingPartyKey,
  CompanyOption,
  formatMoney,
  lineTotal,
  loadRentalRecords,
  remaining,
  RentalRecord,
} from "@/lib/rental-records";
import { MaterialsTable } from "../materials/materials-table";
import type {
  InventoryMaterial,
  MaterialMovement,
} from "../materials/material-types";
import {
  fallbackMaterials,
  sortMovements,
} from "../materials/material-utils";
import { useInventoryMaterials } from "../materials/use-inventory-materials";

type CustomerSummary = {
  key: string;
  name: string;
  companyId?: string;
  phone?: string;
  email?: string;
  leaseOutRemaining: number;
  leaseInRemaining: number;
  receivable: number;
  payable: number;
  activeRentals: number;
};

const COMPANIES_QUERY = `
  query CustomerCompanies {
    companies {
      id
      name
      phone
      email
    }
  }
`;

function customerMatchesMovement(
  movement: MaterialMovement,
  customer: CustomerSummary,
) {
  const usedBy = movement.usedBy?.trim().toLowerCase() ?? "";
  const notes = movement.notes?.trim().toLowerCase() ?? "";
  const customerName = customer.name.trim().toLowerCase();

  return Boolean(
    usedBy && usedBy === customerName ||
      notes.includes(`"companyId":"${customer.companyId}"`) ||
      notes.includes(customerName),
  );
}

function inventoryForCustomer(
  inventory: InventoryMaterial[],
  customer: CustomerSummary,
) {
  return inventory
    .map((material) => ({
      ...material,
      income: sortMovements(
        material.income.filter((movement) =>
          customerMatchesMovement(movement, customer),
        ),
      ),
      expense: sortMovements(
        material.expense.filter((movement) =>
          customerMatchesMovement(movement, customer),
        ),
      ),
    }))
    .filter(
      (material) => material.income.length > 0 || material.expense.length > 0,
    );
}

function movementsFromRentals(records: RentalRecord[], customer: CustomerSummary) {
  const customerRecords = records.filter(
    (record) => accountingPartyKey(record) === customer.key,
  );
  const byMaterial = new Map<string, InventoryMaterial>();

  for (const record of customerRecords) {
    const materialId = record.material;
    const existing =
      byMaterial.get(materialId) ??
      ({
        id: materialId,
        name: record.material,
        unit: "PCS",
        defaultPrice: record.unitPrice,
        income: [],
        expense: [],
      } satisfies InventoryMaterial);
    const movement: MaterialMovement = {
      id: record.id,
      contractId: null,
      materialId,
      movementType: record.direction === "LEASE_OUT" ? "OUT" : "RETURN",
      movementDate: record.date,
      quantity: record.quantity,
      unit: "PCS",
      unitPrice: record.unitPrice,
      lineTotal: lineTotal(record),
      createdAt: record.date,
      notes: record.note,
      usedBy: accountingParty(record),
      usedAt: record.note,
      registeredBy: record.companyId ? "Веб компани" : "Гараар",
      registeredByEmail: record.companyId,
    };

    if (movement.movementType === "RETURN") {
      existing.income.push(movement);
    } else {
      existing.expense.push(movement);
    }

    byMaterial.set(materialId, existing);
  }

  return [...byMaterial.values()].map((material) => ({
    ...material,
    income: sortMovements(material.income),
    expense: sortMovements(material.expense),
  }));
}

function mergeInventory(
  primary: InventoryMaterial[],
  secondary: InventoryMaterial[],
) {
  const byId = new Map<string, InventoryMaterial>();

  for (const material of [...primary, ...secondary]) {
    const existing = byId.get(material.id);

    if (!existing) {
      byId.set(material.id, material);
      continue;
    }

    byId.set(material.id, {
      ...existing,
      income: sortMovements([...existing.income, ...material.income]),
      expense: sortMovements([...existing.expense, ...material.expense]),
    });
  }

  return [...byId.values()];
}

export default function CustomersPage() {
  const inventory = useInventoryMaterials();
  const [companies, setCompanies] = useState<CompanyOption[]>([]);
  const [records] = useState<RentalRecord[]>(() => loadRentalRecords());
  const [selectedKey, setSelectedKey] = useState("");

  useEffect(() => {
    graphqlRequest<{ companies: CompanyOption[] }>(COMPANIES_QUERY)
      .then((data) => setCompanies(data.companies))
      .catch(() => setCompanies([]));
  }, []);

  const customers = useMemo(() => {
    const summaries = new Map<string, CustomerSummary>();

    for (const company of companies) {
      summaries.set(company.id, {
        key: company.id,
        name: company.name,
        companyId: company.id,
        phone: company.phone,
        email: company.email,
        leaseOutRemaining: 0,
        leaseInRemaining: 0,
        receivable: 0,
        payable: 0,
        activeRentals: 0,
      });
    }

    for (const record of records) {
      const key = accountingPartyKey(record);
      const current =
        summaries.get(key) ??
        ({
          key,
          name: accountingParty(record),
          companyId: record.companyId,
          leaseOutRemaining: 0,
          leaseInRemaining: 0,
          receivable: 0,
          payable: 0,
          activeRentals: 0,
        } satisfies CustomerSummary);

      if (record.direction === "LEASE_OUT") {
        current.leaseOutRemaining += remaining(record);
        current.receivable += lineTotal(record);
      } else {
        current.leaseInRemaining += remaining(record);
        current.payable += lineTotal(record);
      }

      if (remaining(record) > 0) {
        current.activeRentals += 1;
      }

      summaries.set(key, current);
    }

    return [...summaries.values()].sort((a, b) =>
      a.name.localeCompare(b.name, "mn-MN"),
    );
  }, [companies, records]);

  const selectedCustomer = useMemo(
    () => customers.find((customer) => customer.key === selectedKey) ?? customers[0],
    [customers, selectedKey],
  );

  const selectedInventory = useMemo(() => {
    if (!selectedCustomer) {
      return [];
    }

    const sourceInventory = inventory ?? fallbackMaterials();
    const fromMaterials = inventoryForCustomer(sourceInventory, selectedCustomer);
    const fromRentals = movementsFromRentals(records, selectedCustomer);

    return mergeInventory(fromMaterials, fromRentals);
  }, [inventory, records, selectedCustomer]);

  const incomeColumns = useMemo(
    () => sortMovements(selectedInventory.flatMap((material) => material.income)),
    [selectedInventory],
  );
  const expenseColumns = useMemo(
    () => sortMovements(selectedInventory.flatMap((material) => material.expense)),
    [selectedInventory],
  );

  return (
    <>
      <SectionHeader
        title="Харилцагч"
        description="Харилцагч компаниар тооцоо нэгтгэж, дарж ороод материалын хөдөлгөөнийг хүснэгтээр харна."
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(360px,0.9fr)_minmax(0,1.6fr)]">
        <div className="app-card overflow-hidden">
          <div className="border-b border-[var(--line)] px-4 py-3">
            <p className="text-sm font-semibold">Компаниуд</p>
            <p className="mt-1 text-xs text-[var(--muted)]">
              Бүртгэлтэй компани сонгогдвол авлага, өглөг, материал нь нэг дор гарна.
            </p>
          </div>
          <div className="max-h-[calc(100vh-230px)] overflow-auto">
            {customers.map((customer) => (
              <button
                key={customer.key}
                type="button"
                onClick={() => setSelectedKey(customer.key)}
                className={`block w-full border-b border-[var(--line)] px-4 py-3 text-left last:border-b-0 ${
                  selectedCustomer?.key === customer.key
                    ? "bg-[var(--accent-soft)]"
                    : "hover:bg-[var(--surface-muted)]"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{customer.name}</p>
                    <p className="mt-1 text-xs text-[var(--muted)]">
                      {customer.phone || customer.email || "Холбоо барих мэдээлэлгүй"}
                    </p>
                  </div>
                  <span className="soft-chip px-2.5 py-1 text-xs font-semibold">
                    {customer.activeRentals}
                  </span>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="text-[var(--muted)]">Авлага</p>
                    <p className="font-semibold">{formatMoney(customer.receivable)}</p>
                  </div>
                  <div>
                    <p className="text-[var(--muted)]">Өглөг</p>
                    <p className="font-semibold">{formatMoney(customer.payable)}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {selectedCustomer ? (
            <>
              <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <div className="app-card p-4">
                  <p className="text-xs font-semibold uppercase text-[var(--muted)]">Компани</p>
                  <p className="mt-2 text-lg font-semibold">{selectedCustomer.name}</p>
                </div>
                <div className="app-card p-4">
                  <p className="text-xs font-semibold uppercase text-[var(--muted)]">Авлага</p>
                  <p className="mt-2 text-lg font-semibold">{formatMoney(selectedCustomer.receivable)}</p>
                </div>
                <div className="app-card p-4">
                  <p className="text-xs font-semibold uppercase text-[var(--muted)]">Өглөг</p>
                  <p className="mt-2 text-lg font-semibold">{formatMoney(selectedCustomer.payable)}</p>
                </div>
                <div className="app-card p-4">
                  <p className="text-xs font-semibold uppercase text-[var(--muted)]">Цэвэр дүн</p>
                  <p className="mt-2 text-lg font-semibold">
                    {formatMoney(selectedCustomer.receivable - selectedCustomer.payable)}
                  </p>
                </div>
              </section>

              {selectedInventory.length > 0 ? (
                <MaterialsTable
                  inventory={selectedInventory}
                  incomeColumns={incomeColumns}
                  expenseColumns={expenseColumns}
                />
              ) : (
                <div className="app-card p-8 text-center text-sm text-[var(--muted)]">
                  Энэ харилцагч дээр материалын хөдөлгөөн бүртгэгдээгүй байна.
                </div>
              )}
            </>
          ) : (
            <div className="app-card p-8 text-center text-sm text-[var(--muted)]">
              Харилцагч олдсонгүй.
            </div>
          )}
        </div>
      </div>
    </>
  );
}
