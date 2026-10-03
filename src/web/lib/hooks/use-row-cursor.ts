import { useCallback, useEffect, useMemo, useState } from "react";

/**
 * Keyboard cursor over a filtered list. The cursor follows a row id, so it
 * survives re-filtering, and falls back to the first row when that row is gone
 * or the query changes.
 */
export function useRowCursor<T extends { id: string | number }>(rows: readonly T[], query?: string) {
  const [activeId, setActiveId] = useState<T["id"] | null>(null);

  useEffect(() => {
    setActiveId(null);
  }, [query]);

  const activeIndex = useMemo(() => {
    if (rows.length === 0) return -1;
    const i = activeId === null ? -1 : rows.findIndex((r) => r.id === activeId);
    return i === -1 ? 0 : i;
  }, [rows, activeId]);

  const moveTo = useCallback((id: T["id"] | null) => setActiveId(id), []);

  const moveActive = useCallback(
    (delta: number) => {
      if (rows.length === 0) return;
      const next = (activeIndex + delta + rows.length) % rows.length;
      setActiveId(rows[next].id);
    },
    [rows, activeIndex],
  );

  return { activeIndex, activeId, moveTo, moveActive };
}
