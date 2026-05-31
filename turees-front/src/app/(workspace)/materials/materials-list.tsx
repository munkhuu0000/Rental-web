"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Filters } from "./material-types";
import { MaterialsFilters } from "./materials-filters";
import { MaterialMovementForm } from "./material-movement-form";
import { MaterialsPreview } from "./materials-preview";
import { MaterialsTable } from "./materials-table";
import {
  fallbackMaterials,
  movementMatchesFilter,
  sortMovements,
  sumMovements,
} from "./material-utils";
import { useInventoryMaterials } from "./use-inventory-materials";

export { MaterialsPreview };

const emptyFilters: Filters = {
  dateFrom: "",
  dateTo: "",
  usedBy: "",
  usedAt: "",
  registeredBy: "",
  movementType: "",
};

function hasActiveFilter(filters: Filters) {
  return Boolean(
    filters.dateFrom ||
      filters.dateTo ||
      filters.usedBy ||
      filters.usedAt ||
      filters.registeredBy ||
      filters.movementType,
  );
}

function hasVisibleQuantity(material: ReturnType<typeof fallbackMaterials>[number]) {
  return sumMovements(material.income) > 0 || sumMovements(material.expense) > 0;
}

function uniqueSorted(values: Array<string | undefined>) {
  return Array.from(
    new Set(values.map((value) => value?.trim()).filter(Boolean) as string[]),
  ).sort((first, second) => first.localeCompare(second));
}

export function MaterialsList() {
  const materials = useInventoryMaterials();
  const [filters, setFilters] = useState<Filters>(emptyFilters);

  const sourceInventory = useMemo(
    () => materials ?? fallbackMaterials(),
    [materials],
  );

  const usedByOptions = useMemo(
    () =>
      uniqueSorted(
        sourceInventory.flatMap((material) =>
          [...material.income, ...material.expense].map(
            (movement) => movement.usedBy,
          ),
        ),
      ),
    [sourceInventory],
  );

  const usedAtOptions = useMemo(
    () =>
      uniqueSorted(
        sourceInventory.flatMap((material) =>
          [...material.income, ...material.expense].map(
            (movement) => movement.usedAt,
          ),
        ),
      ),
    [sourceInventory],
  );

  const inventory = useMemo(() => {
    const filtered = sourceInventory.map((material) => ({
      ...material,
      income: sortMovements(
        material.income.filter((movement) =>
          movementMatchesFilter(movement, filters),
        ),
      ),
      expense: sortMovements(
        material.expense.filter((movement) =>
          movementMatchesFilter(movement, filters),
        ),
      ),
    }));

    return hasActiveFilter(filters)
      ? filtered.filter(hasVisibleQuantity)
      : filtered;
  }, [filters, sourceInventory]);

  const incomeColumns = useMemo(
    () => sortMovements(inventory.flatMap((material) => material.income)),
    [inventory],
  );
  const expenseColumns = useMemo(
    () => sortMovements(inventory.flatMap((material) => material.expense)),
    [inventory],
  );

  return (
    <div className="space-y-3">
      <MaterialMovementForm
        usedByOptions={usedByOptions}
        usedAtOptions={usedAtOptions}
      />
      <MaterialsFilters
        filters={filters}
        setFilters={setFilters}
        usedByOptions={usedByOptions}
        usedAtOptions={usedAtOptions}
      />
      <MaterialsTable
        inventory={inventory}
        incomeColumns={incomeColumns}
        expenseColumns={expenseColumns}
      />
      <div className="flex justify-end">
        <Link href="/reports" className="action-button px-4">
          Тайлан татах
        </Link>
      </div>
    </div>
  );
}
