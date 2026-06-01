"use client";

import { useEffect, useRef, useState } from "react";
import { MaterialOption } from "./[customerKey]/rental-detail-utils";

type MaterialFilterPickerProps = {
  materials: MaterialOption[];
  value: string;
  onChange: (value: string) => void;
  onHide: (materialId: string, materialName: string) => void;
};

export function MaterialFilterPicker({
  materials,
  value,
  onChange,
  onHide,
}: MaterialFilterPickerProps) {
  const [open, setOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [customMaterial, setCustomMaterial] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const selectedLabel = value || "Материал: Бүгд";

  useEffect(() => {
    function onDocumentClick(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", onDocumentClick);
    return () => document.removeEventListener("mousedown", onDocumentClick);
  }, []);

  function select(value: string) {
    onChange(value);
    setOpen(false);
    setAdding(false);
  }

  function addCustomMaterial() {
    const nextMaterial = customMaterial.trim();

    if (!nextMaterial) {
      return;
    }

    select(nextMaterial);
    setCustomMaterial("");
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="input-shell flex h-10 w-full items-center justify-between px-3 text-left text-[var(--foreground)]"
        aria-label="Материал"
      >
        <span className="truncate">{selectedLabel}</span>
        <span className="text-[var(--muted)]">⌄</span>
      </button>

      {open ? (
        <div className="absolute left-0 right-0 z-20 mt-1 max-h-64 overflow-auto rounded-md border border-[var(--line)] bg-white py-1 shadow-lg">
          <button
            type="button"
            onClick={() => select("")}
            className="block w-full rounded px-3 py-2 text-left text-sm font-semibold text-[var(--accent-strong)] hover:bg-[var(--surface-muted)]"
          >
            Материал: Бүгд
          </button>
          <button
            type="button"
            onClick={() => setAdding((current) => !current)}
            className="block w-full rounded px-3 py-2 text-left text-sm font-semibold text-[var(--accent-strong)] hover:bg-[var(--surface-muted)]"
          >
            + Өөр материал нэмэх
          </button>
          {adding ? (
            <div className="grid grid-cols-[1fr_auto] gap-2 border-b border-[var(--line)] px-2 py-2">
              <input
                value={customMaterial}
                onChange={(event) => setCustomMaterial(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    addCustomMaterial();
                  }
                }}
                placeholder="Материалын нэр..."
                className="input-shell h-9 w-full px-2 text-sm text-[var(--foreground)]"
              />
              <button
                type="button"
                onClick={addCustomMaterial}
                className="soft-chip h-9 justify-center px-3 text-xs font-semibold"
              >
                Нэмэх
              </button>
            </div>
          ) : null}
          {materials.map((material) => (
            <div
              key={material.id}
              className="grid grid-cols-[1fr_auto] items-center gap-1 px-1"
            >
              <button
                type="button"
                onClick={() => select(material.name)}
                className="rounded px-2 py-2 text-left text-sm text-[var(--foreground)] hover:bg-[var(--surface-muted)]"
              >
                {material.name}
              </button>
              <button
                type="button"
                onClick={() => onHide(material.id, material.name)}
                aria-label={`${material.name} хасах`}
                className="h-8 w-8 rounded text-lg font-semibold text-[var(--muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--foreground)]"
              >
                -
              </button>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
