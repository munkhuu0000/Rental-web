"use server";

import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { graphqlRequest } from "@/lib/graphql-client";

type RegisteredUser = {
  id: string;
  companyId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string | null;
  permission: "FULL_ACCESS" | "QUANTITY_ONLY";
  isCompanyOwner: boolean;
};

type InviteEmployeeInput = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  permission: "FULL_ACCESS" | "QUANTITY_ONLY";
};

export async function inviteEmployee(input: InviteEmployeeInput) {
  try {
    const clerkUser = await currentUser();
    const ownerEmail = clerkUser?.primaryEmailAddress?.emailAddress;

    if (!ownerEmail) {
      return { ok: false, error: "Нэвтэрсэн хэрэглэгч олдсонгүй." };
    }

    const ownerData = await graphqlRequest<{
      userByEmail: RegisteredUser | null;
    }>(
      `
        query InviteOwner($email: String!) {
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
          }
        }
      `,
      { email: ownerEmail },
    );

    const owner = ownerData.userByEmail;

    if (!owner?.isCompanyOwner) {
      return {
        ok: false,
        error: "Зөвхөн компанийн анхны бүртгүүлсэн хэрэглэгч ажилтан урина.",
      };
    }

    await graphqlRequest(
      `
        mutation CreateInvitedEmployee($input: CreateUserInput!) {
          createUser(input: $input) {
            id
          }
        }
      `,
      {
        input: {
          companyId: owner.companyId,
          firstName: input.firstName,
          lastName: input.lastName,
          email: input.email,
          phone: input.phone,
          position: input.position || null,
          permission: input.permission,
          isCompanyOwner: false,
        },
      },
    );

    const origin = await getOrigin();
    const client = await clerkClient();

    await client.invitations.createInvitation({
      emailAddress: input.email,
      ignoreExisting: true,
      notify: true,
      redirectUrl: `${origin}/sign-up/invite/${owner.companyId}`,
      publicMetadata: {
        companyId: owner.companyId,
        permission: input.permission,
      },
    });

    return { ok: true, error: "" };
  } catch (cause) {
    return {
      ok: false,
      error:
        cause instanceof Error
          ? cause.message
          : "Ажилтан урих үед алдаа гарлаа.",
    };
  }
}

async function getOrigin() {
  const headerList = await headers();
  const host = headerList.get("host") ?? "localhost:3000";
  const proto = headerList.get("x-forwarded-proto") ?? "http";

  return `${proto}://${host}`;
}
