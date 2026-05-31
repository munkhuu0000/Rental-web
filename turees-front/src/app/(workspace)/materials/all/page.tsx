import { SectionHeader } from "@/app/components/menu/section-header";
import { MaterialActionButton } from "../material-action-button";
import { MaterialsList } from "../materials-list";

export default function AllMaterialsPage() {
  return (
    <>
      <SectionHeader
        title="Бүх материал"
        description="Орлого, зарлага, үлдэгдлийг хөдөлгөөн бүрийн огноогоор дэлгэрэнгүй харна."
      />

      <div className="mb-5 flex justify-end">
        <MaterialActionButton
          href="/materials/new"
          label="Шинэ төрлийн материал бүртгэх"
          icon="plus"
        />
      </div>

      <MaterialsList />
    </>
  );
}
