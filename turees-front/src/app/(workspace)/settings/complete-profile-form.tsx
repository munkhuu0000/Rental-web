"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { graphqlRequest } from "@/lib/graphql-client";
import { fileToCompactLogoDataUrl } from "@/lib/image-data-url";

type CompleteProfileFormProps = {
  initialEmail: string;
  initialFirstName: string;
  initialLastName: string;
};

type FormState = {
  firstName: string;
  lastName: string;
  phone: string;
  position: string;
  companyName: string;
  companyRegister: string;
  companyAddress: string;
  companyLogo: string;
};

export function CompleteProfileForm({
  initialEmail,
  initialFirstName,
  initialLastName,
}: CompleteProfileFormProps) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<FormState>({
    firstName: initialFirstName,
    lastName: initialLastName,
    phone: "",
    position: "",
    companyName: "",
    companyRegister: "",
    companyAddress: "",
    companyLogo: "",
  });

  const companyInitial = useMemo(() => {
    const trimmed = form.companyName.trim();
    return trimmed ? trimmed[0].toLocaleUpperCase("mn-MN") : "Т";
  }, [form.companyName]);

  function updateField(name: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleLogoChange(file?: File) {
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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const companyData = await graphqlRequest<{
        createCompany: { id: string };
      }>(
        `
          mutation CreateMissingCompany($input: CreateCompanyInput!) {
            createCompany(input: $input) {
              id
            }
          }
        `,
        {
          input: {
            name: form.companyName,
            registerNumber: form.companyRegister,
            logoUrl: form.companyLogo || null,
            phone: form.phone,
            email: initialEmail,
            address: form.companyAddress || null,
          },
        },
      );

      await graphqlRequest(
        `
          mutation CreateMissingUser($input: CreateUserInput!) {
            createUser(input: $input) {
              id
            }
          }
        `,
        {
          input: {
            companyId: companyData.createCompany.id,
            firstName: form.firstName,
            lastName: form.lastName,
            email: initialEmail,
            phone: form.phone,
            position: form.position || null,
            permission: "FULL_ACCESS",
            isCompanyOwner: true,
          },
        },
      );

      router.refresh();
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Мэдээлэл хадгалах үед алдаа гарлаа.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="app-card min-w-0 p-4 sm:p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-2xl font-semibold tracking-[-0.04em]">
            Мэдээллээ нөхөж оруулах
          </h2>
          <p className="mt-2 max-w-[560px] text-[var(--muted)]">
            Таны бүртгэл Clerk дээр үүссэн боловч backend-д хэрэглэгч болон
            компанийн мэдээлэл хадгалагдаагүй байна.
          </p>
        </div>
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[var(--accent)] text-3xl font-black text-white">
          {form.companyLogo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={form.companyLogo}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            companyInitial
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-6">
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
            <TextField label="И-мэйл" value={initialEmail} disabled />
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
            Компанийн нэр болон регистр хадгалсны дараа өөрчлөх боломжгүй.
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <TextField
              label="Компанийн нэр"
              value={form.companyName}
              onChange={(value) => updateField("companyName", value)}
              required
            />
            <TextField
              label="Регистр"
              value={form.companyRegister}
              onChange={(value) => updateField("companyRegister", value)}
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
            <label className="block text-sm font-semibold md:col-span-2">
              Компанийн лого /заавал биш/
              <input
                type="file"
                accept="image/*"
                onChange={(event) => handleLogoChange(event.target.files?.[0])}
                className="mt-2 block w-full rounded-xl border border-[var(--line-strong)] bg-white px-4 py-3 text-sm"
              />
            </label>
          </div>
        </div>

        {error && <p className="text-sm text-[var(--danger)]">{error}</p>}

        <div className="flex justify-end border-t border-[var(--line)] pt-5">
          <button
            type="submit"
            disabled={isSubmitting}
            className="action-button w-full disabled:opacity-60 sm:w-auto"
          >
            {isSubmitting ? "Хадгалж байна..." : "Мэдээлэл хадгалах"}
          </button>
        </div>
      </form>
    </section>
  );
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
        className="mt-2 h-12 w-full min-w-0 rounded-xl border border-[var(--line-strong)] bg-white px-4 outline-none focus:border-[var(--accent)] disabled:bg-[var(--surface-muted)]"
      />
    </label>
  );
}
