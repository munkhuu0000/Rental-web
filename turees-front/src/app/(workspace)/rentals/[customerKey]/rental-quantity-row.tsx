import { RentalRecord } from "@/lib/rental-records";
import {
  cellClass,
  columnQuantity,
  MaterialRow,
  stickyIndexCellClass,
  stickyNameCellClass,
  sum,
} from "./rental-quantity-table-utils";

type QuantityRowProps = {
  row: MaterialRow;
  index: number;
  incomeColumns: RentalRecord[];
  expenseColumns: RentalRecord[];
};

export function QuantityRow({
  row,
  index,
  incomeColumns,
  expenseColumns,
}: QuantityRowProps) {
  const rowBg = index % 2 === 0 ? "bg-[#fbfcfb]" : "bg-[var(--surface)]";
  const incomeTotal = sum(row.income);
  const expenseTotal = sum(row.expense);

  return (
    <tr className={rowBg}>
      <td className={`${rowBg} ${stickyIndexCellClass}`}>{index + 1}</td>
      <td className={`${rowBg} ${stickyNameCellClass}`}>{row.material}</td>
      <td className={cellClass}>{incomeTotal.toLocaleString()}</td>
      <td className={cellClass}>{expenseTotal.toLocaleString()}</td>
      <td className={cellClass}>
        {(incomeTotal - expenseTotal).toLocaleString()}
      </td>
      {incomeColumns.map((column) => (
        <td key={`${row.material}-income-${column.id}`} className={cellClass}>
          {columnQuantity(row.income, column.id) || ""}
        </td>
      ))}
      {expenseColumns.map((column) => (
        <td key={`${row.material}-expense-${column.id}`} className={cellClass}>
          {columnQuantity(row.expense, column.id) || ""}
        </td>
      ))}
    </tr>
  );
}
