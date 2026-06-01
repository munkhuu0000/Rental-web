"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { graphqlRequest } from "@/lib/graphql-client";
import type { Material } from "./material-types";

type Company = {
  id: string;
  name: string;
};

type MaterialMovementFormProps = {
  usedByOptions: string[];
  usedAtOptions: string[];
};

const NEW_MATERIAL_VALUE = "__new_material__";
const NEW_PERSON_VALUE = "__new_person__";
const NEW_PLACE_VALUE = "__new_place__";

const MOVEMENT_FORM_QUERY = `
  query MovementFormData {
    companies {
      id
      name
    }
    materials {
      id
      name
      unit
      defaultPrice
    }
  }
`;

const CREATE_MATERIAL_MUTATION = `
  mutation CreateMaterial($input: CreateMaterialInput!) {
    createMaterial(input: $input) {
      id
      name
      unit
      defaultPrice
    }
  }
`;

const CREATE_MOVEMENT_MUTATION = `
  mutation CreateRentalUsage($input: CreateRentalUsageInput!) {
    createRentalUsage(input: $input) { id }
  }
`;

const unitOptions = [
  ["PCS", "Ширхэг"],
  ["M2", "м2"],
  ["M3", "м3"],
  ["TON", "Тонн"],
];

function today() {
  return new Date().toISOString().slice(0, 10);
}

function accountName(user: ReturnType<typeof useUser>["user"]) {
  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(" ");
  return fullName || user?.primaryEmailAddress?.emailAddress || "";
}

export function MaterialMovementForm({
  usedByOptions,
  usedAtOptions,
}: MaterialMovementFormProps) {
  const { user } = useUser();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [ownerCompanyId, setOwnerCompanyId] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [materialId, setMaterialId] = useState("");
  const [usedByChoice, setUsedByChoice] = useState("");
  const [usedAtChoice, setUsedAtChoice] = useState("");
  const [unitPrice, setUnitPrice] = useState("0");

  useEffect(() => {
    graphqlRequest<{ companies: Company[]; materials: Material[] }>(
      MOVEMENT_FORM_QUERY,
    )
      .then((data) => {
        const firstMaterial = data.materials[0];
        const firstCompany = data.companies[0];

        setMaterials(data.materials);
        setOwnerCompanyId(firstCompany?.id ?? "");
        setMaterialId(firstMaterial?.id ?? NEW_MATERIAL_VALUE);
        setUnitPrice(String(firstMaterial?.defaultPrice ?? 0));
      })
      .catch((reason: Error) => setError(reason.message));
  }, []);

  const selectedMaterial = useMemo(
    () => materials.find((material) => material.id === materialId),
    [materialId, materials],
  );
  const isNewMaterial = materialId === NEW_MATERIAL_VALUE;
  const isNewPerson = usedByChoice === NEW_PERSON_VALUE;
  const isNewPlace = usedAtChoice === NEW_PLACE_VALUE;

  function onMaterialChange(nextMaterialId: string) {
    if (nextMaterialId === NEW_MATERIAL_VALUE) {
      setMaterialId(nextMaterialId);
      setUnitPrice("0");
      return;
    }

    const nextMaterial = materials.find(
      (material) => material.id === nextMaterialId,
    );
    setMaterialId(nextMaterialId);
    setUnitPrice(String(nextMaterial?.defaultPrice ?? 0));
  }

  async function createMaterialFromForm(form: FormData) {
    if (!ownerCompanyId) {
      throw new Error("Материал нэмэх компани олдсонгүй.");
    }

    const name = String(form.get("newMaterialName") || "").trim();

    if (!name) {
      throw new Error("Шинэ материалын нэр оруулна уу.");
    }

    const data = await graphqlRequest<{ createMaterial: Material }>(
      CREATE_MATERIAL_MUTATION,
      {
        input: {
          ownerCompanyId,
          code: "",
          name,
          description: "",
          unit: String(form.get("newMaterialUnit") || "PCS"),
          defaultPrice: Number(form.get("unitPrice") || 0),
        },
      },
    );

    setMaterials((current) => [...current, data.createMaterial]);
    return data.createMaterial;
  }

  function getUsedByFromForm(form: FormData) {
    const selectedUsedBy = String(form.get("usedBy") || "").trim();
    const newUsedBy = String(form.get("newUsedBy") || "").trim();

    if (selectedUsedBy !== NEW_PERSON_VALUE) {
      return selectedUsedBy;
    }

    if (!newUsedBy) {
      throw new Error("Шинэ хүлээн авсан хүний нэр оруулна уу.");
    }

    return newUsedBy;
  }

  function getUsedAtFromForm(form: FormData) {
    const selectedUsedAt = String(form.get("usedAt") || "").trim();
    const newUsedAt = String(form.get("newUsedAt") || "").trim();

    if (selectedUsedAt !== NEW_PLACE_VALUE) {
      return selectedUsedAt;
    }

    if (!newUsedAt) {
      throw new Error("Шинэ ашигласан газрын нэр оруулна уу.");
    }

    return newUsedAt;
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setPending(true);
    const form = new FormData(event.currentTarget);
    const movementDate = String(form.get("movementDate") || today());
    const registeredBy = accountName(user);

    try {
      const material = isNewMaterial
        ? await createMaterialFromForm(form)
        : selectedMaterial;

      if (!material) {
        throw new Error("Материал сонгоно уу.");
      }

      await graphqlRequest(CREATE_MOVEMENT_MUTATION, {
        input: {
          materialId: material.id,
          movementType: String(form.get("movementType")),
          movementDate,
          quantity: Number(form.get("quantity")),
          unit: material.unit,
          unitPrice: Number(form.get("unitPrice") || 0),
          startDate: movementDate,
          endDate: movementDate,
          usageDays: 1,
          notes: JSON.stringify({
            usedBy: getUsedByFromForm(form),
            usedAt: getUsedAtFromForm(form),
            registeredBy,
            registeredByEmail: user?.primaryEmailAddress?.emailAddress ?? "",
          }),
        },
      });
      window.location.reload();
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : "Бүртгэхэд алдаа гарлаа",
      );
      setPending(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="app-card border-l-4 border-l-[var(--accent)] p-4"
    >
      <div className="mb-3 flex items-center gap-2 text-[0.78rem] font-medium text-[var(--muted)]">
        <span className="font-semibold text-[var(--foreground)]">
          Шинэ гүйлгээ бүртгэх
        </span>
        <span>· орлого эсвэл зарлагa нэмэх</span>
      </div>

      <div className="grid w-full gap-2 lg:grid-cols-[1.1fr_1.7fr_0.8fr_0.9fr_1fr_1.45fr_1.45fr_auto]">
        <div>
          <span className="mb-1.5 block text-[0.68rem] font-semibold text-[var(--foreground)]">
            Төрөл
          </span>
          <div className="grid h-9 grid-cols-2 rounded-md border border-[var(--line)] bg-[#f8faf8] p-1">
            <label className="flex cursor-pointer items-center justify-center rounded text-[0.72rem] font-semibold has-[:checked]:bg-[var(--accent-soft)] has-[:checked]:text-[var(--accent)]">
              <input
                type="radio"
                name="movementType"
                value="RETURN"
                defaultChecked
                className="sr-only"
              />
              Орлого
            </label>
            <label className="flex cursor-pointer items-center justify-center rounded text-[0.72rem] font-semibold text-[var(--muted)] has-[:checked]:bg-white has-[:checked]:text-[var(--foreground)]">
              <input
                type="radio"
                name="movementType"
                value="OUT"
                className="sr-only"
              />
              Зарлага
            </label>
          </div>
        </div>

        <label className="block">
          <span className="mb-1.5 block text-[0.68rem] font-semibold text-[var(--foreground)]">
            Материал
          </span>
          <select
            value={materialId}
            onChange={(event) => onMaterialChange(event.target.value)}
            className="input-shell h-9 w-full"
          >
            {materials.map((material) => (
              <option key={material.id} value={material.id}>
                {material.name}
              </option>
            ))}
            <option value={NEW_MATERIAL_VALUE}>+ Шинэ материал</option>
          </select>
        </label>

        {isNewMaterial ? (
          <input
            name="newMaterialName"
            required
            placeholder="Шинэ материалын нэр"
            className="input-shell h-9 self-end lg:col-span-2"
          />
        ) : null}

        {isNewMaterial ? (
          <select
            name="newMaterialUnit"
            required
            defaultValue="PCS"
            className="input-shell h-9 self-end"
          >
            {unitOptions.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        ) : null}

        <label className="block">
          <span className="mb-1.5 block text-[0.68rem] font-semibold text-[var(--foreground)]">
            Тоо
          </span>
          <input
            name="quantity"
            type="number"
            min="0"
            step="1"
            required
            placeholder="0"
            className="input-shell h-9 w-full text-right"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-[0.68rem] font-semibold text-[var(--foreground)]">
            Нэгж үнэ (₮)
          </span>
          <input
            name="unitPrice"
            type="number"
            min="0"
            step="1"
            required
            value={unitPrice}
            onChange={(event) => setUnitPrice(event.target.value)}
            placeholder="0"
            className="input-shell h-9 w-full text-right"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-[0.68rem] font-semibold text-[var(--foreground)]">
            Огноо
          </span>
          <input
            name="movementDate"
            type="date"
            defaultValue={today()}
            className="input-shell h-9 w-full"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-[0.68rem] font-semibold text-[var(--foreground)]">
            Хүлээн авсан хүн
          </span>
          <select
            name="usedBy"
            value={usedByChoice}
            onChange={(event) => setUsedByChoice(event.target.value)}
            className="input-shell h-9 w-full"
          >
            <option value="">Сонгох...</option>
            {usedByOptions.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
            <option value={NEW_PERSON_VALUE}>+ Шинэ хүн</option>
          </select>
        </label>

        {isNewPerson ? (
          <input
            name="newUsedBy"
            required
            placeholder="Шинэ хүний нэр"
            className="input-shell h-9 self-end"
          />
        ) : null}

        <label className="block">
          <span className="mb-1.5 block text-[0.68rem] font-semibold text-[var(--foreground)]">
            Хаана ашигласан
          </span>
          <select
            name="usedAt"
            value={usedAtChoice}
            onChange={(event) => setUsedAtChoice(event.target.value)}
            className="input-shell h-9 w-full"
          >
            <option value="">Сонгох...</option>
            {usedAtOptions.map((place) => (
              <option key={place} value={place}>
                {place}
              </option>
            ))}
            <option value={NEW_PLACE_VALUE}>+ Шинэ объект</option>
          </select>
        </label>

        {isNewPlace ? (
          <input
            name="newUsedAt"
            required
            placeholder="Шинэ объект"
            className="input-shell h-9 self-end"
          />
        ) : null}

        <button
          type="submit"
          disabled={pending}
          className="action-button mt-auto h-9 px-4 disabled:opacity-60"
        >
          {pending ? "Бүртгэж байна..." : "+ Бүртгэх"}
        </button>
      </div>

      {error ? (
        <p className="mt-3 text-sm text-[var(--danger)]">{error}</p>
      ) : null}
    </form>
  );
}
