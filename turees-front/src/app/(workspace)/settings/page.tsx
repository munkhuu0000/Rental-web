import type { ReactNode } from "react";
import { currentUser } from "@clerk/nextjs/server";
import { SectionHeader } from "@/app/components/menu/section-header";
import { graphqlRequest } from "@/lib/graphql-client";
import { CompleteProfileForm } from "./complete-profile-form";
import { EmployeeInviteForm } from "./employee-invite-form";
import { SettingsProfilePanel } from "./settings-profile-panel";

type SettingsUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string | null;
  permission: "FULL_ACCESS" | "QUANTITY_ONLY";
  isCompanyOwner: boolean;
  companyId: string;
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

type Employee = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string | null;
  permission: "FULL_ACCESS" | "QUANTITY_ONLY";
  isCompanyOwner: boolean;
};

export default async function SettingsPage() {
  const clerkUser = await currentUser();
  const email = clerkUser?.primaryEmailAddress?.emailAddress;
  const registeredUser = email ? await getRegisteredUser(email) : null;
  const employees = registeredUser
    ? await getCompanyEmployees(registeredUser.companyId)
    : [];

  return (
    <>
      <SectionHeader
        title="Тохиргоо"
        description="Бүртгэлтэй хэрэглэгч болон компанийн мэдээлэл."
      />

      {!registeredUser ? (
        email ? (
          <div className="app-card p-6">
            <h2 className="text-xl font-semibold">Мэдээлэл олдсонгүй</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">
              {email} хаягаар backend бүртгэл олдсонгүй. Доорх form-оор компанийн мэдээллээ бүртгэнэ.
            </p>
          </div>
        ) : null
      ) : null}

      {!registeredUser ? (
        <CompleteProfileForm
          initialEmail={email ?? ""}
          initialFirstName={clerkUser?.firstName ?? ""}
          initialLastName={clerkUser?.lastName ?? ""}
        />
      ) : (
        <SettingsProfilePanel user={registeredUser} />
      )}

      {registeredUser ? (
        <>
          <EmployeeInviteForm canInvite={registeredUser.isCompanyOwner} />
          <section className="app-card mt-6 min-w-0 p-4 sm:p-6">
            <h2 className="text-2xl font-semibold tracking-[-0.04em]">
              Ажилтнууд
            </h2>
            <div className="mt-5 overflow-hidden rounded-xl border border-[var(--line)]">
              <div className="hidden grid-cols-[1.1fr_1.3fr_0.9fr_1fr] bg-[var(--surface-muted)] px-4 py-3 text-sm font-semibold text-[var(--muted)] md:grid">
                <span>Нэр</span>
                <span>И-мэйл</span>
                <span>Албан тушаал</span>
                <span>Эрх</span>
              </div>
              {employees.map((employee) => (
                <div
                  key={employee.id}
                  className="grid gap-3 border-t border-[var(--line)] px-4 py-4 text-sm first:border-t-0 md:grid-cols-[1.1fr_1.3fr_0.9fr_1fr] md:gap-0 md:py-3 md:first:border-t"
                >
                  <EmployeeCell label="ÐÑÑ€">
                    <span className="break-words">
                      {employee.firstName} {employee.lastName}
                      {employee.isCompanyOwner ? " / Owner" : ""}
                    </span>
                  </EmployeeCell>
                  <EmployeeCell label="Ð˜-Ð¼ÑÐ¹Ð»">
                    <span className="break-all">{employee.email}</span>
                  </EmployeeCell>
                  <EmployeeCell label="ÐÐ»Ð±Ð°Ð½ Ñ‚ÑƒÑˆÐ°Ð°Ð»">
                    <span className="break-words">
                      {employee.position || "-"}
                    </span>
                  </EmployeeCell>
                  <EmployeeCell label="Ð­Ñ€Ñ…">
                    <span className="break-words">
                      {formatPermission(employee.permission)}
                    </span>
                  </EmployeeCell>
                </div>
              ))}
            </div>
          </section>
        </>
      ) : null}
    </>
  );
}

async function getRegisteredUser(email: string) {
  try {
    const data = await graphqlRequest<{ userByEmail: SettingsUser | null }>(
      `
        query SettingsUser($email: String!) {
          userByEmail(email: $email) {
            id
            companyId
            firstName
            lastName
            email
            phone
            position
            permission
            isCompanyOwner
            company {
              id
              name
              registerNumber
              phone
              email
              address
              logoUrl
            }
          }
        }
      `,
      { email },
    );

    return data.userByEmail;
  } catch {
    return null;
  }
}

async function getCompanyEmployees(companyId: string) {
  try {
    const data = await graphqlRequest<{ users: Employee[] }>(
      `
        query CompanyEmployees($companyId: ID) {
          users(companyId: $companyId) {
            id
            firstName
            lastName
            email
            phone
            position
            permission
            isCompanyOwner
          }
        }
      `,
      { companyId },
    );

    return data.users;
  } catch {
    return [];
  }
}

function formatPermission(permission: Employee["permission"]) {
  if (permission === "QUANTITY_ONLY") {
    return "Зөвхөн тоо ширхэг харах";
  }

  return "Бүх эрх";
}

function EmployeeCell({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="grid min-w-0 grid-cols-[7rem_minmax(0,1fr)] gap-3 md:block">
      <span className="text-(--muted) md:hidden">{label}</span>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
