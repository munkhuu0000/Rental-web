"use client";

import { MaterialActionButton } from "./material-action-button";
import type { InventoryMaterial } from "./material-types";
import { fallbackMaterials, sumMovements, unitLabel } from "./material-utils";
import { useInventoryMaterials } from "./use-inventory-materials";

function MaterialSummaryCard({ material }: { material: InventoryMaterial }) {
  const incomeTotal = sumMovements(material.income);
  const expenseTotal = sumMovements(material.expense);
  const balance = incomeTotal - expenseTotal;

  return (
    <article className="app-card flex min-h-30 flex-col justify-between p-5">
      <div>
        <p className="text-sm font-medium text-[var(--muted)]">
          {unitLabel(material.unit)}
        </p>
        <h2 className="mt-1 text-lg font-semibold">{material.name}</h2>
      </div>
      <div className="mt-4 flex items-end justify-between gap-3">
        <p className="font-data text-3xl font-semibold">
          {balance.toLocaleString()}
        </p>
        <span className="soft-chip px-3 py-1 text-sm">үлдэгдэл</span>
      </div>
    </article>
  );
}

export function MaterialsPreview() {
  const materials = useInventoryMaterials();
  const visibleMaterials = (materials ?? fallbackMaterials()).slice(0, 10);

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {visibleMaterials.map((material) => (
          <MaterialSummaryCard key={material.id} material={material} />
        ))}
      </div>

      <div className="flex justify-end">
        <MaterialActionButton
          href="/materials-table"
          label="Дэлгэрэнгүй харах"
          icon="arrowRight"
        />
      </div>
    </div>
  );
}
