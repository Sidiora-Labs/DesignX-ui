import type { PropRow } from "./api";

export function PropsTable({ rows }: { rows: PropRow[] }) {
  return (
    <div className="not-prose overflow-x-auto rounded-lg border border-outline-variant">
      <table className="w-full min-w-[560px] text-left text-[13px]">
        <thead className="bg-container text-muted-foreground">
          <tr>
            <th className="h-10 px-4 font-medium">Prop</th>
            <th className="h-10 px-4 font-medium">Type</th>
            <th className="h-10 px-4 font-medium">Default</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([name, type, def, desc]) => (
            <tr key={name} className="border-t border-outline-variant align-top">
              <td className="px-4 py-3">
                <code className="font-mono text-[12.5px] font-medium text-[var(--dx-blue-4)] dark:text-[var(--dx-blue-2)]">{name}</code>
                {desc && <div className="mt-1 max-w-xs text-[12.5px] leading-snug text-muted-foreground">{desc}</div>}
              </td>
              <td className="px-4 py-3">
                <code className="rounded-xs bg-container-high px-1.5 py-0.5 font-mono text-[12px] break-words">{type}</code>
              </td>
              <td className="px-4 py-3 font-mono text-[12px] text-muted-foreground">{def ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
