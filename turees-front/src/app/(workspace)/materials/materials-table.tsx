import type { InventoryMaterial, MaterialMovement } from "./material-types";
import { formatMoney, sumMovementAmounts, sumMovements } from "./material-utils";
import { MaterialTableRow } from "./material-table-row";

type MaterialsTableProps = {
  inventory: InventoryMaterial[];
  incomeColumns: MaterialMovement[];
  expenseColumns: MaterialMovement[];
};

const cellClass = "border border-[var(--line)] px-2.5 py-1.5 text-right";
const headClass =
  "border border-[var(--line)] bg-[#f6f8f6] px-2.5 py-2 text-center text-[0.72rem] font-semibold uppercase tracking-[0.04em] text-[var(--muted)]";
const stickyIndexHeadClass = `${headClass} sticky left-0 z-30 min-w-14`;
const stickyNameHeadClass = `${headClass} sticky left-14 z-30 min-w-64`;
const stickyIndexCellClass =
  "sticky left-0 z-20 border border-[var(--line)] px-2.5 py-1.5 text-center";
const stickyNameCellClass =
  "sticky left-14 z-20 min-w-56 border border-[var(--line)] px-2.5 py-1.5 font-semibold shadow-[8px_0_12px_-12px_rgba(0,0,0,0.28)]";

function totalForColumn(materials: InventoryMaterial[], movementId: string) {
  return materials.reduce((total, material) => {
    const movement = [...material.income, ...material.expense].find(
      (item) => item.id === movementId,
    );
    return total + (movement?.quantity ?? 0);
  }, 0);
}

function MovementDateHeader({
  movement,
  fallback,
}: {
  movement?: MaterialMovement;
  fallback: string;
}) {
  return <th className={headClass}>{movement?.movementDate ?? fallback}</th>;
}

function TotalsRow({
  inventory,
  incomeColumns,
  expenseColumns,
}: MaterialsTableProps) {
  const incomeTotal = inventory.reduce(
    (total, material) => total + sumMovements(material.income),
    0,
  );
  const expenseTotal = inventory.reduce(
    (total, material) => total + sumMovements(material.expense),
    0,
  );
  const incomeAmountTotal = inventory.reduce(
    (total, material) => total + sumMovementAmounts(material.income),
    0,
  );
  const expenseAmountTotal = inventory.reduce(
    (total, material) => total + sumMovementAmounts(material.expense),
    0,
  );

  return (
    <tr className="bg-[var(--accent-soft)] font-semibold text-[var(--foreground)]">
      <td className={`${stickyIndexCellClass} bg-[var(--accent-soft)]`} />
      <td className={`${stickyNameCellClass} bg-[var(--accent-soft)]`}>
        Нийт дүн
      </td>
      <td className={cellClass} />
      <td className={cellClass} />
      <td className={cellClass}>{incomeTotal.toLocaleString()}</td>
      <td className={cellClass}>{expenseTotal.toLocaleString()}</td>
      <td className={cellClass}>
        {(incomeTotal - expenseTotal).toLocaleString()}
      </td>
      <td className={cellClass}>{formatMoney(incomeAmountTotal)}</td>
      <td className={cellClass}>{formatMoney(expenseAmountTotal)}</td>
      {incomeColumns.length > 0 ? (
        incomeColumns.map((movement) => (
          <td key={`total-income-${movement.id}`} className={cellClass}>
            {totalForColumn(inventory, movement.id).toLocaleString()}
          </td>
        ))
      ) : (
        <td className={cellClass} />
      )}
      {expenseColumns.length > 0 ? (
        expenseColumns.map((movement) => (
          <td key={`total-expense-${movement.id}`} className={cellClass}>
            {totalForColumn(inventory, movement.id).toLocaleString()}
          </td>
        ))
      ) : (
        <td className={cellClass} />
      )}
    </tr>
  );
}

export function MaterialsTable(props: MaterialsTableProps) {
  const { inventory, incomeColumns, expenseColumns } = props;
  const incomeSpan = Math.max(incomeColumns.length, 1);
  const expenseSpan = Math.max(expenseColumns.length, 1);

  return (
    <div className="app-card overflow-hidden">
      <div className="max-h-[calc(100vh-230px)] min-h-[320px] overflow-auto">
        <table className="materials-table min-w-[1680px] border-collapse text-[0.78rem] leading-snug text-[var(--foreground)]">
          <thead>
            <tr>
              <th className={stickyIndexHeadClass} rowSpan={2}>
                №
              </th>
              <th className={stickyNameHeadClass} rowSpan={2}>
                Материалын нэр
              </th>
              <th className={headClass} rowSpan={2}>
                Хэмжих нэгж
              </th>
              <th className={headClass} rowSpan={2}>
                Нэгж үнэ
              </th>
              <th className={headClass} rowSpan={2}>
                Нийт орлого
                <br />
                тоо ширхэг
              </th>
              <th className={headClass} rowSpan={2}>
                Нийт зарлага
                <br />
                тоо ширхэг
              </th>
              <th className={headClass} rowSpan={2}>
                Талбай дээрх
                <br />
                тоо ширхэг
              </th>
              <th className={headClass} rowSpan={2}>
                Орлого
                <br />
                дүн
              </th>
              <th className={headClass} rowSpan={2}>
                Зарлага
                <br />
                дүн
              </th>
              <th className={headClass} colSpan={incomeSpan}>
                Орлого
              </th>
              <th className={headClass} colSpan={expenseSpan}>
                Зарлага
              </th>
            </tr>
            <tr>
              {incomeColumns.length > 0 ? (
                incomeColumns.map((movement) => (
                  <MovementDateHeader
                    key={movement.id}
                    movement={movement}
                    fallback=""
                  />
                ))
              ) : (
                <MovementDateHeader fallback="" />
              )}
              {expenseColumns.length > 0 ? (
                expenseColumns.map((movement) => (
                  <MovementDateHeader
                    key={movement.id}
                    movement={movement}
                    fallback=""
                  />
                ))
              ) : (
                <MovementDateHeader fallback="" />
              )}
            </tr>
          </thead>
          <tbody>
            {inventory.map((material, index) => (
              <MaterialTableRow
                key={material.id}
                material={material}
                index={index}
                incomeColumns={incomeColumns}
                expenseColumns={expenseColumns}
              />
            ))}
            <TotalsRow {...props} />
          </tbody>
        </table>
      </div>
    </div>
  );
}
