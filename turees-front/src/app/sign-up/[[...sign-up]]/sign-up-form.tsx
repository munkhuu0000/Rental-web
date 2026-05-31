"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useSignUp, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { graphqlRequest } from "@/lib/graphql-client";
import { fileToCompactLogoDataUrl } from "@/lib/image-data-url";

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  position: string;
  companyName: string;
  companyRegister: string;
  companyAddress: string;
  companyLogo: string;
};

type InvitationCompany = {
  name: string;
  registerNumber: string;
  phone: string;
  email: string;
  address: string | null;
  logoUrl: string | null;
};

const initialForm: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  phone: "",
  position: "",
  companyName: "",
  companyRegister: "",
  companyAddress: "",
  companyLogo: "",
};

export function SignUpForm() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { fetchStatus, signUp } = useSignUp();
  const { isLoaded: isUserLoaded, isSignedIn } = useUser();
  const [form, setForm] = useState(initialForm);
  const [invitationCompany, setInvitationCompany] =
    useState<InvitationCompany | null>(null);
  const [code, setCode] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResendingCode, setIsResendingCode] = useState(false);
  const invitationTicket = searchParams.get("__clerk_ticket");
  const invitationCompanyId =
    searchParams.get("company_id") ?? getInviteCompanyId(pathname);

  const companyInitial = useMemo(() => {
    const trimmed = (form.companyName ?? "").trim();
    return trimmed ? trimmed[0].toLocaleUpperCase("mn-MN") : "Т";
  }, [form.companyName]);

  useEffect(() => {
    if (isUserLoaded && isSignedIn) {
      router.replace("/dashboard");
    }
  }, [isUserLoaded, isSignedIn, router]);

  useEffect(() => {
    if (!invitationTicket || !invitationCompanyId) {
      return;
    }

    let isActive = true;

    graphqlRequest<{ company: InvitationCompany | null }>(
      `
        query InvitationCompany($id: ID!) {
          company(id: $id) {
            name
            registerNumber
            phone
            email
            address
            logoUrl
          }
        }
      `,
      { id: invitationCompanyId },
    )
      .then((data) => {
        if (isActive) {
          setInvitationCompany(data.company);
        }
      })
      .catch(() => {
        if (isActive) {
          setInvitationCompany(null);
        }
      });

    return () => {
      isActive = false;
    };
  }, [invitationTicket, invitationCompanyId]);

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

    if (isSignedIn) {
      router.replace("/dashboard");
      return;
    }

    if (!signUp) {
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const createResult = await signUp.create({
        emailAddress: form.email,
        password: form.password,
        firstName: form.firstName,
        lastName: form.lastName,
        unsafeMetadata: {
          phone: form.phone,
          position: form.position,
          company: {
            name: form.companyName,
            register: form.companyRegister,
            address: form.companyAddress,
          },
        },
      });

      if (createResult.error) {
        setError(getClerkError(createResult.error));
        return;
      }

      const codeResult = signUp.verifications.emailAddress.status === "unverified"
        ? await signUp.verifications.sendEmailCode()
        : { error: null };

      if (codeResult.error) {
        setError(getClerkError(codeResult.error));
        return;
      }

      setPendingVerification(true);
    } catch (cause) {
      setError(getClerkError(cause));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleInvitationSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!signUp || !invitationTicket) {
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const result = await signUp.ticket({
        firstName: form.firstName,
        lastName: form.lastName,
        unsafeMetadata: {
          companyId: invitationCompanyId,
        },
        ticket: invitationTicket,
      });

      if (result.error) {
        setError(getClerkError(result.error));
        return;
      }

      if (signUp.missingFields.includes("password")) {
        if (!form.password) {
          setError("Нууц үгээ оруулна уу.");
          return;
        }

        const passwordResult = await signUp.password({
          firstName: form.firstName,
          lastName: form.lastName,
          password: form.password,
        });

        if (passwordResult.error) {
          setError(getClerkError(passwordResult.error));
          return;
        }
      }

      if (signUp.status === "complete") {
        const finalizeResult = await signUp.finalize();

        if (finalizeResult.error) {
          setError(getClerkError(finalizeResult.error));
          return;
        }

        router.push("/dashboard");
        return;
      }

      setError("Урилга баталгаажуулалт дуусаагүй байна.");
    } catch (cause) {
      setError(getClerkError(cause));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleVerify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!signUp) {
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const verifyResult = await signUp.verifications.verifyEmailCode({
        code,
      });

      if (verifyResult.error) {
        setError(getClerkError(verifyResult.error));
        return;
      }

      if (signUp.status === "complete") {
        await syncSignupToBackend(form);

        const finalizeResult = await signUp.finalize();

        if (finalizeResult.error) {
          setError(getClerkError(finalizeResult.error));
          return;
        }

        router.push("/dashboard");
        return;
      }

      setError("Баталгаажуулалт дуусаагүй байна. Кодоо дахин шалгана уу.");
    } catch (cause) {
      setError(getClerkError(cause));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleResendCode() {
    if (!signUp) {
      return;
    }

    setError("");
    setIsResendingCode(true);

    try {
      if (signUp.verifications.emailAddress.status !== "unverified") {
        setError("Энэ имэйл дээр дахин код илгээх боломжгүй байна.");
        return;
      }

      const codeResult = await signUp.verifications.sendEmailCode();

      if (codeResult.error) {
        setError(getClerkError(codeResult.error));
      }
    } catch (cause) {
      setError(getClerkError(cause));
    } finally {
      setIsResendingCode(false);
    }
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,#dfffd7_0%,#d9f8ea_48%,#d7f2ff_100%)] px-4 py-8 text-[#073b44]">
      <section className="mx-auto grid max-w-[1180px] gap-7 lg:grid-cols-[0.72fr_1.28fr]">
        <aside className="flex flex-col justify-between rounded-2xl border border-[#9dd5c4] bg-white/70 p-7">
          <div>
            <Link href="/" className="flex w-fit items-center gap-4">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#7de85e] text-3xl font-black">
                Т
              </span>
              <span className="text-3xl font-black">Түрээс</span>
            </Link>
            {invitationTicket ? (
              <InvitationCompanyInfo company={invitationCompany} />
            ) : (
              <>
                <h1 className="mt-10 text-4xl font-bold leading-tight">
              Байгууллагын бүртгэл үүсгэх
            </h1>
            <p className="mt-4 max-w-[420px] text-base leading-7 text-[#5f7d7b]">
              Хэрэглэгчийн мэдээлэл болон компанийн мэдээллээ оруулаад ажлын
              талбараа нээнэ.
                </p>
              </>
            )}
          </div>

          {!invitationTicket ? (
          <div className="mt-10 flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl bg-[#073b44] text-4xl font-black text-white">
            {form.companyLogo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={form.companyLogo}
                alt="Компанийн лого"
                className="h-full w-full object-cover"
              />
            ) : (
              companyInitial
            )}
          </div>
          ) : null}
        </aside>

        <section className="rounded-2xl border border-[#9dd5c4] bg-white/90 p-5 shadow-[0_18px_45px_rgba(7,59,68,0.10)] md:p-7">
          {invitationTicket ? (
            <form
              onSubmit={handleInvitationSubmit}
              className="mx-auto max-w-[620px] py-8"
            >
              <h2 className="text-2xl font-bold">Урилга баталгаажуулах</h2>
              <p className="mt-3 text-sm leading-6 text-[#5f7d7b]">
                Компанийн урилгыг баталгаажуулаад ажлын талбар руу орно.
              </p>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
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
              </div>
                <TextField
                  label="Нууц үг"
                  type="password"
                  value={form.password}
                  onChange={(value) => updateField("password", value)}
                  minLength={8}
                  required
                />
              <div id="clerk-captcha" className="mt-4 min-h-16" />
              {error && <p className="mt-4 text-sm text-[#d8665f]">{error}</p>}
              <button
                type="submit"
                disabled={isSubmitting || fetchStatus === "fetching"}
                className="mt-6 flex h-12 w-full items-center justify-center rounded-xl bg-[#073b44] px-5 font-bold text-white disabled:opacity-60"
              >
                {isSubmitting ? "Баталгаажуулж байна..." : "Урилга зөвшөөрөх"}
              </button>
            </form>
          ) : pendingVerification ? (
            <form onSubmit={handleVerify} className="mx-auto max-w-[520px] py-8">
              <h2 className="text-2xl font-bold">Имэйлээ баталгаажуулна уу</h2>
              <p className="mt-3 text-sm leading-6 text-[#5f7d7b]">
                {form.email} хаяг руу илгээсэн кодыг оруулна уу.
              </p>
              <label className="mt-6 block text-sm font-semibold">
                Баталгаажуулах код
                <input
                  value={code}
                  onChange={(event) => setCode(event.target.value)}
                  className="mt-2 h-12 w-full rounded-xl border border-[#9dd5c4] bg-white px-4 outline-none focus:border-[#073b44]"
                  required
                />
              </label>
              {error && <p className="mt-4 text-sm text-[#d8665f]">{error}</p>}
              <button
                type="submit"
                disabled={isSubmitting || fetchStatus === "fetching"}
                className="mt-6 flex h-12 w-full items-center justify-center rounded-xl bg-[#073b44] px-5 font-bold text-white disabled:opacity-60"
              >
                {isSubmitting ? "Шалгаж байна..." : "Баталгаажуулах"}
              </button>
              <button
                type="button"
                onClick={handleResendCode}
                disabled={isResendingCode || fetchStatus === "fetching"}
                className="mt-3 flex h-11 w-full items-center justify-center rounded-xl border border-[#9dd5c4] bg-white px-5 font-semibold text-[#073b44] disabled:opacity-60"
              >
                {isResendingCode ? "Илгээж байна..." : "Код дахин авах"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="grid gap-6">
              <div>
                <h2 className="text-2xl font-bold">Хэрэглэгчийн мэдээлэл</h2>
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
                  <TextField
                    label="Имэйл"
                    type="email"
                    value={form.email}
                    onChange={(value) => updateField("email", value)}
                    required
                  />
                  <TextField
                    label="Утас"
                    type="tel"
                    value={form.phone}
                    onChange={(value) => updateField("phone", value)}
                    required
                  />
                  <TextField
                    label="Албан тушаал"
                    value={form.position}
                    onChange={(value) => updateField("position", value)}
                  />
                  <TextField
                    label="Нууц үг"
                    type="password"
                    value={form.password}
                    onChange={(value) => updateField("password", value)}
                    minLength={8}
                    required
                  />
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold">Компанийн мэдээлэл</h2>
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
                  />
                  <label className="block text-sm font-semibold md:col-span-2">
                    Хаяг
                    <textarea
                      value={form.companyAddress ?? ""}
                      onChange={(event) =>
                        updateField("companyAddress", event.target.value)
                      }
                      className="mt-2 min-h-24 w-full resize-none rounded-xl border border-[#9dd5c4] bg-white px-4 py-3 outline-none focus:border-[#073b44]"
                    />
                  </label>
                  <label className="block text-sm font-semibold md:col-span-2">
                    Компанийн лого /заавал биш/
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(event) =>
                        handleLogoChange(event.target.files?.[0])
                      }
                      className="mt-2 block w-full rounded-xl border border-[#9dd5c4] bg-white px-4 py-3 text-sm"
                    />
                  </label>
                </div>
              </div>

              <div id="clerk-captcha" className="min-h-16" />

              {error && <p className="text-sm text-[#d8665f]">{error}</p>}

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Link
                  href="/sign-in"
                  className="text-sm font-semibold text-[#073b44] underline-offset-4 hover:underline"
                >
                  Бүртгэлтэй бол нэвтрэх
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  aria-busy={isSubmitting || fetchStatus === "fetching"}
                  className="flex h-12 items-center justify-center rounded-xl bg-[#073b44] px-7 font-bold text-white disabled:opacity-60"
                >
                  {isSubmitting ? "Бүртгэж байна..." : "Бүртгүүлэх"}
                </button>
              </div>
            </form>
          )}
        </section>
      </section>
    </main>
  );
}

function InvitationCompanyInfo({
  company,
}: {
  company: InvitationCompany | null;
}) {
  if (!company) {
    return (
      <div className="mt-10">
        <h1 className="text-3xl font-bold leading-tight">
          Компанийн урилга
        </h1>
        <p className="mt-4 text-sm leading-6 text-[#5f7d7b]">
          Уригдсан компанийн мэдээлэл ачаалж байна эсвэл invitation link хуучин
          байна.
        </p>
      </div>
    );
  }

  const initial = company.name.trim()[0]?.toLocaleUpperCase("mn-MN") ?? "Т";

  return (
    <div className="mt-10">
      <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-[#073b44] text-3xl font-black text-white">
        {company.logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={company.logoUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          initial
        )}
      </div>
      <h1 className="mt-5 text-3xl font-bold leading-tight">{company.name}</h1>
      <div className="mt-5 grid gap-3 text-sm">
        <InfoRow label="Регистр" value={company.registerNumber} />
        <InfoRow label="Утас" value={company.phone} />
        <InfoRow label="И-мэйл" value={company.email} />
        <InfoRow label="Хаяг" value={company.address} />
      </div>
    </div>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  return (
    <div>
      <div className="font-semibold text-[#5f7d7b]">{label}</div>
      <div className="mt-1 font-bold text-[#073b44]">{value || "-"}</div>
    </div>
  );
}

function getInviteCompanyId(pathname: string) {
  const marker = "/sign-up/invite/";
  const markerIndex = pathname.indexOf(marker);

  if (markerIndex === -1) {
    return null;
  }

  return pathname.slice(markerIndex + marker.length).split("/")[0] || null;
}

function TextField({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  minLength,
}: {
  label: string;
  value?: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  minLength?: number;
}) {
  return (
    <label className="block text-sm font-semibold">
      {label}
      <input
        type={type}
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        minLength={minLength}
        className="mt-2 h-12 w-full rounded-xl border border-[#9dd5c4] bg-white px-4 outline-none focus:border-[#073b44]"
      />
    </label>
  );
}

async function syncSignupToBackend(form: FormState) {
  const companyData = await graphqlRequest<{
    createCompany: { id: string };
  }>(
    `
      mutation CreateSignupCompany($input: CreateCompanyInput!) {
        createCompany(input: $input) {
          id
        }
      }
    `,
    {
      input: {
        name: form.companyName,
        registerNumber: form.companyRegister || null,
        logoUrl: form.companyLogo || null,
        phone: form.phone,
        email: form.email,
        address: form.companyAddress || null,
      },
    },
  );

  await graphqlRequest(
    `
      mutation CreateSignupUser($input: CreateUserInput!) {
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
        email: form.email,
        phone: form.phone,
        position: form.position || null,
        permission: "FULL_ACCESS",
        isCompanyOwner: true,
      },
    },
  );
}

function getClerkError(cause: unknown) {
  console.error("Signup error", cause);

  if (
    typeof cause === "object" &&
    cause !== null &&
    "code" in cause &&
    "message" in cause
  ) {
    return `${String(cause.message)} (${String(cause.code)})`;
  }

  if (
    typeof cause === "object" &&
    cause !== null &&
    "errors" in cause &&
    Array.isArray(cause.errors) &&
    cause.errors[0]?.message
  ) {
    return String(cause.errors[0].message);
  }

  return "Алдаа гарлаа. Мэдээллээ шалгаад дахин оролдоно уу.";
}
