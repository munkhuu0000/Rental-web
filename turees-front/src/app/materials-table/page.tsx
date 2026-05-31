import { MaterialActionButton } from "../(workspace)/materials/material-action-button";
import { MaterialsList } from "../(workspace)/materials/materials-list";

export default function MaterialsTableWindowPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] p-5 text-[var(--foreground)]">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Материалын хүснэгт</h1>
        </div>
        <MaterialActionButton
          href="/materials/new"
          label="Шинэ материал"
          icon="plus"
        />
      </div>

      <MaterialsList />
    </main>
  );
}
