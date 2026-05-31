type SettingToggleProps = {
  label: string;
  enabled?: boolean;
};

export function SettingToggle({
  label,
  enabled = false,
}: SettingToggleProps) {
  return (
    <div className="app-card rounded-[1.25rem] px-4 py-3">
      <div className="flex items-center justify-between gap-4">
        <p className="max-w-[14rem] text-lg leading-7">{label}</p>
        <div
          className={`relative h-7 w-12 rounded-full transition-colors ${
            enabled ? "bg-[var(--accent)]" : "bg-[var(--surface-strong)]"
          }`}
        >
          <span
            className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-transform ${
              enabled ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </div>
      </div>
    </div>
  );
}
