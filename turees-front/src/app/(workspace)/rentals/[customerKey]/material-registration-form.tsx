"use client";

import { FormEvent } from "react";
import { RentalMovementType } from "@/lib/rental-records";
import {
  DateField,
  MovementField,
  NewMaterialFields,
  NoteField,
  QuantityField,
  UnitPriceField,
} from "./material-form-fields";
import { MaterialPicker } from "./material-picker";
import { MaterialOption, NEW_MATERIAL_VALUE } from "./rental-detail-utils";

type MaterialRegistrationFormProps = {
  visibleMaterials: MaterialOption[];
  selectedMaterialId: string;
  unitPrice: string;
  onMaterialChange: (materialId: string) => void;
  onHideMaterial: (materialId: string) => void;
  onUnitPriceChange: (value: string) => void;
  onSubmit: (form: FormData, movementType: RentalMovementType) => void;
};

export function MaterialRegistrationForm(props: MaterialRegistrationFormProps) {
  const isNewMaterial = props.selectedMaterialId === NEW_MATERIAL_VALUE;

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const movementType = String(
      form.get("movementType") || "OUT",
    ) as RentalMovementType;

    props.onSubmit(form, movementType);
    event.currentTarget.reset();
  }

  return (
    <form
      onSubmit={submit}
      className="app-card mb-4 border-l-4 border-[var(--accent)] p-4"
    >
      <div className="mb-3">
        <p className="text-sm font-semibold">Материал бүртгэх</p>
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-8">
        <MovementField />
        <DateField />
        <div className="space-y-1 text-sm font-medium text-[var(--muted)] xl:col-span-2">
          <label>Материалын нэр</label>
          <MaterialPicker
            materials={props.visibleMaterials}
            selectedMaterialId={props.selectedMaterialId}
            onSelect={props.onMaterialChange}
            onHide={props.onHideMaterial}
          />
        </div>
        {isNewMaterial ? <NewMaterialFields /> : null}
        <QuantityField />
        <UnitPriceField
          value={props.unitPrice}
          onChange={props.onUnitPriceChange}
        />
        <NoteField />
        <div className="flex items-end">
          <button type="submit" className="action-button h-10 w-full px-4">
            Бүртгэх
          </button>
        </div>
      </div>
    </form>
  );
}
