"use client";

import type { Dispatch, SetStateAction } from "react";
import type { Filters } from "./material-types";

type MaterialsFiltersProps = {
  filters: Filters;
  setFilters: Dispatch<SetStateAction<Filters>>;
  usedByOptions: string[];
  usedAtOptions: string[];
};

function updateFilter(
  setFilters: Dispatch<SetStateAction<Filters>>,
  name: keyof Filters,
  value: string,
) {
  setFilters((current) => ({ ...current, [name]: value }));
}

export function MaterialsFilters({
  filters,
  setFilters,
  usedByOptions,
  usedAtOptions,
}: MaterialsFiltersProps) {
  return (
    <div className="app-card p-3">
      <div className="flex flex-col gap-2 xl:flex-row xl:items-center">
        <div className="flex h-9 items-center gap-2 rounded-md bg-[var(--surface)] pr-2 text-[0.78rem] font-semibold text-[var(--foreground)]">
          <span className="flex h-9 w-9 items-center justify-center text-[var(--muted)]">
            Filter
          </span>
          Шүүлтүүр
        </div>

        <div className="grid flex-1 gap-2 md:grid-cols-2 lg:grid-cols-5 xl:grid-cols-[1fr_1fr_0.95fr_1.25fr_1.25fr]">
          <label className="input-shell h-9">
            <input
              type="date"
              value={filters.dateFrom}
              aria-label="Эхлэх огноо"
              onChange={(event) =>
                updateFilter(setFilters, "dateFrom", event.target.value)
              }
            />
          </label>

          <label className="input-shell h-9">
            <input
              type="date"
              value={filters.dateTo}
              aria-label="Дуусах огноо"
              onChange={(event) =>
                updateFilter(setFilters, "dateTo", event.target.value)
              }
            />
          </label>

          <select
            value={filters.movementType}
            onChange={(event) =>
              updateFilter(setFilters, "movementType", event.target.value)
            }
            aria-label="Төрөл"
            className="input-shell h-9 w-full text-[var(--foreground)]"
          >
            <option value="">Төрөл: Бүгд</option>
            <option value="RETURN">Орлого</option>
            <option value="OUT">Зарлага</option>
          </select>

          <select
            value={filters.usedBy}
            onChange={(event) =>
              updateFilter(setFilters, "usedBy", event.target.value)
            }
            aria-label="Хүлээн авсан хүн"
            className="input-shell h-9 w-full text-[var(--foreground)]"
          >
            <option value="">Хүлээн авсан хүн: Бүгд</option>
            {usedByOptions.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>

          <select
            value={filters.usedAt}
            onChange={(event) =>
              updateFilter(setFilters, "usedAt", event.target.value)
            }
            aria-label="Хаана ашигласан"
            className="input-shell h-9 w-full text-[var(--foreground)]"
          >
            <option value="">Хаана ашигласан: Бүгд</option>
            {usedAtOptions.map((place) => (
              <option key={place} value={place}>
                {place}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={() =>
            setFilters({
              dateFrom: "",
              dateTo: "",
              movementType: "",
              usedBy: "",
              usedAt: "",
              registeredBy: "",
            })
          }
          className="h-9 self-end rounded-md px-3 text-[0.75rem] font-semibold text-[var(--muted)] transition-colors hover:bg-[var(--surface-muted)] hover:text-[var(--foreground)] xl:self-auto"
        >
          Цэвэрлэх
        </button>
      </div>
    </div>
  );
}
