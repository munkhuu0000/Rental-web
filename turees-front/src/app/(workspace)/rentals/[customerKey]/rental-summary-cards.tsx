import { formatMoney } from "@/lib/rental-records";

type RentalSummary = {
  receivable: number;
  payable: number;
  leaseOutRemaining: number;
  leaseInRemaining: number;
};

type RentalSummaryCardsProps = {
  summary: RentalSummary;
};

export function RentalSummaryCards({ summary }: RentalSummaryCardsProps) {
  const cards = [
    { label: "Авлага", value: formatMoney(summary.receivable) },
    { label: "Өглөг", value: formatMoney(summary.payable) },
    {
      label: "Түрээслүүлсэн үлдэгдэл",
      value: `${summary.leaseOutRemaining.toLocaleString()} ш`,
    },
    {
      label: "Түрээсэлсэн үлдэгдэл",
      value: `${summary.leaseInRemaining.toLocaleString()} ш`,
    },
  ];

  return (
    <section className="mb-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div key={card.label} className="app-card p-4">
          <p className="text-xs font-semibold uppercase text-[var(--muted)]">
            {card.label}
          </p>
          <p className="mt-2 text-2xl font-semibold">{card.value}</p>
        </div>
      ))}
    </section>
  );
}
