"use client";

import { FormEvent, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { inviteEmployee } from "./actions";

type EmployeeInviteFormProps = {
  canInvite: boolean;
};

export function EmployeeInviteForm({ canInvite }: EmployeeInviteFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    position: "",
    permission: "FULL_ACCESS" as "FULL_ACCESS" | "QUANTITY_ONLY",
  });

  function updateField(name: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");

    startTransition(async () => {
      const result = await inviteEmployee(form);

      if (!result.ok) {
        setError(result.error);
        return;
      }

      setForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        position: "",
        permission: "FULL_ACCESS",
      });
      setMessage("Урилга илгээгдлээ.");
      router.refresh();
    });
  }

  if (!canInvite) {
    return null;
  }

  return (
    <section className="app-card mt-6 min-w-0 p-4 sm:p-6">
      <h2 className="text-2xl font-semibold tracking-[-0.04em]">
        Ажилтан урих
      </h2>
      <form onSubmit={handleSubmit} className="mt-5 grid gap-4">
        <div className="grid min-w-0 gap-4 md:grid-cols-2">
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
          <TextField
            label="И-мэйл"
            type="email"
            value={form.email}
            onChange={(value) => updateField("email", value)}
            required
          />
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
          <label className="block text-sm font-semibold">
            Эрх
            <select
              value={form.permission}
              onChange={(event) => updateField("permission", event.target.value)}
              className="mt-2 h-12 w-full min-w-0 rounded-xl border border-[var(--line-strong)] bg-white px-4 outline-none focus:border-[var(--accent)]"
            >
              <option value="FULL_ACCESS">Бүх эрх</option>
              <option value="QUANTITY_ONLY">Зөвхөн тоо хэмжээ харах</option>
            </select>
          </label>
        </div>

        {error && <p className="text-sm text-[var(--danger)]">{error}</p>}
        {message && <p className="text-sm text-[var(--muted)]">{message}</p>}

        <div className="flex justify-end border-t border-[var(--line)] pt-5">
          <button
            type="submit"
            disabled={isPending}
            className="action-button w-full disabled:opacity-60 sm:w-auto"
          >
            {isPending ? "Илгээж байна..." : "Урилга илгээх"}
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
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block text-sm font-semibold">
      {label}
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        className="mt-2 h-12 w-full min-w-0 rounded-xl border border-[var(--line-strong)] bg-white px-4 outline-none focus:border-[var(--accent)]"
      />
    </label>
  );
}
