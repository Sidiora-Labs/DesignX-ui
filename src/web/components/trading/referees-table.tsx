import { ArrowDownIcon, ArrowUpIcon, CheckIcon, CopyIcon, PencilIcon, XIcon } from "lucide-react";
import { useState, type ReactNode } from "react";

import { Numeral } from "@/components/trading/numeral";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { shortenAddress } from "@/lib/trading";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------ types */

export type RefereeRow = {
  address: string;
  /** When the referee bound your code. */
  joinedAt: number | Date | string;
  /** The code they used. */
  code?: string;
  /** Lifetime trading volume, USD. */
  volume: number;
  /** Trading fees paid, USD. */
  fees?: number;
  /** Commission you earned from them, USD. */
  commission: number;
  /** Your private remark. */
  note?: string;
  /** Your / their split as fractions — shown as `30% / 10%`. */
  split?: { keep: number; referee: number };
  /** Marks a per-referee custom split. */
  customized?: boolean;
};

export type CommissionRow = {
  id?: string;
  date: number | Date | string;
  code?: string;
  /** The referee that generated it. */
  address?: string;
  volume: number;
  commission: number;
  /** Direct-referral bonus included in `commission`. */
  bonus?: number;
};

export type ReferralCodeRow = {
  code: string;
  /** Your / referee split as fractions. */
  keep: number;
  referee: number;
  referees: number;
  traders?: number;
  volume: number;
  commission: number;
};

export type RefereesTab = "referees" | "commission" | "codes";

/* ------------------------------------------------------------ helpers */

function useControllable<T>(value: T | undefined, defaultValue: T, onChange?: (v: T) => void) {
  const [inner, setInner] = useState(defaultValue);
  const controlled = value !== undefined;
  const set = (v: T) => {
    if (!controlled) setInner(v);
    onChange?.(v);
  };
  return [controlled ? value : inner, set] as const;
}

const pad2 = (n: number) => String(n).padStart(2, "0");
/** `2026-10-22` */
export function formatDate(value: number | Date | string) {
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

const pct = (f: number) => `${Number((f * 100).toFixed(2))}%`;

type SortDir = "asc" | "desc";
type Sort<K extends string> = { key: K; dir: SortDir } | null;

function sortRows<T, K extends string>(rows: T[], sort: Sort<K>, get: (row: T, key: K) => number) {
  if (!sort) return rows;
  const s = sort;
  return rows.toSorted((a, b) => (get(a, s.key) - get(b, s.key)) * (s.dir === "asc" ? 1 : -1));
}

function SortHead<K extends string>({
  label,
  sortKey,
  sort,
  onSort,
  className,
}: {
  label: ReactNode;
  sortKey: K;
  sort: Sort<K>;
  onSort: (s: Sort<K>) => void;
  className?: string;
}) {
  const active = sort?.key === sortKey ? sort.dir : null;
  return (
    <TableHead scope="col" aria-sort={active === "asc" ? "ascending" : active === "desc" ? "descending" : "none"} className={cn("text-right", className)}>
      <button
        type="button"
        onClick={() => onSort(active === "desc" ? { key: sortKey, dir: "asc" } : active === "asc" ? null : { key: sortKey, dir: "desc" })}
        className="focus-ring -me-1 inline-flex items-center gap-1 rounded-sm px-1 hover:text-foreground"
      >
        {label}
        {active === "asc" ? <ArrowUpIcon className="size-3" /> : active === "desc" ? <ArrowDownIcon className="size-3" /> : <span className="size-3" />}
      </button>
    </TableHead>
  );
}

function MobileField({ label, children, end }: { label: ReactNode; children: ReactNode; end?: boolean }) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-0.5", end && "items-end text-right")}>
      <span className="text-[11px] text-muted-foreground">{label}</span>
      <span className="truncate text-xs">{children}</span>
    </div>
  );
}

function Empty({ children }: { children: ReactNode }) {
  return <div className="grid h-32 place-items-center text-xs text-muted-foreground">{children}</div>;
}

const Usd = ({ value, dp = 2 }: { value: number | undefined; dp?: number }) => <Numeral value={value} rule="usd" dp={dp} />;

/* ------------------------------------------------------------ note editor */

function NoteCell({
  note,
  editing,
  maxLength,
  onEdit,
  onSave,
  onCancel,
  address,
}: {
  note?: string;
  editing: boolean;
  maxLength: number;
  address: string;
  onEdit?: () => void;
  onSave: (note: string) => void;
  onCancel: () => void;
}) {
  const [draft, setDraft] = useState(note ?? "");
  if (editing)
    return (
      <form
        className="flex items-center gap-1"
        onSubmit={(e) => {
          e.preventDefault();
          onSave(draft.trim());
        }}
      >
        <Input
          // oxlint-disable-next-line jsx-a11y/no-autofocus -- focus follows the explicit "edit note" action
          autoFocus
          value={draft}
          maxLength={maxLength}
          placeholder="Add a remark"
          aria-label={`Note for ${shortenAddress(address)}`}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Escape") onCancel();
          }}
          className="h-7 min-w-28 rounded-md px-2 text-xs"
        />
        <Button type="submit" size="icon-xs" variant="ghost" aria-label="Save note">
          <CheckIcon />
        </Button>
        <Button type="button" size="icon-xs" variant="ghost" aria-label="Cancel" onClick={onCancel}>
          <XIcon />
        </Button>
      </form>
    );
  return (
    <span className="flex min-w-0 items-center gap-1">
      <span className={cn("max-w-40 truncate text-[11px]", note ? "text-muted-foreground" : "text-muted-foreground/60")} title={note}>
        {note || "—"}
      </span>
      {onEdit && (
        <button
          type="button"
          onClick={onEdit}
          aria-label={note ? `Edit note for ${shortenAddress(address)}` : `Add note for ${shortenAddress(address)}`}
          className="focus-ring grid size-6 shrink-0 place-items-center rounded-md text-muted-foreground hover:bg-container-high hover:text-foreground"
        >
          <PencilIcon className="size-3" />
        </button>
      )}
    </span>
  );
}

/* ------------------------------------------------------------ component */

export interface RefereesTableProps {
  referees?: RefereeRow[];
  commissions?: CommissionRow[];
  codes?: ReferralCodeRow[];
  /** Active tab (controlled). */
  tab?: RefereesTab;
  defaultTab?: RefereesTab;
  onTabChange?: (tab: RefereesTab) => void;
  /** Save a referee note. Omit to make notes read-only. */
  onNoteChange?: (address: string, note: string) => void;
  /** Max note length. */
  noteMaxLength?: number;
  onCopyCode?: (code: string) => void;
  onEditCode?: (code: string) => void;
  /** Shows a "Load more" button under the active tab. */
  hasMore?: boolean;
  onLoadMore?: (tab: RefereesTab) => void;
  /** Rendered next to the tabs, e.g. a date range picker. */
  toolbar?: ReactNode;
  className?: string;
}

/** Referees, commission history and referral codes in one tabbed table, with inline notes and mobile cards. */
export function RefereesTable({
  referees = [],
  commissions = [],
  codes = [],
  tab: tabProp,
  defaultTab = "referees",
  onTabChange,
  onNoteChange,
  noteMaxLength = 50,
  onCopyCode,
  onEditCode,
  hasMore,
  onLoadMore,
  toolbar,
  className,
}: RefereesTableProps) {
  const [tab, setTab] = useControllable(tabProp, defaultTab, onTabChange);
  const [editing, setEditing] = useState<string | null>(null);
  const [refSort, setRefSort] = useState<Sort<"volume" | "commission" | "joinedAt">>(null);
  const [comSort, setComSort] = useState<Sort<"volume" | "commission">>(null);

  const sortedReferees = sortRows(referees, refSort, (r, k) => (k === "joinedAt" ? new Date(r.joinedAt).getTime() : r[k]));
  const sortedCommissions = sortRows(commissions, comSort, (r, k) => r[k]);
  const hasFees = referees.some((r) => r.fees != null);
  const hasSplit = referees.some((r) => r.split);

  const note = (r: RefereeRow) => (
    <NoteCell
      key={editing === r.address ? "edit" : "view"}
      note={r.note}
      address={r.address}
      editing={editing === r.address}
      maxLength={noteMaxLength}
      onEdit={onNoteChange ? () => setEditing(r.address) : undefined}
      onCancel={() => setEditing(null)}
      onSave={(n) => {
        onNoteChange?.(r.address, n);
        setEditing(null);
      }}
    />
  );

  const copyCode = (code: string) => (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard?.writeText(code);
        } catch {
          // clipboard unavailable — the callback still fires
        }
        onCopyCode?.(code);
      }}
      aria-label={`Copy code ${code}`}
      className="focus-ring grid size-6 place-items-center rounded-md text-muted-foreground hover:bg-container-high hover:text-foreground"
    >
      <CopyIcon className="size-3" />
    </button>
  );

  const loadMore = hasMore && onLoadMore && (
    <div className="flex justify-center pt-2">
      <Button size="xs" variant="tonal" onClick={() => onLoadMore(tab)}>
        Load more
      </Button>
    </div>
  );

  return (
    <section data-slot="referees-table" className={cn("flex flex-col rounded-2xl border border-border bg-container", className)}>
      <Tabs value={tab} onValueChange={(v) => setTab(v as RefereesTab)} className="gap-0">
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 pt-2">
          <TabsList variant="line" className="border-0">
            <TabsTrigger value="referees">
              Referees <span className="font-mono text-[11px] text-muted-foreground tabular-nums">{referees.length}</span>
            </TabsTrigger>
            <TabsTrigger value="commission">Commission</TabsTrigger>
            <TabsTrigger value="codes">
              Codes <span className="font-mono text-[11px] text-muted-foreground tabular-nums">{codes.length}</span>
            </TabsTrigger>
          </TabsList>
          {toolbar}
        </div>
        <div className="border-t border-border" />

        {/* ---------------------------------------------- referees */}
        <TabsContent value="referees" className="p-2 sm:p-3">
          {referees.length === 0 ? (
            <Empty>No referees yet — share your code to get started.</Empty>
          ) : (
            <>
              <div className="hidden md:block">
                <Table className="text-xs">
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead scope="col">Address</TableHead>
                      <SortHead label="Joined" sortKey="joinedAt" sort={refSort} onSort={setRefSort} className="text-left" />
                      <TableHead scope="col">Code</TableHead>
                      {hasSplit && <TableHead scope="col">You / Referee</TableHead>}
                      <SortHead label="Volume" sortKey="volume" sort={refSort} onSort={setRefSort} />
                      {hasFees && (
                        <TableHead scope="col" className="text-right">
                          Fees
                        </TableHead>
                      )}
                      <SortHead label="Commission" sortKey="commission" sort={refSort} onSort={setRefSort} />
                      <TableHead scope="col">Note</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedReferees.map((r) => (
                      <TableRow key={r.address}>
                        <TableCell className="font-mono" title={r.address}>
                          {shortenAddress(r.address)}
                        </TableCell>
                        <TableCell className="font-mono text-muted-foreground tabular-nums">{formatDate(r.joinedAt)}</TableCell>
                        <TableCell className="font-mono">{r.code ?? "—"}</TableCell>
                        {hasSplit && (
                          <TableCell className="font-mono tabular-nums">
                            {r.split ? (
                              <>
                                {pct(r.split.keep)} / <span className="text-muted-foreground">{pct(r.split.referee)}</span>
                                {r.customized && <span className="ms-1 font-sans text-[11px] text-primary">Custom</span>}
                              </>
                            ) : (
                              "—"
                            )}
                          </TableCell>
                        )}
                        <TableCell className="text-right">
                          <Usd value={r.volume} />
                        </TableCell>
                        {hasFees && (
                          <TableCell className="text-right">
                            <Usd value={r.fees} />
                          </TableCell>
                        )}
                        <TableCell className="text-right text-emerald-700 dark:text-emerald-400">
                          <Usd value={r.commission} dp={4} />
                        </TableCell>
                        <TableCell className="w-48">{note(r)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <ul className="flex flex-col gap-2 md:hidden">
                {sortedReferees.map((r) => (
                  <li key={r.address} className="flex flex-col gap-2.5 rounded-xl bg-container-high p-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-xs font-medium" title={r.address}>
                        {shortenAddress(r.address)}
                      </span>
                      <span className="font-mono text-[11px] text-muted-foreground tabular-nums">{formatDate(r.joinedAt)}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <MobileField label="Code">
                        <span className="font-mono">{r.code ?? "—"}</span>
                      </MobileField>
                      <MobileField label="Volume">
                        <Usd value={r.volume} />
                      </MobileField>
                      <MobileField label="Commission" end>
                        <span className="text-emerald-700 dark:text-emerald-400">
                          <Usd value={r.commission} dp={4} />
                        </span>
                      </MobileField>
                      {r.fees != null && (
                        <MobileField label="Fees">
                          <Usd value={r.fees} />
                        </MobileField>
                      )}
                      {r.split && (
                        <MobileField label="You / Referee">
                          <span className="font-mono">
                            {pct(r.split.keep)} / {pct(r.split.referee)}
                          </span>
                        </MobileField>
                      )}
                    </div>
                    <div className="border-t border-border pt-2">{note(r)}</div>
                  </li>
                ))}
              </ul>
            </>
          )}
          {loadMore}
        </TabsContent>

        {/* ---------------------------------------------- commission */}
        <TabsContent value="commission" className="p-2 sm:p-3">
          {commissions.length === 0 ? (
            <Empty>No commission in this period.</Empty>
          ) : (
            <>
              <div className="hidden md:block">
                <Table className="text-xs">
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead scope="col">Date</TableHead>
                      <TableHead scope="col">Code</TableHead>
                      <TableHead scope="col">Referee</TableHead>
                      <SortHead label="Volume" sortKey="volume" sort={comSort} onSort={setComSort} />
                      <SortHead label="Commission" sortKey="commission" sort={comSort} onSort={setComSort} />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedCommissions.map((c, i) => (
                      <TableRow key={c.id ?? i}>
                        <TableCell className="font-mono text-muted-foreground tabular-nums">{formatDate(c.date)}</TableCell>
                        <TableCell className="font-mono">{c.code ?? "—"}</TableCell>
                        <TableCell className="font-mono" title={c.address}>
                          {c.address ? shortenAddress(c.address) : "—"}
                        </TableCell>
                        <TableCell className="text-right">
                          <Usd value={c.volume} />
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="inline-flex flex-col items-end">
                            <span className="text-emerald-700 dark:text-emerald-400">
                              <Usd value={c.commission} dp={4} />
                            </span>
                            {c.bonus != null && c.bonus > 0 && (
                              <span className="text-[11px] text-muted-foreground">
                                incl. <Numeral value={c.bonus} rule="usd" dp={4} /> bonus
                              </span>
                            )}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <ul className="flex flex-col gap-2 md:hidden">
                {sortedCommissions.map((c, i) => (
                  <li key={c.id ?? i} className="grid grid-cols-3 gap-2 rounded-xl bg-container-high p-3">
                    <MobileField label="Date">
                      <span className="font-mono">{formatDate(c.date)}</span>
                    </MobileField>
                    <MobileField label="Code">
                      <span className="font-mono">{c.code ?? "—"}</span>
                    </MobileField>
                    <MobileField label="Volume" end>
                      <Usd value={c.volume} />
                    </MobileField>
                    <MobileField label="Referee">
                      <span className="font-mono">{c.address ? shortenAddress(c.address, 4, 4) : "—"}</span>
                    </MobileField>
                    <span />
                    <MobileField label="Commission" end>
                      <span className="text-emerald-700 dark:text-emerald-400">
                        <Usd value={c.commission} dp={4} />
                      </span>
                    </MobileField>
                  </li>
                ))}
              </ul>
            </>
          )}
          {loadMore}
        </TabsContent>

        {/* ---------------------------------------------- codes */}
        <TabsContent value="codes" className="p-2 sm:p-3">
          {codes.length === 0 ? (
            <Empty>You have no referral codes.</Empty>
          ) : (
            <>
              <div className="hidden md:block">
                <Table className="text-xs">
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead scope="col">Code</TableHead>
                      <TableHead scope="col">You / Referee</TableHead>
                      <TableHead scope="col" className="text-right">
                        Referees / Traders
                      </TableHead>
                      <TableHead scope="col" className="text-right">
                        Volume
                      </TableHead>
                      <TableHead scope="col" className="text-right">
                        Commission
                      </TableHead>
                      <TableHead scope="col" className="w-0">
                        <span className="sr-only">Actions</span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {codes.map((c) => (
                      <TableRow key={c.code}>
                        <TableCell className="font-mono font-medium text-primary">{c.code}</TableCell>
                        <TableCell className="font-mono tabular-nums">
                          {pct(c.keep)} / <span className="text-muted-foreground">{pct(c.referee)}</span>
                        </TableCell>
                        <TableCell className="text-right font-mono tabular-nums">
                          {c.referees.toLocaleString("en-US")}
                          {c.traders != null && <span className="text-muted-foreground"> / {c.traders.toLocaleString("en-US")}</span>}
                        </TableCell>
                        <TableCell className="text-right">
                          <Usd value={c.volume} />
                        </TableCell>
                        <TableCell className="text-right text-emerald-700 dark:text-emerald-400">
                          <Usd value={c.commission} dp={4} />
                        </TableCell>
                        <TableCell>
                          <span className="flex items-center justify-end gap-0.5">
                            {copyCode(c.code)}
                            {onEditCode && (
                              <button
                                type="button"
                                onClick={() => onEditCode(c.code)}
                                aria-label={`Edit code ${c.code}`}
                                className="focus-ring grid size-6 place-items-center rounded-md text-muted-foreground hover:bg-container-high hover:text-foreground"
                              >
                                <PencilIcon className="size-3" />
                              </button>
                            )}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <ul className="flex flex-col gap-2 md:hidden">
                {codes.map((c) => (
                  <li key={c.code} className="flex flex-col gap-2.5 rounded-xl bg-container-high p-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-sm font-medium text-primary">{c.code}</span>
                      <span className="flex items-center gap-0.5">
                        {copyCode(c.code)}
                        {onEditCode && (
                          <button
                            type="button"
                            onClick={() => onEditCode(c.code)}
                            aria-label={`Edit code ${c.code}`}
                            className="focus-ring grid size-6 place-items-center rounded-md text-muted-foreground hover:bg-container hover:text-foreground"
                          >
                            <PencilIcon className="size-3" />
                          </button>
                        )}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <MobileField label="You / Referee">
                        <span className="font-mono">
                          {pct(c.keep)} / {pct(c.referee)}
                        </span>
                      </MobileField>
                      <MobileField label="Volume">
                        <Usd value={c.volume} />
                      </MobileField>
                      <MobileField label="Commission" end>
                        <span className="text-emerald-700 dark:text-emerald-400">
                          <Usd value={c.commission} dp={4} />
                        </span>
                      </MobileField>
                      <MobileField label="Referees">
                        <span className="font-mono">{c.referees.toLocaleString("en-US")}</span>
                      </MobileField>
                      {c.traders != null && (
                        <MobileField label="Traders">
                          <span className="font-mono">{c.traders.toLocaleString("en-US")}</span>
                        </MobileField>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </TabsContent>
      </Tabs>
    </section>
  );
}
