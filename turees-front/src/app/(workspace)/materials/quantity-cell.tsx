import type { MaterialMovement } from "./material-types";
import { formatMoney } from "./material-utils";

type QuantityCellProps = {
  movement?: MaterialMovement;
};

export function QuantityCell({ movement }: QuantityCellProps) {
  if (!movement) {
    return null;
  }

  const lineTotal = movement.lineTotal || movement.quantity * movement.unitPrice;
  const typeLabel = movement.movementType === "RETURN" ? "Орлого" : "Зарлага";
  const accountLabel = movement.registeredByEmail
    ? `${movement.registeredBy || movement.registeredByEmail} (${movement.registeredByEmail})`
    : movement.registeredBy;

  const tooltip = [
    `Огноо: ${movement.movementDate}`,
    `Төрөл: ${typeLabel}`,
    `Тоо: ${movement.quantity.toLocaleString()}`,
    `Нэгж үнэ: ${formatMoney(movement.unitPrice)}`,
    `Дүн: ${formatMoney(lineTotal)}`,
    movement.usedBy ? `Хүлээн авсан хүн: ${movement.usedBy}` : "",
    movement.usedAt ? `Хаана ашигласан: ${movement.usedAt}` : "",
    accountLabel ? `Бүртгэсэн: ${accountLabel}` : "",
    movement.createdAt ? `Бүртгэсэн огноо: ${movement.createdAt}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  return (
    <span title={tooltip} className="block cursor-help text-right">
      <span className="block font-semibold">{movement.quantity.toLocaleString()}</span>
      <span className="block text-xs text-[var(--muted)]">{formatMoney(lineTotal)}</span>
      {movement.registeredBy ? (
        <span className="block max-w-32 truncate text-xs text-[var(--muted)]">
          {movement.registeredBy}
        </span>
      ) : null}
    </span>
  );
}
