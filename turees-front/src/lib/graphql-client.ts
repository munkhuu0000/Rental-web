const GRAPHQL_ENDPOINT =
  process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT ?? "http://localhost:4000/api/graphql";

type GraphqlResponse<T> = {
  data?: T;
  errors?: Array<{ message: string }>;
};

export async function graphqlRequest<T>(
  query: string,
  variables?: Record<string, unknown>,
) {
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: "POST",
    cache: "no-store",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
  });

  const result = (await response.json()) as GraphqlResponse<T>;

  if (!response.ok || result.errors?.length) {
    throw new Error(
      result.errors?.[0]?.message ??
        `GraphQL request failed with status ${response.status}`,
    );
  }

  return result.data as T;
}
