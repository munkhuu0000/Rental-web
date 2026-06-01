import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import type { NextFetchEvent, NextRequest } from "next/server";

const isWorkspaceRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/materials(.*)",
  "/materials-table(.*)",
  "/customers(.*)",
  "/rentals(.*)",
  "/returns(.*)",
  "/invoices(.*)",
  "/reports(.*)",
  "/settings(.*)",
]);

const clerkAuthProxy = clerkMiddleware(async (auth, request) => {
  if (isWorkspaceRoute(request)) {
    await auth.protect({
      unauthenticatedUrl: new URL("/sign-in", request.url).toString(),
    });
  }
});

export function proxy(request: NextRequest, event: NextFetchEvent) {
  return clerkAuthProxy(request, event);
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
