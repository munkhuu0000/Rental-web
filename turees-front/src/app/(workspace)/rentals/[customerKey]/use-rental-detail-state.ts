import { useEffect, useMemo, useState } from "react";
import { graphqlRequest } from "@/lib/graphql-client";
import {
  accountingParty,
  accountingPartyKey,
  CompanyOption,
  loadRentalCompanies,
  loadRentalRecords,
  RentalDirection,
  RentalMovementType,
  RentalRecord,
  saveRentalRecords,
} from "@/lib/rental-records";
import {
  backendRecord,
  loadHiddenMaterialIds,
  NEW_MATERIAL_VALUE,
  RentalDetailData,
  saveHiddenMaterialIds,
} from "./rental-detail-utils";
import { defaultRentalMaterials, mergeRentalMaterials } from "./default-rental-materials";
import { RENTAL_DETAIL_QUERY } from "./rental-detail-query";

const emptyRentalDetailData: RentalDetailData = {
  companies: [],
  materials: defaultRentalMaterials,
  masterContracts: [],
  rentalUsages: [],
};

export function useRentalDetailState(
  customerKey: string,
  selectedRentalDirection: RentalDirection,
) {
  const [localRecords, setLocalRecords] = useState<RentalRecord[]>([]);
  const [localCompanies, setLocalCompanies] = useState<CompanyOption[]>([]);
  const [hiddenMaterialIds, setHiddenMaterialIds] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [materialId, setMaterialId] = useState(defaultRentalMaterials[0]?.id ?? NEW_MATERIAL_VALUE);
  const [unitPrice, setUnitPrice] = useState("0");
  const [backendData, setBackendData] = useState<RentalDetailData>(emptyRentalDetailData);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setLocalRecords(loadRentalRecords());
      setLocalCompanies(loadRentalCompanies());
      setHiddenMaterialIds(loadHiddenMaterialIds());
      setHydrated(true);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (hydrated) {
      saveRentalRecords(localRecords);
    }
  }, [hydrated, localRecords]);

  useEffect(() => {
    if (hydrated) {
      saveHiddenMaterialIds(hiddenMaterialIds);
    }
  }, [hiddenMaterialIds, hydrated]);

  useEffect(() => {
    graphqlRequest<RentalDetailData>(RENTAL_DETAIL_QUERY)
      .then((data) => {
        const nextData = { ...data, materials: mergeRentalMaterials(data.materials) };
        const hiddenIds = loadHiddenMaterialIds();
        const firstMaterial = nextData.materials.find((material) => !hiddenIds.includes(material.id));
        setBackendData(nextData);
        setMaterialId(firstMaterial?.id ?? NEW_MATERIAL_VALUE);
        setUnitPrice(String(firstMaterial?.defaultPrice ?? 0));
      })
      .catch(() => setBackendData(emptyRentalDetailData));
  }, []);

  const records = useMemo(() => {
    const contractById = new Map(
      backendData.masterContracts.map((contract) => [contract.id, contract]),
    );
    return [
      ...backendData.rentalUsages.map((usage) =>
        backendRecord(usage, contractById),
      ),
      ...localRecords,
    ];
  }, [backendData, localRecords]);

  const customerRecords = useMemo(
    () =>
      records
        .filter((record) => accountingPartyKey(record) === customerKey)
        .sort(
          (a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id),
        ),
    [customerKey, records],
  );
  const customer = [...backendData.companies, ...localCompanies].find(
    (company) => company.id === customerKey,
  );
  const customerName = customerRecords[0]
    ? accountingParty(customerRecords[0])
    : customer?.name || "Харилцагч";
  const visibleMaterials = backendData.materials.filter(
    (material) => !hiddenMaterialIds.includes(material.id),
  );
  const selectedMaterial = backendData.materials.find((material) => material.id === materialId);

  function selectMaterial(nextMaterialId: string, source = backendData.materials) {
    setMaterialId(nextMaterialId);
    const material = source.find((item) => item.id === nextMaterialId);
    const nextPrice = nextMaterialId === NEW_MATERIAL_VALUE ? "0" : String(material?.defaultPrice ?? 0);
    setUnitPrice(nextPrice);
  }

  function hideMaterial(nextMaterialId: string) {
    setHiddenMaterialIds((current) =>
      current.includes(nextMaterialId) ? current : [...current, nextMaterialId],
    );

    const nextMaterial = visibleMaterials.find((m) => m.id !== nextMaterialId);
    selectMaterial(nextMaterial?.id ?? NEW_MATERIAL_VALUE);
  }

  function registerMaterial(form: FormData, movementType: RentalMovementType) {
    const material =
      materialId === NEW_MATERIAL_VALUE
        ? String(form.get("newMaterialName") || "").trim()
        : selectedMaterial?.name || "";
    const date = String(form.get("date") || "").trim();
    const quantity = Number(form.get("quantity") || 0);

    if (!material || !date || quantity <= 0) {
      return;
    }

    setLocalRecords((current) => [
      {
        id: `local-${Date.now()}`,
        direction: selectedRentalDirection,
        movementType,
        date,
        party: customerName,
        companyId: customerKey,
        companyName: customerName,
        material,
        quantity,
        returned: 0,
        unitPrice: Math.max(0, Number(form.get("unitPrice") || 0)),
        durationDays: 1,
        note: String(form.get("note") || "").trim(),
      },
      ...current,
    ]);
    selectMaterial(visibleMaterials[0]?.id ?? NEW_MATERIAL_VALUE);
  }

  function updateRentalRecord(nextRecord: RentalRecord) {
    setLocalRecords((current) =>
      current.map((record) => record.id === nextRecord.id ? nextRecord : record),
    );
  }

  return {
    customerName,
    customerRecords,
    hideMaterial,
    materialId,
    registerMaterial,
    selectMaterial,
    setUnitPrice,
    unitPrice,
    updateRentalRecord,
    visibleMaterials,
  };
}
