import { StatCard } from "@/app/components/menu/stat-card";
import { dashboardStats } from "@/lib/mock-data";

export default function DashboardPage() {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      {dashboardStats.map((card) => (
        <StatCard
          key={card.title}
          title={card.title}
          value={card.value}
          helper={card.helper}
          trend={card.trend}
          tone={card.tone as "success" | "warning" | "danger"}
          href={card.href}
        />
      ))}
    </div>
  );
}
