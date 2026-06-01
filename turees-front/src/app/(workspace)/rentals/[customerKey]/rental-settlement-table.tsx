import Link from "next/link";
import { RentalRecord } from "@/lib/rental-records";
import {
  formatDate,
  groupedSettlementLines,
  lineDays,
  lineTotal,
  money,
  settlementCellClass,
  settlementHeadClass,
  settlementLabelClass,
  SettlementLine,
} from "./rental-settlement-utils";

type RentalSettlementTableProps = {
  records: RentalRecord[];
};

const headers = [
  "Авсан тоо ширхэг",
  "Ирсэн огноо",
  "Буцаасан огноо",
  "Буцаасан тоо ширхэг",
  "Барилгын талбайн Үлдэгдэл",
  "Хоног",
  "Нэгж үнэ",
  "Нийт үнэ",
];

export function RentalSettlementTable({ records }: RentalSettlementTableProps) {
  const groups = groupedSettlementLines(records);
  const totalTaken = records
    .filter((record) => record.movementType !== "RETURN")
    .reduce((total, record) => total + record.quantity, 0);
  const totalReturned = records
    .filter((record) => record.movementType === "RETURN")
    .reduce((total, record) => total + record.quantity, 0);
  const totalRent = [...groups.values()]
    .flat()
    .reduce((total, line) => total + lineTotal(line), 0);

  return (
    <div className="app-card overflow-hidden">
      <div className="border-b border-[var(--line)] px-4 py-3">
        <p className="text-sm font-semibold">Түрээсийн тооцоо</p>
      </div>
      <div className="overflow-x-auto">
        <table className="font-data w-full min-w-[980px] border-collapse bg-[var(--surface)]">
          <thead>
            <tr>
              {headers.map((header) => (
                <th key={header} className={settlementHeadClass}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...groups.entries()].map(([material, lines]) => (
              <MaterialGroup key={material} material={material} lines={lines} />
            ))}
            {records.length ? (
              <TotalRows
                totalTaken={totalTaken}
                totalReturned={totalReturned}
                balance={totalTaken - totalReturned}
                totalRent={totalRent}
              />
            ) : (
              <EmptyRow />
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MaterialGroup(props: { material: string; lines: SettlementLine[] }) {
  return (
    <>
      <tr>
        <td colSpan={8} className="border border-[var(--line)] bg-[var(--accent-soft)] px-3 py-2 text-left text-[0.82rem] font-semibold text-[var(--accent-strong)]">
          {props.material}
        </td>
      </tr>
      {props.lines.map((line, index) => (
        <CalculationRow key={`${props.material}-${index}`} line={line} />
      ))}
    </>
  );
}

function CalculationRow({ line }: { line: SettlementLine }) {
  const days = lineDays(line);
  const price = line.taken?.unitPrice ?? 0;

  return (
    <tr className="odd:bg-[#fbfcfb] even:bg-[var(--surface)]">
      <td className={settlementCellClass}>{line.taken?.quantity.toLocaleString() || ""}</td>
      <td className={settlementCellClass}>{formatDate(line.taken?.date)}</td>
      <td className={settlementCellClass}>{formatDate(line.returnRecord?.date)}</td>
      <td className={settlementCellClass}>{money(line.returnedQuantity)}</td>
      <td className={settlementCellClass}>{money(line.fieldRemaining)}</td>
      <td className={settlementCellClass}>{days || ""}</td>
      <td className={settlementCellClass}>{money(price)}</td>
      <td className={`${settlementCellClass} font-bold`}>{money(lineTotal(line))}</td>
    </tr>
  );
}

function TotalRows(props: {
  totalTaken: number;
  totalReturned: number;
  balance: number;
  totalRent: number;
}) {
  return (
    <>
      <tr>
        <td className={settlementLabelClass}>Нийт авсан тоо</td>
        <td className={settlementCellClass} />
        <td className={settlementCellClass} />
        <td className={settlementLabelClass}>Нийт өгсөн тоо</td>
        <td className={settlementLabelClass}>Үлдэгдэл</td>
        <td className={settlementCellClass} />
        <td className={settlementCellClass} />
        <td className={settlementLabelClass}>Нийт түрээс</td>
      </tr>
      <tr>
        <td className={`${settlementCellClass} font-bold`}>{props.totalTaken.toLocaleString()}</td>
        <td className={settlementCellClass} />
        <td className={settlementCellClass} />
        <td className={`${settlementCellClass} font-bold`}>{props.totalReturned.toLocaleString()}</td>
        <td className="border border-[var(--line)] bg-[var(--accent-soft)] px-3 py-2 text-right text-[0.82rem] font-semibold text-[var(--accent-strong)]">{props.balance.toLocaleString()}</td>
        <td className={settlementCellClass} />
        <td className={settlementCellClass} />
        <td className={`${settlementCellClass} font-bold`}>{props.totalRent.toLocaleString()}</td>
      </tr>
    </>
  );
}

function EmptyRow() {
  return (
    <tr>
      <td colSpan={8} className="border border-[var(--line)] px-3 py-8 text-center text-sm text-[var(--muted)]">
        Энэ харилцагч дээр түрээсийн тооцоо олдсонгүй.{" "}
        <Link href="/rentals" className="font-semibold text-[var(--accent-strong)]">Түрээс рүү буцах</Link>
      </td>
    </tr>
  );
}
