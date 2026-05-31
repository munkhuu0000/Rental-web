"use client";

import { useEffect, useMemo, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { graphqlRequest } from "@/lib/graphql-client";

type RegisteredUser = {
  firstName: string;
  lastName: string;
  email: string;
  permission: "FULL_ACCESS" | "QUANTITY_ONLY";
  company: {
    name: string;
    logoUrl: string | null;
  };
};

const CURRENT_USER_QUERY = `
  query CurrentRegisteredUser($email: String!) {
    userByEmail(email: $email) {
      firstName
      lastName
      email
      permission
      company {
        name
        logoUrl
      }
    }
  }
`;

export function useCurrentRegisteredUser() {
  const { user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress;
  const [registeredUser, setRegisteredUser] = useState<RegisteredUser | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    function refreshRegisteredUser() {
      setRefreshKey((current) => current + 1);
    }

    window.addEventListener("registered-user-updated", refreshRegisteredUser);
    return () => window.removeEventListener("registered-user-updated", refreshRegisteredUser);
  }, []);

  useEffect(() => {
    if (!email) {
      return;
    }

    let ignore = false;

    graphqlRequest<{ userByEmail: RegisteredUser | null }>(CURRENT_USER_QUERY, { email })
      .then((data) => {
        if (!ignore) {
          setRegisteredUser(data.userByEmail);
        }
      })
      .catch(() => {
        if (!ignore) {
          setRegisteredUser(null);
        }
      });

    return () => {
      ignore = true;
    };
  }, [email, refreshKey]);

  return useMemo(() => (email ? registeredUser : null), [email, registeredUser]);
}
