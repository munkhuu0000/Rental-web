import { PlaceholderCard } from "@/app/components/menu/placeholder-card";
import { SectionHeader } from "@/app/components/menu/section-header";
import { TableCard } from "@/app/components/menu/table-card";
import { invoices } from "@/lib/mock-data";

export default function InvoicesPage() {
  return (
    <>
      <SectionHeader
        title="Нэхэмжлэл"
        description="Түрээсийн хөдөлгөөнөөс үүссэн мөнгөн тооцоог хянах хэсэг."
      />

      <PlaceholderCard
        title="Мөнгөн тооцоо"
        copy="Энэ хэсэгт захиалагч тус бүрийн авлага, илгээсэн нэхэмжлэл, төлөлтийн төлөв цугларна."
        action="Нэхэмжлэл үүсгэх"
      />

      <div className="mt-6">
        <TableCard
          headers={["Дугаар", "Захиалагч", "Дүн", "Төлөв"]}
          rows={invoices}
        />
      </div>
    </>
  );
}
