import { icons } from "@/app/components/menu/icons";

type MaterialCardProps = {
  name: string;
  unit: string;
  total: number;
  rented: number;
  remaining: number;
  price: string;
  status: string;
  tone: "success" | "warning";
};

export function MaterialCard(props: MaterialCardProps) {
  const usedPercent = Math.min(
    100,
    Math.round((props.rented / props.total) * 100),
  );
  const toneClass =
    props.tone === "warning"
      ? "text-[var(--warning)] bg-[rgba(216,161,47,0.12)]"
      : "text-[var(--success)] bg-[var(--accent-soft)]";
  const barClass =
    props.tone === "warning" ? "bg-[var(--warning)]" : "bg-[var(--success)]";

  return (
    <article className="app-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[var(--surface-muted)] text-[var(--accent)]">
            {icons.cube("h-4 w-4")}
          </div>
          <div>
            <h3 className="text-[1.05rem] font-semibold">
              {props.name}
            </h3>
            <p className="text-[var(--muted)]">Нэгж: {props.unit}</p>
          </div>
        </div>

        <div className={`soft-chip px-3 py-1.5 text-[0.75rem] font-medium ${toneClass}`}>
          <span className="mr-2 inline-block h-2 w-2 rounded-full bg-current" />
          {props.status}
        </div>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        {[
          ["Нийт", props.total],
          ["Түрээсэнд", props.rented],
          ["Үлдэгдэл", props.remaining],
        ].map(([label, value]) => (
          <div
            key={label}
            className="rounded-md bg-[var(--surface-muted)] px-3 py-2 text-center"
          >
            <p className="text-[0.7rem] uppercase tracking-[0.04em] text-[var(--muted)]">
              {label}
            </p>
            <p className="font-data mt-1 text-xl font-semibold">
              {value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4 h-1.5 rounded-full bg-[var(--surface-strong)]">
        <div
          className={`h-full rounded-full ${barClass}`}
          style={{ width: `${usedPercent}%` }}
        />
      </div>

      <div className="mt-4 flex items-end justify-between gap-4 border-t border-[var(--line)] pt-3">
        <div>
          <p className="text-sm text-[var(--muted)]">Үнэ</p>
          <p className="font-data mt-1 text-[1.25rem] font-semibold">
            {props.price}
          </p>
        </div>
        <button type="button" className="soft-chip px-3 py-1.5 text-[0.78rem] font-medium">
          Засах
        </button>
      </div>
    </article>
  );
}
