"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useClerk, useSessionList, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { icons } from "@/app/components/menu/icons";
import { useCurrentRegisteredUser } from "@/lib/use-current-registered-user";

type TopbarProps = {
  isSidebarCollapsed: boolean;
  onToggleSidebar: () => void;
};

export function Topbar({ isSidebarCollapsed, onToggleSidebar }: TopbarProps) {
  const { signOut } = useClerk();
  const { isLoaded: isSessionListLoaded, sessions } = useSessionList();
  const { user } = useUser();
  const registeredUser = useCurrentRegisteredUser();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const displayName = useMemo(() => {
    const registeredName = registeredUser
      ? `${registeredUser.firstName} ${registeredUser.lastName}`.trim()
      : "";
    const clerkName = [user?.firstName, user?.lastName]
      .filter(Boolean)
      .join(" ");
    return (
      registeredName ||
      clerkName ||
      user?.primaryEmailAddress?.emailAddress ||
      "Хэрэглэгч"
    );
  }, [registeredUser, user]);

  const initials =
    displayName[0]?.toLocaleUpperCase("mn-MN") ??
    user?.primaryEmailAddress?.emailAddress?.[0]?.toLocaleUpperCase("mn-MN") ??
    "Т";

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  async function handleSignOut() {
    if (isSigningOut) {
      return;
    }

    setIsSigningOut(true);
    setIsUserMenuOpen(false);

    try {
      if (isSessionListLoaded && sessions.length > 0) {
        for (const session of sessions) {
          await signOut(() => undefined, { sessionId: session.id });
        }
        window.location.replace("/");
        return;
      }

      await signOut({ redirectUrl: "/" });
    } catch {
      setIsSigningOut(false);
    }
  }

  return (
    <header className="workspace-topbar">
      <button
        type="button"
        onClick={onToggleSidebar}
        aria-label={isSidebarCollapsed ? "Sidebar нээх" : "Sidebar хаах"}
        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[var(--line)] bg-[var(--surface)] text-[var(--accent)] transition-colors hover:bg-[var(--surface-muted)]"
      >
        <span className={isSidebarCollapsed ? "rotate-0" : "rotate-180"}>
          {icons.arrowRight("h-4 w-4")}
        </span>
      </button>

      <div className="input-shell max-w-[500px] flex-1">
        {icons.search("h-4 w-4 text-[var(--muted)]")}
        <input
          readOnly
          value="Захиалагч, материал, нэхэмжлэл хайх..."
          aria-label="search"
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <button
          type="button"
          className="relative inline-flex h-8 w-8 items-center justify-center rounded-md border border-[var(--line)] bg-[var(--surface)] text-[var(--accent)]"
        >
          {icons.bell("h-4 w-4")}
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[var(--danger)]" />
        </button>

        <div ref={menuRef} className="relative">
          <button
            type="button"
            aria-haspopup="menu"
            aria-expanded={isUserMenuOpen}
            aria-label="Хэрэглэгчийн цэс"
            onClick={() => setIsUserMenuOpen((current) => !current)}
            className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-[var(--accent)] text-[0.7rem] font-semibold text-white ring-offset-2 transition hover:ring-2 hover:ring-[var(--line-strong)]"
          >
            {user?.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.imageUrl}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              initials
            )}
          </button>

          {isUserMenuOpen && (
            <div
              role="menu"
              className="absolute right-0 top-11 z-50 w-60 overflow-hidden rounded-lg border border-[var(--line)] bg-[var(--surface)] p-1 shadow-[0_18px_45px_rgba(7,59,68,0.16)]"
            >
              <div className="border-b border-[var(--line)] px-3 py-3">
                <p className="text-sm font-semibold text-[var(--foreground)]">
                  Сайн байна уу, {displayName}?
                </p>
                {registeredUser?.company.name ? (
                  <p className="mt-1 truncate text-xs text-[var(--muted)]">
                    {registeredUser.company.name}
                  </p>
                ) : null}
              </div>
              <Link
                href="/settings"
                role="menuitem"
                onClick={() => setIsUserMenuOpen(false)}
                className="mt-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-[var(--foreground)] hover:bg-[var(--surface-muted)]"
              >
                {icons.settings("h-4 w-4")}
                Тохиргоо
              </Link>
              <button
                type="button"
                role="menuitem"
                onClick={handleSignOut}
                disabled={isSigningOut}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-[var(--danger)] hover:bg-[rgba(216,102,95,0.10)] disabled:opacity-60"
              >
                {icons.rotate("h-4 w-4")}
                Гарах
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
