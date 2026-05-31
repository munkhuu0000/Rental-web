"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SectionHeader } from "@/app/components/menu/section-header";
import { graphqlRequest } from "@/lib/graphql-client";

type Company = {
  id: string;
  name: string;
};

const COMPANIES_QUERY = `
  query Companies {
    companies {
      id
      name
    }
  }
`;

const CREATE_MATERIAL_MUTATION = `
  mutation CreateMaterial($input: CreateMaterialInput!) {
    createMaterial(input: $input) {
      id
      name
    }
  }
`;

const materialOptions = [
  "Хэв хашмал 600x1200", "Хэв хашмал 500x1200", "Хэв хашмал 450x1200",
  "Хэв хашмал 400x1200", "Хэв хашмал 300x1200", "Хэв хашмал 200x1200",
  "Дотор булан 100x100", "Дотор булан 100x150", "Дотор булан 100x200",
  "Дотор булан 150x150", "Дотор булан 200x200", "Гадна булан 2400",
  "Гадна булан 1200", "Тулаас V2", "Тулаас V4", "Тулаас V5", "Тулаас V6",
  "Турба хар", "Турба цагаан",
];

const unitOptions = [
  ["PCS", "Ширхэг"],
  ["M2", "м2"],
  ["M3", "м3"],
  ["TON", "Тонн"],
];

export default function NewMaterialPage() {
  const router = useRouter();
  const [ownerCompanyId, setOwnerCompanyId] = useState("");
  const [ownerCompanyName, setOwnerCompanyName] = useState("");
  const [materialChoice, setMaterialChoice] = useState(materialOptions[0]);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    graphqlRequest<{ companies: Company[] }>(COMPANIES_QUERY)
      .then((data) => {
        const company = data.companies[0];

        if (!company) {
          setError("Материал нэмэх компани олдсонгүй.");
          return;
        }

        setOwnerCompanyId(company.id);
        setOwnerCompanyName(company.name);
      })
      .catch((reason: Error) => setError(reason.message));
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");

    if (!ownerCompanyId) {
      setError("Материал нэмэх компани олдсонгүй.");
      setPending(false);
      return;
    }

    const form = new FormData(event.currentTarget);
    const customName = String(form.get("customName") || "").trim();
    const name = materialChoice === "custom" ? customName : materialChoice;

    if (!name) {
      setError("Материалын нэр оруулна уу.");
      setPending(false);
      return;
    }

    try {
      await graphqlRequest(CREATE_MATERIAL_MUTATION, {
        input: {
          ownerCompanyId,
          code: "",
          name,
          description: String(form.get("description") || ""),
          unit: String(form.get("unit")),
          defaultPrice: Number(form.get("defaultPrice")),
        },
      });

      router.push("/materials");
      router.refresh();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Материал нэмэхэд алдаа гарлаа");
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <SectionHeader
        title="Материал нэмэх"
        description="Сонголтоос материал сонгох эсвэл өөр материал бичиж хадгална."
      />

      <form onSubmit={onSubmit} className="app-card max-w-3xl p-6">
        {ownerCompanyName ? (
          <div className="mb-5 rounded-lg border border-[var(--line)] bg-[var(--surface-muted)] px-4 py-3 text-sm text-[var(--muted)]">
            Бүртгэлтэй компани: <span className="font-semibold text-[var(--foreground)]">{ownerCompanyName}</span>
          </div>
        ) : null}

        <div className="grid gap-5 md:grid-cols-2">
          <label className="block md:col-span-2">
            <span className="mb-2 block text-sm text-[var(--muted)]">Материал</span>
            <select
              name="materialChoice"
              required
              value={materialChoice}
              onChange={(event) => setMaterialChoice(event.target.value)}
              className="input-shell w-full"
            >
              {materialOptions.map((name) => <option key={name} value={name}>{name}</option>)}
              <option value="custom">Өөр материал</option>
            </select>
          </label>

          {materialChoice === "custom" ? (
            <label className="block md:col-span-2">
              <span className="mb-2 block text-sm text-[var(--muted)]">Өөр материалын нэр</span>
              <input name="customName" required className="input-shell w-full" placeholder="Материалын нэр" />
            </label>
          ) : null}

          <label className="block">
            <span className="mb-2 block text-sm text-[var(--muted)]">Нэгж</span>
            <select name="unit" required defaultValue="PCS" className="input-shell w-full">
              {unitOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm text-[var(--muted)]">Үнэ</span>
            <input name="defaultPrice" required type="number" min="0" className="input-shell w-full" placeholder="1200" />
          </label>

          <label className="block md:col-span-2">
            <span className="mb-2 block text-sm text-[var(--muted)]">Тайлбар</span>
            <textarea name="description" className="input-shell min-h-28 w-full py-3" placeholder="Нэмэлт мэдээлэл" />
          </label>
        </div>

        {error ? <p className="mt-5 text-sm text-[var(--danger)]">{error}</p> : null}

        <div className="mt-6 flex justify-end gap-3 border-t border-[var(--line)] pt-5">
          <button type="button" onClick={() => router.back()} className="soft-chip px-5 py-3 font-medium">
            Буцах
          </button>
          <button type="submit" disabled={pending} className="action-button disabled:opacity-60">
            {pending ? "Хадгалж байна..." : "Материал хадгалах"}
          </button>
        </div>
      </form>
    </>
  );
}
