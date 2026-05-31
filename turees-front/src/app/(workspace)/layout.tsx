import type { ReactNode } from "react";
import { AppShell } from "@/app/components/menu/app-shell";

export default function WorkspaceLayout({ children }: { children: ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
