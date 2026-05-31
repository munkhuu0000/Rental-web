import Link from "next/link";
import { icons } from "@/app/components/menu/icons";

type StatCardProps = {
  title: string;
  value: string;
  helper: string;
  trend: string;
  tone: "success" | "warning" | "danger";
  href?: string;
};

const iconMap = {
  success: icons.pulse,
  warning: icons.wallet,
  danger: icons.alert,
};

const toneMap = {
  success: "text-[var(--success)] bg-[var(--accent-soft)]",
  warning: "text-[var(--warning)] bg-[rgba(216,161,47,0.15)]",
  danger: "text-[var(--danger)] bg-[rgba(216,102,95,0.14)]",
};

export function StatCard({
  title,
  value,
  helper,
  trend,
  tone,
  href,
}: StatCardProps) {
  const Icon = iconMap[tone];

  const content = (
    <article className="app-card flex min-h-[96px] flex-col justify-between p-4">
      <div className="flex items-start justify-between gap-3">
        <p className="text-[0.75rem] font-medium text-[var(--muted)]">
          {title}
        </p>
        <div
          className={`flex h-7 w-7 items-center justify-center rounded-md ${toneMap[tone]}`}
        >
          {Icon("h-3.5 w-3.5")}
        </div>
      </div>

      <div className="mt-2">
        <p className="font-data text-[1.45rem] font-semibold leading-tight">
          {value}
        </p>
        <div className="mt-1.5 flex items-center justify-between gap-3 text-[0.72rem]">
          <span
            className={trend ? "text-[var(--success)]" : "text-transparent"}
          >
            {trend || "."}
          </span>
          <span className="text-[var(--muted)]">{helper}</span>
        </div>
      </div>
    </article>
  );

  if (!href) {
    return content;
  }

  return (
    <Link
      href={href}
      className="block rounded-[0.65rem] transition-transform duration-200 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[var(--success)] focus:ring-offset-2 focus:ring-offset-[var(--background)]"
    >
      {content}
    </Link>
  );
}
