"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { Sidebar } from "@/app/components/menu/sidebar";
import { Topbar } from "@/app/components/menu/topbar";

export function AppShell({ children }: { children: ReactNode }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="workspace-shell">
      <div className={isSidebarCollapsed ? "workspace-grid workspace-grid-collapsed" : "workspace-grid"}>
        <Sidebar
          isCollapsed={isSidebarCollapsed}
        />
        <div className="workspace-main">
          <Topbar
            isSidebarCollapsed={isSidebarCollapsed}
            onToggleSidebar={() => setIsSidebarCollapsed((current) => !current)}
          />
          <div className="workspace-content">
            <div className="workspace-page">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
