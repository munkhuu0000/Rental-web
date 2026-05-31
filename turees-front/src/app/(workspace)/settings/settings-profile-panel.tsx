"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { graphqlRequest } from "@/lib/graphql-client";
import { fileToCompactLogoDataUrl } from "@/lib/image-data-url";

type SettingsUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string | null;
  company: {
    id: string;
    name: string;
    registerNumber: string;
    phone: string;
    email: string;
    address: string | null;
    logoUrl: string | null;
  };
};

type FormState = {
  firstName: string;
  lastName: string;
  phone: string;
  position: string;
  companyName: string;
  companyRegister: string;
  companyPhone: string;
  companyEmail: string;
  companyAddress: string;
  companyLogo: string;
};

export function SettingsProfilePanel({ user }: { user: SettingsUser }) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<FormState>(() => toFormState(user));

  const companyInitial = useMemo(() => {
    const trimmed = form.companyName.trim();
    return trimmed ? trimmed[0].toLocaleUpperCase("mn-MN") : "Т";
  }, [form.companyName]);

  function updateField(name: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleLogoChange(file: File | null) {
    if (!file) {
      updateField("companyLogo", "");
      return;
    }

    try {
      setError("");
      updateField("companyLogo", await fileToCompactLogoDataUrl(file));
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Лого зураг боловсруулахад алдаа гарлаа.",
      );
      updateField("companyLogo", "");
    }
  }

  function cancelEdit() {
    setError("");
    setForm(toFormState(user));
    setIsEditing(false);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await graphqlRequest(
        `
          mutation UpdateSettingsCompany($id: ID!, $input: UpdateCompanyInput!) {
            updateCompany(id: $id, input: $input) {
              id
            }
          }
        `,
        {
          id: user.company.id,
          input: {
            name: user.company.name,
            registerNumber: user.company.registerNumber,
            logoUrl: form.companyLogo || null,
            phone: form.companyPhone,
            email: form.companyEmail,
            address: form.companyAddress || null,
          },
        },
      );

      await graphqlRequest(
        `
          mutation UpdateSettingsUser($id: ID!, $input: UpdateUserInput!) {
            updateUser(id: $id, input: $input) {
              id
            }
          }
        `,
        {
          id: user.id,
          input: {
            firstName: form.firstName,
            lastName: form.lastName,
            phone: form.phone,
            position: form.position || null,
          },
        },
      );

      setIsEditing(false);
      window.dispatchEvent(new Event("registered-user-updated"));
      router.refresh();
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Мэдээлэл шинэчлэх үед алдаа гарлаа.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!isEditing) {
    return (
      <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)]">
        <section className="app-card min-w-0 p-4 sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <h2 className="text-2xl font-semibold tracking-[-0.04em]">
                Компанийн мэдээлэл
              </h2>
            </div>
            <CompanyMark
              initial={companyInitial}
              logoUrl={user.company.logoUrl}
            />
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <InfoField label="Компанийн нэр" value={form.companyName} />
            <InfoField
              label="Регистрийн дугаар"
              value={form.companyRegister}
            />
            <InfoField label="Утас" value={form.companyPhone} />
            <InfoField label="И-мэйл" value={form.companyEmail} />
          </div>
          <InfoField label="Хаяг" value={form.companyAddress} className="mt-5" />
          <div className="mt-5 flex flex-col gap-4 border-t border-[var(--line)] pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-[var(--muted)]">
              Компанийн нэр болон регистрийг нэг удаа бүртгэсний дараа өөрчлөх боломжгүй.
            </p>
            <button
              type="button"
              className="action-button w-full shrink-0 sm:w-auto"
              onClick={() => setIsEditing(true)}
            >
              Мэдээлэл шинэчлэх
            </button>
          </div>
        </section>

        <section className="app-card min-w-0 p-4 sm:p-6">
          <h2 className="text-2xl font-semibold tracking-[-0.04em]">
            Хэрэглэгчийн мэдээлэл
          </h2>
          <div className="mt-6 space-y-5">
            <InfoField label="Нэр" value={`${form.firstName} ${form.lastName}`} />
            <InfoField label="И-мэйл" value={user.email} />
            <InfoField label="Утас" value={form.phone} />
            <InfoField label="Албан тушаал" value={form.position} />
          </div>
        </section>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="app-card min-w-0 p-4 sm:p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-2xl font-semibold tracking-[-0.04em]">
            Мэдээлэл шинэчлэх
          </h2>
          <p className="mt-2 max-w-[560px] text-sm text-[var(--muted)]">
            Зассан мэдээлэл зөвхөн хадгалах товч дарсны дараа backend-д шинэчлэгдэнэ.
          </p>
        </div>
        <CompanyMark initial={companyInitial} logoUrl={form.companyLogo} />
      </div>

      <div className="mt-6 grid gap-6">
        <div>
          <h3 className="text-lg font-semibold">Хэрэглэгчийн мэдээлэл</h3>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <TextField
              label="Нэр"
              value={form.firstName}
              onChange={(value) => updateField("firstName", value)}
              required
            />
            <TextField
              label="Овог"
              value={form.lastName}
              onChange={(value) => updateField("lastName", value)}
              required
            />
            <TextField label="И-мэйл" value={user.email} disabled />
            <TextField
              label="Утас"
              value={form.phone}
              onChange={(value) => updateField("phone", value)}
              required
            />
            <TextField
              label="Албан тушаал"
              value={form.position}
              onChange={(value) => updateField("position", value)}
            />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold">Компанийн мэдээлэл</h3>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Компанийн нэр болон регистр өөрчлөгдөхгүй.
          </p>
          <div className="mt-4 flex flex-col gap-4 rounded-2xl border border-[var(--line)] bg-[var(--surface-muted)] p-4 sm:flex-row sm:items-center">
            <CompanyMark initial={companyInitial} logoUrl={form.companyLogo} />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">Компанийн лого</p>
              <p className="mt-1 text-sm text-[var(--muted)]">
                Sidebar болон компанийн мэдээлэл дээр харагдана.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <label className="inline-flex min-h-10 cursor-pointer items-center justify-center rounded-xl border border-[var(--line-strong)] bg-white px-4 text-sm font-semibold">
                  Лого сонгох
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(event) => handleLogoChange(event.target.files?.[0] ?? null)}
                  />
                </label>
                {form.companyLogo ? (
                  <button
                    type="button"
                    onClick={() => updateField("companyLogo", "")}
                    className="min-h-10 rounded-xl border border-[var(--line)] px-4 text-sm font-semibold"
                  >
                    Лого устгах
                  </button>
                ) : null}
              </div>
            </div>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <TextField label="Компанийн нэр" value={form.companyName} disabled />
            <TextField label="Регистр" value={form.companyRegister} disabled />
            <TextField
              label="Утас"
              value={form.companyPhone}
              onChange={(value) => updateField("companyPhone", value)}
              required
            />
            <TextField
              label="И-мэйл"
              value={form.companyEmail}
              onChange={(value) => updateField("companyEmail", value)}
              required
            />
            <label className="block text-sm font-semibold md:col-span-2">
              Хаяг
              <textarea
                value={form.companyAddress}
                onChange={(event) =>
                  updateField("companyAddress", event.target.value)
                }
                className="mt-2 min-h-24 w-full resize-none rounded-xl border border-[var(--line-strong)] bg-white px-4 py-3 outline-none focus:border-[var(--accent)]"
              />
            </label>
          </div>
        </div>

        {error && <p className="text-sm text-[var(--danger)]">{error}</p>}

        <div className="flex flex-col-reverse gap-3 border-t border-[var(--line)] pt-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={cancelEdit}
            className="min-h-11 w-full rounded-full border border-[var(--line-strong)] px-5 py-3 text-sm font-semibold sm:w-auto"
          >
            Болих
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="action-button w-full disabled:opacity-60 sm:w-auto"
          >
            {isSubmitting ? "Хадгалж байна..." : "Мэдээлэл хадгалах"}
          </button>
        </div>
      </div>
    </form>
  );
}

function toFormState(user: SettingsUser): FormState {
  return {
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone,
    position: user.position ?? "",
    companyName: user.company.name,
    companyRegister: user.company.registerNumber,
    companyPhone: user.company.phone,
    companyEmail: user.company.email,
    companyAddress: user.company.address ?? "",
    companyLogo: user.company.logoUrl ?? "",
  };
}

function TextField({
  label,
  value,
  onChange,
  required = false,
  disabled = false,
}: {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
}) {
  return (
    <label className="block text-sm font-semibold">
      {label}
      <input
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        required={required}
        disabled={disabled}
        className="mt-2 h-12 w-full rounded-xl border border-[var(--line-strong)] bg-white px-4 outline-none focus:border-[var(--accent)] disabled:bg-[var(--surface-muted)]"
      />
    </label>
  );
}

function InfoField({
  label,
  value,
  className = "",
}: {
  label: string;
  value?: string | null;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-sm text-[var(--muted)]">{label}</span>
      <div className="input-shell min-h-12 min-w-0 break-words">{value || "-"}</div>
    </label>
  );
}

function CompanyMark({
  initial,
  logoUrl,
}: {
  initial: string;
  logoUrl?: string | null;
}) {
  return (
    <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[var(--accent)] text-3xl font-black text-white">
      {logoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={logoUrl} alt="" className="h-full w-full object-cover" />
      ) : (
        initial
      )}
    </div>
  );
}
