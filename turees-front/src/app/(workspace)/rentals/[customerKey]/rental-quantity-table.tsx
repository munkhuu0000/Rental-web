import { RentalRecord } from "@/lib/rental-records";
import { QuantityRow } from "./rental-quantity-row";
import {
  headClass,
  materialRows,
  stickyIndexHeadClass,
  stickyNameHeadClass,
  uniqueColumns,
} from "./rental-quantity-table-utils";

type RentalQuantityTableProps = {
  records: RentalRecord[];
};

export function RentalQuantityTable({ records }: RentalQuantityTableProps) {
  const rows = materialRows(records);
  const incomeColumns = uniqueColumns(records, "RETURN");
  const expenseColumns = uniqueColumns(records, "OUT");
  const incomeSpan = Math.max(incomeColumns.length, 1);
  const expenseSpan = Math.max(expenseColumns.length, 1);

  return (
    <div className="app-card overflow-hidden">
      <div className="border-b border-[var(--line)] px-4 py-3">
        <p className="text-sm font-semibold">Тоо хэмжээний хүснэгт</p>
      </div>
      <div className="max-h-[calc(100vh-230px)] min-h-[320px] overflow-auto">
        <table className="materials-table min-w-[1280px] border-collapse text-[0.78rem] leading-snug text-[var(--foreground)]">
          <thead>
            <tr>
              <th className={stickyIndexHeadClass} rowSpan={2}>№</th>
              <th className={stickyNameHeadClass} rowSpan={2}>Материалын нэр</th>
              <th className={headClass} rowSpan={2}>Нийт орлого</th>
              <th className={headClass} rowSpan={2}>Нийт зарлага</th>
              <th className={headClass} rowSpan={2}>Үлдэгдэл</th>
              <th className={headClass} colSpan={incomeSpan}>Орлого</th>
              <th className={headClass} colSpan={expenseSpan}>Зарлага</th>
            </tr>
            <tr>
              {incomeColumns.length ? (
                incomeColumns.map((column) => (
                  <th key={column.id} className={headClass}>{column.date}</th>
                ))
              ) : (
                <th className={headClass} />
              )}
              {expenseColumns.length ? (
                expenseColumns.map((column) => (
                  <th key={column.id} className={headClass}>{column.date}</th>
                ))
              ) : (
                <th className={headClass} />
              )}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <QuantityRow
                key={row.material}
                row={row}
                index={index}
                incomeColumns={incomeColumns}
                expenseColumns={expenseColumns}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
