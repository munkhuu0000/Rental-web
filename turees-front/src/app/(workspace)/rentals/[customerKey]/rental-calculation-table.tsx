import { RentalRecord } from "@/lib/rental-records";
import { RentalQuantityTable } from "./rental-quantity-table";
import { RentalRepairTable } from "./rental-repair-table";
import { RentalSettlementTable } from "./rental-settlement-table";

type RentalCalculationTableProps = {
  records: RentalRecord[];
};

export function RentalCalculationTable({
  records,
}: RentalCalculationTableProps) {
  return (
    <div className="space-y-4">
      <RentalQuantityTable records={records} />
      <RentalSettlementTable records={records} />
      <RentalRepairTable records={records} />
    </div>
  );
}
