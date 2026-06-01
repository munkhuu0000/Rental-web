"use client";

import { useParams, useSearchParams } from "next/navigation";
import { SectionHeader } from "@/app/components/menu/section-header";
import { directionLabel, RentalDirection } from "@/lib/rental-records";
import { MaterialRegistrationForm } from "./material-registration-form";
import { RentalCalculationTable } from "./rental-calculation-table";
import { RentalRecordsEditor } from "./rental-records-editor";
import { RentalSummaryCards } from "./rental-summary-cards";
import { totals } from "./rental-detail-utils";
import { useRentalDetailState } from "./use-rental-detail-state";

export default function RentalCustomerDetailPage() {
  const params = useParams<{ customerKey: string }>();
  const searchParams = useSearchParams();
  const customerKey = decodeURIComponent(params.customerKey ?? "");
  const selectedRentalDirection: RentalDirection =
    searchParams.get("direction") === "LEASE_IN" ? "LEASE_IN" : "LEASE_OUT";
  const state = useRentalDetailState(customerKey, selectedRentalDirection);

  return (
    <>
      <SectionHeader
        title={state.customerName}
        description={`${directionLabel(selectedRentalDirection)} тооцоо.`}
        action="Түрээс рүү буцах"
        actionHref="/rentals"
        actionIcon="arrowLeft"
      />
      <RentalSummaryCards summary={totals(state.customerRecords)} />
      <MaterialRegistrationForm
        visibleMaterials={state.visibleMaterials}
        selectedMaterialId={state.materialId}
        unitPrice={state.unitPrice}
        onMaterialChange={state.selectMaterial}
        onHideMaterial={state.hideMaterial}
        onUnitPriceChange={state.setUnitPrice}
        onSubmit={state.registerMaterial}
      />
      <RentalRecordsEditor
        records={state.customerRecords}
        onUpdate={state.updateRentalRecord}
      />
      <RentalCalculationTable records={state.customerRecords} />
    </>
  );
}
