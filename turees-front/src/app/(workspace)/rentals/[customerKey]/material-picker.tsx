"use client";

import { useEffect, useRef, useState } from "react";
import { NEW_MATERIAL_VALUE, MaterialOption } from "./rental-detail-utils";

type MaterialPickerProps = {
  materials: MaterialOption[];
  selectedMaterialId: string;
  onSelect: (materialId: string) => void;
  onHide: (materialId: string) => void;
};

export function MaterialPicker({
  materials,
  selectedMaterialId,
  onSelect,
  onHide,
}: MaterialPickerProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const selectedMaterial = materials.find(
    (material) => material.id === selectedMaterialId,
  );
  const selectedLabel =
    selectedMaterialId === NEW_MATERIAL_VALUE
      ? "+ Өөр материал нэмэх"
      : selectedMaterial?.name || "Материал сонгох";

  useEffect(() => {
    function onDocumentClick(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", onDocumentClick);
    return () => document.removeEventListener("mousedown", onDocumentClick);
  }, []);

  function selectMaterial(materialId: string) {
    onSelect(materialId);
    setOpen(false);
  }

  function hideMaterial(materialId: string) {
    onHide(materialId);
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="input-shell flex h-10 w-full items-center justify-between px-3 text-left text-[var(--foreground)]"
      >
        <span className="truncate">{selectedLabel}</span>
        <span className="text-[var(--muted)]">⌄</span>
      </button>

      {open ? (
        <div className="absolute left-0 right-0 z-20 mt-1 max-h-64 overflow-auto rounded-md border border-[var(--line)] bg-white py-1 shadow-lg">
          {materials.map((material) => (
            <div
              key={material.id}
              className="grid grid-cols-[1fr_auto] items-center gap-1 px-1"
            >
              <button
                type="button"
                onClick={() => selectMaterial(material.id)}
                className="rounded px-2 py-2 text-left text-sm text-[var(--foreground)] hover:bg-[var(--surface-muted)]"
              >
                {material.name}
              </button>
              <button
                type="button"
                onClick={() => hideMaterial(material.id)}
                aria-label={`${material.name} хасах`}
                className="h-8 w-8 rounded text-lg font-semibold text-[var(--muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--foreground)]"
              >
                -
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => selectMaterial(NEW_MATERIAL_VALUE)}
            className="block w-full rounded px-3 py-2 text-left text-sm font-semibold text-[var(--accent-strong)] hover:bg-[var(--surface-muted)]"
          >
            + Өөр материал нэмэх
          </button>
        </div>
      ) : null}
    </div>
  );
}
