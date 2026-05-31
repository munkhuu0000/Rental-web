import { PlaceholderCard } from "@/app/components/menu/placeholder-card";
import { SectionHeader } from "@/app/components/menu/section-header";
import { TableCard } from "@/app/components/menu/table-card";
import { returns } from "@/lib/mock-data";

export default function ReturnsPage() {
  return (
    <>
      <SectionHeader
        title="Буцаалт"
        description="Буцааж ирсэн барааг шалгаж, үлдэгдэлд шингээх хэсэг."
      />

      <PlaceholderCard
        title="Хүлээн авах урсгал"
        copy="Буцааж ирсэн материал бүрийг огноо, тоо хэмжээ, шалгалтын төлөвтэй нь тэмдэглэнэ."
        action="Буцаалт бүртгэх"
      />

      <div className="mt-6">
        <TableCard
          headers={["Огноо", "Захиалагч", "Материал", "Тоо хэмжээ", "Төлөв"]}
          rows={returns}
        />
      </div>
    </>
  );
}
