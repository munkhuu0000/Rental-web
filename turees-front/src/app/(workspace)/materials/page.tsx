import { SectionHeader } from "@/app/components/menu/section-header";
import { MaterialsList } from "./materials-list";

export default function MaterialsPage() {
  return (
    <>
      <SectionHeader title="Материал" />
      <MaterialsList />
    </>
  );
}
