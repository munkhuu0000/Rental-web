import { MaterialOption } from "./rental-detail-utils";

const defaultMaterialNames = [
  "Хэв хашмал 1200x600",
  "Хэв хашмал 1200x500",
  "Хэв хашмал 1200x450",
  "Хэв хашмал 1200x400",
  "Хэв хашмал 1200x300",
  "Хэв хашмал 1200x200",
  "Хэв хашмал 1200x150",
  "Дотор булан 100х100",
  "Дотор булан 150х100",
  "Дотор булан 200x100",
  "Дотор булан 150х150",
  "Дотор булан 200х200",
  "Гадна булан 2400",
  "Гадна булан 1200",
  "В2 сапуд",
  "В4 сапуд",
  "В5 сапуд",
  "В6 сапуд",
  "Шат",
];

export const defaultRentalMaterials: MaterialOption[] = defaultMaterialNames.map(
  (name, index) => ({
    id: `default-rental-material-${index + 1}`,
    name,
    unit: "PCS",
    defaultPrice: 0,
  }),
);

export function mergeRentalMaterials(materials: MaterialOption[]) {
  const byName = new Map<string, MaterialOption>();

  for (const material of [...defaultRentalMaterials, ...materials]) {
    const key = material.name.trim().toLowerCase();

    if (!byName.has(key)) {
      byName.set(key, material);
    }
  }

  return [...byName.values()];
}
