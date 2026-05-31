import type { InventoryMaterial, MaterialMovement } from "./material-types";
import { formatMoney, sumMovementAmounts, sumMovements, unitLabel } from "./material-utils";
import { QuantityCell } from "./quantity-cell";

const cellClass = "border border-[var(--line)] px-2.5 py-1.5 text-right";

type MaterialTableRowProps = {
  material: InventoryMaterial;
  index: number;
  incomeColumns: MaterialMovement[];
  expenseColumns: MaterialMovement[];
};

export function MaterialTableRow({
  material,
  index,
  incomeColumns,
  expenseColumns,
}: MaterialTableRowProps) {
  const incomeTotal = sumMovements(material.income);
  const expenseTotal = sumMovements(material.expense);
  const incomeAmountTotal = sumMovementAmounts(material.income);
  const expenseAmountTotal = sumMovementAmounts(material.expense);
  const incomeById = new Map(
    material.income.map((movement) => [movement.id, movement]),
  );
  const expenseById = new Map(
    material.expense.map((movement) => [movement.id, movement]),
  );
  const rowBg = index % 2 === 0 ? "bg-[#fbfcfb]" : "bg-[var(--surface)]";

  return (
    <tr className={rowBg}>
      <td className={`${rowBg} sticky left-0 z-20 border border-[var(--line)] px-2.5 py-1.5 text-center tabular-nums`}>
        {index + 1}
      </td>
      <td className={`${rowBg} sticky left-14 z-20 min-w-56 border border-[var(--line)] px-2.5 py-1.5 font-medium shadow-[8px_0_12px_-12px_rgba(0,0,0,0.28)]`}>
        {material.name}
      </td>
      <td className={cellClass}>{unitLabel(material.unit)}</td>
      <td className={cellClass}>{formatMoney(material.defaultPrice)}</td>
      <td className={cellClass}>{incomeTotal.toLocaleString()}</td>
      <td className={cellClass}>{expenseTotal.toLocaleString()}</td>
      <td className={cellClass}>
        {(incomeTotal - expenseTotal).toLocaleString()}
      </td>
      <td className={cellClass}>{formatMoney(incomeAmountTotal)}</td>
      <td className={cellClass}>{formatMoney(expenseAmountTotal)}</td>
      {incomeColumns.length > 0 ? (
        incomeColumns.map((movement) => (
          <td key={`${material.id}-income-${movement.id}`} className={cellClass}>
            <QuantityCell movement={incomeById.get(movement.id)} />
          </td>
        ))
      ) : (
        <td className={cellClass} />
      )}
      {expenseColumns.length > 0 ? (
        expenseColumns.map((movement) => (
          <td key={`${material.id}-expense-${movement.id}`} className={cellClass}>
            <QuantityCell movement={expenseById.get(movement.id)} />
          </td>
        ))
      ) : (
        <td className={cellClass} />
      )}
    </tr>
  );
}
