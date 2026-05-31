type PlaceholderCardProps = {
  title: string;
  copy: string;
  action: string;
};

export function PlaceholderCard({
  title,
  copy,
  action,
}: PlaceholderCardProps) {
  return (
    <div className="app-card p-4">
      <h2 className="text-[1.15rem] font-semibold">{title}</h2>
      <p className="mt-2 max-w-2xl text-[0.82rem] leading-6 text-[var(--muted)]">
        {copy}
      </p>
      <button type="button" className="action-button mt-4">
        {action}
      </button>
    </div>
  );
}
