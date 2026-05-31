import { SectionHeader } from "@/app/components/menu/section-header";
import { TableCard } from "@/app/components/menu/table-card";
import { customers } from "@/lib/mock-data";

export default function CustomersPage() {
  const rows = customers.map(([name, company, phone, active, receivable]) => [
    <div key={`${name}-name`} className="flex items-center gap-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--accent)] font-semibold text-white">
        {String(name).slice(0, 2)}
      </div>
      <span className="text-lg font-medium">{name}</span>
    </div>,
    <span key={`${name}-company`}>{company}</span>,
    <span key={`${name}-phone`} className="text-[var(--muted)]">
      {phone}
    </span>,
    <span key={`${name}-active`} className="font-medium">
      {active}
    </span>,
    <span key={`${name}-receivable`} className="text-lg font-semibold">
      {receivable}
    </span>,
  ]);

  return (
    <>
      <SectionHeader
        title="Захиалагч"
        description="Бүх захиалагч компани, идэвхтэй авлагын мэдээлэл."
        action="Захиалагч нэмэх"
      />

      <TableCard
        headers={["Захиалагч", "Компани", "Утас", "Идэвхтэй түрээс", "Авлага"]}
        rows={rows}
      />
    </>
  );
}
