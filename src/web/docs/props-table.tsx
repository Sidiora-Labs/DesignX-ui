import type { PropRow } from "./api";

export function PropsTable({ rows }: { rows: PropRow[] }) {
  return (
    <div className="not-prose overflow-x-auto rounded-3xl border border-hairline">
      <table className="w-full min-w-[560px] text-left text-[13px]">
        <thead className="font-code text-[11px] tracking-[0.06em] text-faint uppercase">
          <tr>
            <th className="h-11 px-5 font-medium">Prop</th>
            <th className="h-11 px-5 font-medium">Type</th>
            <th className="h-11 px-5 font-medium">Default</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([name, type, def, desc]) => (
            <tr key={name} className="border-t border-hairline align-top">
              <td className="px-5 py-4">
                <code className="font-code text-[13px] tracking-[-0.025em] text-ink">{name}</code>
                {desc && <div className="mt-1 max-w-xs text-[13px] leading-snug text-pencil">{desc}</div>}
              </td>
              <td className="px-5 py-4">
                <code className="rounded-md bg-tile px-1.5 py-0.5 font-code text-[12px] tracking-[-0.025em] break-words text-ink">{type}</code>
              </td>
              <td className="px-5 py-4 font-code text-[12px] text-pencil">{def ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
