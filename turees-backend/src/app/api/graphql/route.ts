import { env } from "cloudflare:workers";
import {
  buildASTSchema,
  execute,
  getOperationAST,
  Kind,
  parse,
  specifiedRules,
  validate,
  type DocumentNode,
  type GraphQLFieldResolver,
  type GraphQLSchema,
} from "graphql";
import { NextRequest, NextResponse } from "next/server";
import { drizzleProvider } from "../../../db";
import { resolvers } from "../../../resolvers";
import { typeDefs } from "../../../schema";

export type GraphqlContext = {
  db: ReturnType<typeof drizzleProvider> | null;
};

type ResolverMap = Record<string, Record<string, GraphQLFieldResolver<unknown, GraphqlContext>>>;

type GraphqlRequestBody = {
  query?: string;
  variables?: Record<string, unknown>;
  operationName?: string;
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "content-type",
};

const schema: GraphQLSchema = buildASTSchema({
  kind: Kind.DOCUMENT,
  definitions: (typeDefs as DocumentNode[]).flatMap((document) => document.definitions),
});

const resolverMap = resolvers as ResolverMap;

const fieldResolver: GraphQLFieldResolver<unknown, GraphqlContext> = (
  source,
  args,
  context,
  info,
) => {
  const resolver = resolverMap[info.parentType.name]?.[info.fieldName];

  if (resolver) {
    return resolver(source, args, context, info);
  }

  if (source && typeof source === "object") {
    return (source as Record<string, unknown>)[info.fieldName];
  }

  return undefined;
};

const createContext = (): GraphqlContext => ({
  db: env.DB ? drizzleProvider(env.DB) : null,
});

const executeGraphql = async (body: GraphqlRequestBody) => {
  if (!body.query) {
    return NextResponse.json(
      { errors: [{ message: "GraphQL query is required" }] },
      { headers: corsHeaders, status: 400 },
    );
  }

  const document = parse(body.query);
  const validationErrors = validate(schema, document, specifiedRules);

  if (validationErrors.length > 0) {
    return NextResponse.json(
      { errors: validationErrors },
      { headers: corsHeaders, status: 400 },
    );
  }

  const operation = getOperationAST(document, body.operationName);
  const result = await execute({
    schema,
    document,
    contextValue: createContext(),
    variableValues: body.variables,
    operationName: body.operationName,
    fieldResolver,
  });

  return NextResponse.json(result, {
    headers: corsHeaders,
    status: operation?.operation === "mutation" && result.errors ? 400 : 200,
  });
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("query") ?? undefined;

  if (!query) {
    const sandboxUrl = new URL("https://studio.apollographql.com/sandbox/explorer");
    sandboxUrl.searchParams.set("endpoint", request.nextUrl.href);

    return NextResponse.redirect(sandboxUrl);
  }

  return executeGraphql({
    query,
    operationName: searchParams.get("operationName") ?? undefined,
  });
}

export async function POST(request: NextRequest) {
  return executeGraphql((await request.json()) as GraphqlRequestBody);
}

export function OPTIONS() {
  return new NextResponse(null, {
    headers: corsHeaders,
    status: 204,
  });
}
