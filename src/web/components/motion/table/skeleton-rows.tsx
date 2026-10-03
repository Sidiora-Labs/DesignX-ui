import { cn } from "@/lib/utils";
import type { TableColumn } from "./types";
import { alignText } from "./utils";

export function SkeletonRows<T>({
  count,
  columns,
  selectable,
  rowHeight,
}: {
  count: number;
  columns: TableColumn<T>[];
  selectable: boolean;
  rowHeight: number;
}) {
  return (
    <>
      {Array.from({ length: count }, (_, r) => (
        <tr key={r} style={{ height: rowHeight }} className="border-border/60 border-b">
          {/* oxlint-disable-next-line jsx-a11y/control-has-associated-label */}
          {selectable ? <td /> : null}
          {columns.map((column) => (
            // oxlint-disable-next-line jsx-a11y/control-has-associated-label
            <td key={column.key} className={cn("px-4", alignText(column.align))}>
              <div
                className={cn(
                  "h-3 animate-pulse rounded-full bg-muted",
                  column.align === "right" ? "ml-auto w-10" : "w-2/3",
                )}
              />
            </td>
          ))}
          <td aria-hidden />
        </tr>
      ))}
    </>
  );
}
