"use client";

import { useMemo, useState } from "react";
import { SectionHeader } from "@/app/components/menu/section-header";
import { useCurrentRegisteredUser } from "@/lib/use-current-registered-user";
import type {
  InventoryMaterial,
  MaterialMovement,
} from "../materials/material-types";
import { useInventoryMaterials } from "../materials/use-inventory-materials";
import {
  fallbackMaterials,
  formatMoney,
  movementMatchesFilter,
  unitLabel,
} from "../materials/material-utils";

type ReportKind = "materials" | "rentals";

type MaterialReportFilters = {
  dateFrom: string;
  dateTo: string;
  materialId: string;
  usedBy: string;
  usedAt: string;
  movementType: string;
  registeredBy: string;
};

type MaterialReportRow = MaterialMovement & {
  materialName: string;
  defaultPrice: number;
  remainingQuantity: number;
};

type MaterialReportTotals = {
  incomeQuantityTotal: number;
  expenseQuantityTotal: number;
  remainingQuantityTotal: number;
  incomeTotal: number;
  expenseTotal: number;
};

const emptyMaterialFilters: MaterialReportFilters = {
  dateFrom: "",
  dateTo: "",
  materialId: "",
  usedBy: "",
  usedAt: "",
  movementType: "",
  registeredBy: "",
};

function sortMovements(movements: MaterialMovement[]) {
  return [...movements].sort((a, b) => {
    const dateCompare = a.movementDate.localeCompare(b.movementDate);
    return dateCompare === 0 ? a.id.localeCompare(b.id) : dateCompare;
  });
}

function toReportRows(
  materials: InventoryMaterial[],
  filters: MaterialReportFilters,
) {
  const rows = materials.flatMap<MaterialReportRow>((material) => {
    if (filters.materialId && material.id !== filters.materialId) {
      return [];
    }

    let remainingQuantity = 0;

    return sortMovements([...material.income, ...material.expense])
      .map((movement) => {
        remainingQuantity +=
          movement.movementType === "RETURN"
            ? movement.quantity
            : -movement.quantity;

        return {
          ...movement,
          materialName: material.name,
          defaultPrice: material.defaultPrice,
          remainingQuantity,
        };
      })
      .filter((movement) =>
        movementMatchesFilter(movement, {
          dateFrom: filters.dateFrom,
          dateTo: filters.dateTo,
          usedBy: filters.usedBy,
          usedAt: filters.usedAt,
          movementType: filters.movementType,
          registeredBy: filters.registeredBy,
        }),
      );
  });

  return rows.sort((a, b) => {
    const dateCompare = a.movementDate.localeCompare(b.movementDate);
    return dateCompare === 0 ? a.id.localeCompare(b.id) : dateCompare;
  });
}

function movementAmount(movement: MaterialMovement) {
  return movement.lineTotal || movement.quantity * movement.unitPrice;
}

function formatDate(value?: string) {
  if (!value) {
    return "-";
  }

  return value.slice(0, 10);
}

function uniqueOptions(values: Array<string | undefined>) {
  return [
    ...new Set(
      values.map((value) => value?.trim()).filter(Boolean) as string[],
    ),
  ].sort((a, b) => a.localeCompare(b, "mn-MN"));
}

function accountValue(row: MaterialMovement) {
  return row.registeredByEmail || row.registeredBy || "";
}

function stockBalance(material: InventoryMaterial) {
  const income = material.income.reduce(
    (total, movement) => total + movement.quantity,
    0,
  );
  const expense = material.expense.reduce(
    (total, movement) => total + movement.quantity,
    0,
  );

  return income - expense;
}

function htmlEscape(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function downloadPdf() {
  window.print();
}

function downloadExcel(
  rows: MaterialReportRow[],
  canViewMoney: boolean,
  totals: MaterialReportTotals,
) {
  const headers = [
    "Огноо",
    "Материал",
    "Төрөл",
    "Тоо",
    "Үлдэгдэл",
    ...(canViewMoney ? ["Нэгж үнэ", "Дүн"] : []),
    "Хүлээн авсан хүн",
    "Хаана ашигласан",
    "Account",
    "Бүртгэсэн",
  ];

  const bodyRows = rows.map((row) => [
    row.movementDate,
    row.materialName,
    row.movementType === "RETURN" ? "Орлого" : "Зарлага",
    `${row.quantity.toLocaleString()} ${unitLabel(row.unit)}`,
    row.remainingQuantity.toLocaleString(),
    ...(canViewMoney
      ? [formatMoney(row.unitPrice), formatMoney(movementAmount(row))]
      : []),
    row.usedBy || "-",
    row.usedAt || "-",
    accountValue(row) || "-",
    formatDate(row.createdAt),
  ]);

  const footerRows = canViewMoney
    ? [
        [
          "",
          "Нийт",
          "Орлого",
          totals.incomeQuantityTotal.toLocaleString(),
          totals.remainingQuantityTotal.toLocaleString(),
          "",
          formatMoney(totals.incomeTotal),
          "",
          "",
          "",
          "",
        ],
        [
          "",
          "",
          "Зарлага",
          totals.expenseQuantityTotal.toLocaleString(),
          "",
          "",
          formatMoney(totals.expenseTotal),
          "",
          "",
          "",
          "",
        ],
      ]
    : [
        [
          "",
          "Нийт",
          "Орлого",
          totals.incomeQuantityTotal.toLocaleString(),
          totals.remainingQuantityTotal.toLocaleString(),
          "",
          "",
          "",
          "",
        ],
        [
          "",
          "",
          "Зарлага",
          totals.expenseQuantityTotal.toLocaleString(),
          "",
          "",
          "",
          "",
          "",
        ],
      ];

  const tableRows = [
    headers,
    ...bodyRows,
    Array(headers.length).fill(""),
    ...footerRows,
  ]
    .map(
      (cells) =>
        `<tr>${cells
          .map((cell) => `<td>${htmlEscape(String(cell))}</td>`)
          .join("")}</tr>`,
    )
    .join("");

  const html = `<!doctype html><html><head><meta charset="utf-8" /></head><body><table>${tableRows}</table></body></html>`;
  const blob = new Blob([html], {
    type: "application/vnd.ms-excel;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `material-tailan-${new Date().toISOString().slice(0, 10)}.xls`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function MaterialsReport() {
  const registeredUser = useCurrentRegisteredUser();
  const materials = useInventoryMaterials();
  const source = materials ?? fallbackMaterials();
  const [filters, setFilters] =
    useState<MaterialReportFilters>(emptyMaterialFilters);
  const rows = useMemo(() => toReportRows(source, filters), [filters, source]);
  const allRows = useMemo(
    () => toReportRows(source, emptyMaterialFilters),
    [source],
  );
  const usedByOptions = useMemo(
    () => uniqueOptions(allRows.map((row) => row.usedBy)),
    [allRows],
  );
  const usedAtOptions = useMemo(
    () => uniqueOptions(allRows.map((row) => row.usedAt)),
    [allRows],
  );
  const accountOptions = useMemo(
    () => uniqueOptions(allRows.map((row) => accountValue(row))),
    [allRows],
  );

  const visibleMaterials = filters.materialId
    ? source.filter((material) => material.id === filters.materialId)
    : source;
  const remainingQuantityTotal = visibleMaterials.reduce(
    (total, material) => total + stockBalance(material),
    0,
  );
  const incomeRows = rows.filter((row) => row.movementType === "RETURN");
  const expenseRows = rows.filter((row) => row.movementType === "OUT");
  const incomeTotal = incomeRows.reduce(
    (total, row) => total + movementAmount(row),
    0,
  );
  const expenseTotal = expenseRows.reduce(
    (total, row) => total + movementAmount(row),
    0,
  );
  const incomeQuantityTotal = incomeRows.reduce(
    (total, row) => total + row.quantity,
    0,
  );
  const expenseQuantityTotal = expenseRows.reduce(
    (total, row) => total + row.quantity,
    0,
  );
  const canViewMoney = registeredUser?.permission !== "QUANTITY_ONLY";
  const headers = [
    "Огноо",
    "Материал",
    "Төрөл",
    "Тоо",
    "Үлдэгдэл",
    ...(canViewMoney ? ["Нэгж үнэ", "Дүн"] : []),
    "Хүлээн авсан хүн",
    "Хаана ашигласан",
    "Account",
    "Бүртгэсэн",
  ];
  const emptyColSpan = headers.length;
  const footerTrailingColSpan = 4;

  return (
    <section className="space-y-4">
      <style jsx global>{`
        @page {
          size: A4 landscape;
          margin: 10mm;
        }

        @media print {
          html,
          body {
            background: #ffffff !important;
            height: auto !important;
            overflow: visible !important;
          }

          body * {
            visibility: hidden !important;
          }

          #material-report-pdf,
          #material-report-pdf * {
            visibility: visible !important;
          }

          #material-report-pdf {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            overflow: visible !important;
            border: 0 !important;
            box-shadow: none !important;
          }

          #material-report-pdf .overflow-x-auto {
            overflow: visible !important;
          }

          #material-report-pdf table {
            width: 100% !important;
            min-width: 0 !important;
            table-layout: fixed !important;
            font-size: 8px !important;
            line-height: 1.25 !important;
          }

          #material-report-pdf th,
          #material-report-pdf td {
            padding: 3px 4px !important;
            white-space: normal !important;
            overflow-wrap: anywhere !important;
          }

          .pdf-hidden {
            display: none !important;
          }
        }
      `}</style>

      <div className="app-card p-4 pdf-hidden">
        <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-7">
          <label className="space-y-1 text-sm font-medium text-[var(--muted)]">
            Эхлэх огноо
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(event) =>
                setFilters((current) => ({
                  ...current,
                  dateFrom: event.target.value,
                }))
              }
              className="input-shell h-11 w-full px-3 text-[var(--foreground)]"
            />
          </label>
          <label className="space-y-1 text-sm font-medium text-[var(--muted)]">
            Дуусах огноо
            <input
              type="date"
              value={filters.dateTo}
              onChange={(event) =>
                setFilters((current) => ({
                  ...current,
                  dateTo: event.target.value,
                }))
              }
              className="input-shell h-11 w-full px-3 text-[var(--foreground)]"
            />
          </label>
          <label className="space-y-1 text-sm font-medium text-[var(--muted)]">
            Материал
            <select
              value={filters.materialId}
              onChange={(event) =>
                setFilters((current) => ({
                  ...current,
                  materialId: event.target.value,
                }))
              }
              className="input-shell h-11 w-full px-3 text-[var(--foreground)]"
            >
              <option value="">Бүх материал</option>
              {source.map((material) => (
                <option key={material.id} value={material.id}>
                  {material.name}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-1 text-sm font-medium text-[var(--muted)]">
            Төрөл
            <select
              value={filters.movementType}
              onChange={(event) =>
                setFilters((current) => ({
                  ...current,
                  movementType: event.target.value,
                }))
              }
              className="input-shell h-11 w-full px-3 text-[var(--foreground)]"
            >
              <option value="">Бүгд</option>
              <option value="RETURN">Орлого</option>
              <option value="OUT">Зарлага</option>
            </select>
          </label>
          <label className="space-y-1 text-sm font-medium text-[var(--muted)]">
            Хүлээн авсан хүн
            <select
              value={filters.usedBy}
              onChange={(event) =>
                setFilters((current) => ({
                  ...current,
                  usedBy: event.target.value,
                }))
              }
              className="input-shell h-11 w-full px-3 text-[var(--foreground)]"
            >
              <option value="">Бүгд</option>
              {usedByOptions.map((usedBy) => (
                <option key={usedBy} value={usedBy}>
                  {usedBy}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-1 text-sm font-medium text-(--muted)">
            Хаана ашигласан
            <select
              value={filters.usedAt}
              onChange={(event) =>
                setFilters((current) => ({
                  ...current,
                  usedAt: event.target.value,
                }))
              }
              className="input-shell h-11 w-full px-3 text-foreground"
            >
              <option value="">Бүгд</option>
              {usedAtOptions.map((usedAt) => (
                <option key={usedAt} value={usedAt}>
                  {usedAt}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-1 text-sm font-medium text-(--muted)">
            Бүртгэсэн account
            <select
              value={filters.registeredBy}
              onChange={(event) =>
                setFilters((current) => ({
                  ...current,
                  registeredBy: event.target.value,
                }))
              }
              className="input-shell h-11 w-full px-3 text-foreground"
            >
              <option value="">Бүгд</option>
              {accountOptions.map((account) => (
                <option key={account} value={account}>
                  {account}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div id="material-report-pdf" className="app-card overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--line)] p-4">
          <h2 className="text-lg font-semibold">Материалын тайлан</h2>
          <div className="pdf-hidden flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() =>
                downloadExcel(rows, canViewMoney, {
                  incomeQuantityTotal,
                  expenseQuantityTotal,
                  remainingQuantityTotal,
                  incomeTotal,
                  expenseTotal,
                })
              }
              className="soft-chip px-4 py-2 font-medium"
            >
              Excel татах
            </button>
            <button
              type="button"
              onClick={downloadPdf}
              className="action-button px-5 py-2"
            >
              PDF татах
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-[1360px] border-collapse text-sm">
            <thead>
              <tr className="bg-[var(--surface-muted)] text-left">
                {headers.map((header) => (
                  <th
                    key={header}
                    className="border border-[var(--line)] px-3 py-2 font-semibold"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.id}
                  className="odd:bg-[var(--surface)] even:bg-[var(--surface-muted)]"
                >
                  <td className="border border-[var(--line)] px-3 py-2">
                    {row.movementDate}
                  </td>
                  <td className="border border-[var(--line)] px-3 py-2 font-medium">
                    {row.materialName}
                  </td>
                  <td className="border border-[var(--line)] px-3 py-2">
                    {row.movementType === "RETURN" ? "Орлого" : "Зарлага"}
                  </td>
                  <td className="border border-[var(--line)] px-3 py-2 text-right">
                    {row.quantity.toLocaleString()} {unitLabel(row.unit)}
                  </td>
                  <td className="border border-[var(--line)] px-3 py-2 text-right">
                    {row.remainingQuantity.toLocaleString()}
                  </td>
                  {canViewMoney ? (
                    <>
                      <td className="border border-[var(--line)] px-3 py-2 text-right">
                        {formatMoney(row.unitPrice)}
                      </td>
                      <td className="border border-[var(--line)] px-3 py-2 text-right">
                        {formatMoney(movementAmount(row))}
                      </td>
                    </>
                  ) : null}
                  <td className="border border-[var(--line)] px-3 py-2">
                    {row.usedBy || "-"}
                  </td>
                  <td className="border border-[var(--line)] px-3 py-2">
                    {row.usedAt || "-"}
                  </td>
                  <td className="border border-[var(--line)] px-3 py-2">
                    {accountValue(row) || "-"}
                  </td>
                  <td className="border border-[var(--line)] px-3 py-2">
                    {formatDate(row.createdAt)}
                  </td>
                </tr>
              ))}
              {rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={emptyColSpan}
                    className="border border-[var(--line)] px-3 py-8 text-center text-[var(--muted)]"
                  >
                    Сонгосон нөхцөлд тохирох материалын бүртгэл олдсонгүй.
                  </td>
                </tr>
              ) : null}
              <tr className="border-t-2 border-[var(--line)] bg-[var(--surface-muted)] font-semibold">
                <td
                  className="border border-white bg-white px-3 py-3"
                  rowSpan={2}
                />
                <td
                  className="border-2 border-[var(--line)] px-3 py-3 text-center"
                  rowSpan={2}
                >
                  Нийт
                </td>
                <td className="border border-[var(--line)] px-3 py-3">
                  Орлого
                </td>
                <td className="border border-[var(--line)] px-3 py-3 text-right text-sm font-semibold text-[var(--foreground)]">
                  {incomeQuantityTotal.toLocaleString()}
                </td>
                <td
                  className="border border-[var(--line)] px-3 py-3 text-right text-sm font-semibold text-[var(--foreground)]"
                  rowSpan={2}
                >
                  {remainingQuantityTotal.toLocaleString()}
                </td>
                {canViewMoney ? (
                  <>
                    <td className="border border-[var(--line)] px-3 py-3" />
                    <td className="border border-[var(--line)] px-3 py-3 text-right text-sm font-semibold text-[var(--foreground)]">
                      {formatMoney(incomeTotal)}
                    </td>
                  </>
                ) : null}
                <td
                  className="border border-white bg-white px-3 py-2 text-white"
                  colSpan={footerTrailingColSpan}
                />
              </tr>
              <tr className="bg-[var(--surface-muted)] font-semibold">
                <td className="border border-[var(--line)] px-3 py-3">
                  Зарлага
                </td>
                <td className="border border-[var(--line)] px-3 py-3 text-right text-sm font-semibold text-[var(--foreground)]">
                  {expenseQuantityTotal.toLocaleString()}
                </td>
                {canViewMoney ? (
                  <>
                    <td className="border border-[var(--line)] px-3 py-3" />
                    <td className="border border-[var(--line)] px-3 py-3 text-right text-sm font-semibold text-[var(--foreground)]">
                      {formatMoney(expenseTotal)}
                    </td>
                  </>
                ) : null}
                <td
                  className="border border-white bg-white px-3 py-2 text-white"
                  colSpan={footerTrailingColSpan}
                />
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function RentalsReport() {
  return (
    <div className="app-card p-6">
      <h2 className="text-lg font-semibold">Түрээсийн тайлан</h2>
      <p className="mt-2 text-sm text-[var(--muted)]">
        Түрээсийн гэрээ, авлага, буцаалтын тайлангийн filter болон export
        дараагийн алхамд холбоход бэлэн хэсэг.
      </p>
    </div>
  );
}

export default function ReportsPage() {
  const [reportKind, setReportKind] = useState<ReportKind>("materials");

  return (
    <>
      <SectionHeader
        title="Тайлан"
        description="Хүссэн хугацаа, материал, хүлээн авсан хүн, байршил, бүртгэсэн account-аар шүүж тайлан авна."
      />

      <div className="mb-5 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setReportKind("materials")}
          className={
            reportKind === "materials"
              ? "action-button px-5 py-3"
              : "soft-chip px-5 py-3 font-medium"
          }
        >
          Материалын тайлан
        </button>
        <button
          type="button"
          onClick={() => setReportKind("rentals")}
          className={
            reportKind === "rentals"
              ? "action-button px-5 py-3"
              : "soft-chip px-5 py-3 font-medium"
          }
        >
          Түрээсийн тайлан
        </button>
      </div>

      {reportKind === "materials" ? <MaterialsReport /> : <RentalsReport />}
    </>
  );
}
