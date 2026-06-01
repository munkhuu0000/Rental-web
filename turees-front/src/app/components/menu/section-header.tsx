import Link from "next/link";
import { icons } from "@/app/components/menu/icons";

type SectionHeaderProps = {
  title: string;
  description?: string;
  action?: string;
  actionHref?: string;
  actionIcon?: "plus" | "arrowLeft";
};

export function SectionHeader({
  title,
  description,
  action,
  actionHref = "#",
  actionIcon = "plus",
}: SectionHeaderProps) {
  const ActionIcon = actionIcon === "arrowLeft" ? icons.arrowLeft : icons.plus;

  return (
    <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 className="text-[1.45rem] font-semibold">{title}</h1>
        {description ? (
          <p className="mt-1 text-[0.82rem] text-[var(--muted)]">
            {description}
          </p>
        ) : null}
      </div>

      {action ? (
        <Link href={actionHref} className="action-button">
          {ActionIcon("h-4 w-4")}
          {action}
        </Link>
      ) : null}
    </div>
  );
}
