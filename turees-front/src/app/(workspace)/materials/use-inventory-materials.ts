"use client";

import { useEffect, useState } from "react";
import { graphqlRequest } from "@/lib/graphql-client";
import type {
  InventoryMaterial,
  MasterContract,
  Material,
  MaterialMovement,
} from "./material-types";
import { fallbackMaterials, sortMovements } from "./material-utils";

const MATERIALS_INVENTORY_QUERY = `
  query MaterialsInventory {
    materials {
      id
      name
      unit
      defaultPrice
    }
    rentalUsages {
      id
      contractId
      materialId
      movementType
      movementDate
      quantity
      unit
      unitPrice
      lineTotal
      createdAt
      notes
    }
    masterContracts {
      id
      notes
      renterCompany {
        name
      }
    }
  }
`;

function parseMovementNotes(notes?: string | null) {
  if (!notes) {
    return { usedBy: "", usedAt: "", registeredBy: "", registeredByEmail: "" };
  }

  try {
    const parsed = JSON.parse(notes) as {
      usedBy?: string;
      usedAt?: string;
      registeredBy?: string;
      registeredByEmail?: string;
    };
    return {
      usedBy: parsed.usedBy ?? "",
      usedAt: parsed.usedAt ?? "",
      registeredBy: parsed.registeredBy ?? "",
      registeredByEmail: parsed.registeredByEmail ?? "",
    };
  } catch {
    return { usedBy: "", usedAt: notes, registeredBy: "", registeredByEmail: "" };
  }
}

function groupMovements(
  movements: MaterialMovement[],
  contractsById: Map<string, MasterContract>,
) {
  return movements.reduce<
    Record<string, { income: MaterialMovement[]; expense: MaterialMovement[] }>
  >((groups, movement) => {
    const contract = movement.contractId
      ? contractsById.get(movement.contractId)
      : undefined;
    const group = groups[movement.materialId] ?? { income: [], expense: [] };
    const noteDetails = parseMovementNotes(movement.notes);
    const enrichedMovement: MaterialMovement = {
      ...movement,
      usedBy: noteDetails.usedBy || contract?.renterCompany?.name || "",
      usedAt: noteDetails.usedAt || contract?.notes || "",
      registeredBy: noteDetails.registeredBy,
      registeredByEmail: noteDetails.registeredByEmail,
    };

    if (movement.movementType === "RETURN") {
      group.income.push(enrichedMovement);
    } else {
      group.expense.push(enrichedMovement);
    }

    groups[movement.materialId] = group;
    return groups;
  }, {});
}

function mapMaterials(
  materials: Material[],
  movementGroups: Record<
    string,
    { income: MaterialMovement[]; expense: MaterialMovement[] }
  >,
) {
  return materials.map((material) => ({
    ...material,
    income: sortMovements(movementGroups[material.id]?.income ?? []),
    expense: sortMovements(movementGroups[material.id]?.expense ?? []),
  }));
}

export function useInventoryMaterials() {
  const [materials, setMaterials] = useState<InventoryMaterial[] | null>(null);

  useEffect(() => {
    graphqlRequest<{
      materials: Material[];
      rentalUsages: MaterialMovement[];
      masterContracts: MasterContract[];
    }>(MATERIALS_INVENTORY_QUERY)
      .then((data) => {
        const contractsById = new Map(
          data.masterContracts.map((contract) => [contract.id, contract]),
        );
        const movementGroups = groupMovements(data.rentalUsages, contractsById);

        setMaterials(mapMaterials(data.materials, movementGroups));
      })
      .catch(() => setMaterials(fallbackMaterials()));
  }, []);

  return materials;
}
