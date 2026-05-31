import type { ReactNode } from "react";

type TableCardProps = {
  headers: string[];
  rows: ReactNode[][];
};

export function TableCard({ headers, rows }: TableCardProps) {
  return (
    <div className="app-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="font-data min-w-full border-collapse">
          <thead>
            <tr className="border-b border-[var(--line)] bg-[var(--surface-muted)] text-left">
              {headers.map((header) => (
                <th
                  key={header}
                  className="px-3 py-2.5 text-[0.72rem] font-semibold uppercase tracking-[0.04em] text-[var(--muted)]"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr
                key={index}
                className="border-b border-[var(--line)] last:border-b-0"
              >
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="px-3 py-3 text-[0.82rem]">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
