"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { icons } from "@/app/components/menu/icons";
import { useCurrentRegisteredUser } from "@/lib/use-current-registered-user";

const navItems = [
  { href: "/dashboard", label: "Дашбоард", icon: icons.grid },
  { href: "/materials", label: "Материал", icon: icons.cube },
  { href: "/rentals", label: "Түрээс", icon: icons.file },
  { href: "/invoices", label: "Нэхэмжлэл", icon: icons.money },
  { href: "/reports", label: "Тайлан", icon: icons.chart },
  { href: "/settings", label: "Тохиргоо", icon: icons.settings },
];

type SidebarProps = {
  isCollapsed: boolean;
};

export function Sidebar({ isCollapsed }: SidebarProps) {
  const pathname = usePathname();
  const registeredUser = useCurrentRegisteredUser();
  const companyName = registeredUser?.company.name ?? "Түрээс";
  const companyLogo = registeredUser?.company.logoUrl;
  const companyInitial = companyName.trim()[0]?.toLocaleUpperCase("mn-MN") ?? "Т";

  return (
    <aside className="workspace-sidebar relative">
      <div className={`workspace-sidebar-brand flex items-center gap-2 ${isCollapsed ? "justify-center" : ""}`}>
        <div className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-md bg-[var(--accent)] text-xs font-black text-white">
          {companyLogo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={companyLogo} alt="" className="h-full w-full object-cover" />
          ) : (
            companyInitial
          )}
        </div>
        {!isCollapsed ? (
          <div className="min-w-0">
            <p className="truncate text-[0.92rem] font-semibold">{companyName}</p>
          </div>
        ) : null}
      </div>

      <div className={isCollapsed ? "px-1 py-3" : "px-3 py-3"}>
        {!isCollapsed ? (
          <p className="px-2 pb-3 text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">
            Үндсэн цэс
          </p>
        ) : null}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                title={isCollapsed ? item.label : undefined}
                className={`flex items-center gap-2 rounded-md py-2 text-[0.82rem] font-medium transition-colors duration-200 ${
                  isCollapsed ? "justify-center" : ""
                } ${
                  isActive
                    ? "bg-[var(--accent-soft)] text-[var(--accent-strong)]"
                    : "text-[var(--muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--foreground)]"
                } ${isCollapsed ? "px-0" : "px-2"}`}
              >
                {item.icon("h-4 w-4 shrink-0")}
                {!isCollapsed ? <span>{item.label}</span> : null}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
