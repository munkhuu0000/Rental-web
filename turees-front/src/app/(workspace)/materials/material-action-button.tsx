import Link from "next/link";
import { icons } from "@/app/components/menu/icons";

type MaterialActionButtonProps = {
  href: string;
  label: string;
  icon: "plus" | "arrowRight";
  target?: "_blank";
};

export function MaterialActionButton({
  href,
  label,
  icon,
  target,
}: MaterialActionButtonProps) {
  const Icon = icon === "plus" ? icons.plus : icons.arrowRight;

  return (
    <Link
      href={href}
      target={target}
      rel={target === "_blank" ? "noreferrer" : undefined}
      className="inline-flex min-h-9 items-center justify-center gap-2 rounded-md border border-[var(--line)] bg-[var(--surface)] px-3 text-[0.78rem] font-semibold text-[var(--accent)] shadow-sm transition-colors hover:bg-[var(--accent-soft)] focus:outline-none focus:ring-2 focus:ring-[var(--line-strong)] focus:ring-offset-2 focus:ring-offset-[var(--background)]"
    >
      {Icon("h-3.5 w-3.5")}
      {label}
    </Link>
  );
}
