import { BookOpenIcon, CheckIcon, CopyIcon, KeyRoundIcon, PlusIcon, TriangleAlertIcon } from "lucide-react";
import { useId, useState, type ReactNode } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { shortenAddress } from "@/lib/trading";
import { cn } from "@/lib/utils";

export type ApiKeyItem = {
  /** Public key. Never pass secrets here. */
  key: string;
  label?: string;
  /** Permission values, matching `permissionOptions`. */
  permissions: string[];
  /** Allowed IPs. Empty means unrestricted. */
  ipAllowlist?: string[];
  createdAt?: number | Date | string;
  /** `null` for keys that never expire. */
  expiresAt?: number | Date | string | null;
};

export type ApiKeyPermissionOption = {
  value: string;
  label: string;
  description?: string;
  /** Always granted — rendered checked and disabled. */
  required?: boolean;
};

export type ApiKeyCreateValues = { permissions: string[]; ipAllowlist: string[] };

/** A freshly created key, returned by your backend. The secret is shown once. */
export type CreatedApiKey = {
  key: string;
  secret: string;
  accountId?: string;
  permissions?: string[];
  ipAllowlist?: string[];
};

export type ApiKeyCopyKind = "accountId" | "userId" | "key" | "secret" | "ip" | "info";

export interface ApiKeyManagerProps {
  keys: ApiKeyItem[];
  accountId?: string;
  userId?: string;
  permissionOptions?: ApiKeyPermissionOption[];
  /** Submit the create form. Return the new key through `createdKey`. */
  onCreate?: (values: ApiKeyCreateValues) => void;
  /** Show a spinner on the create button. */
  creating?: boolean;
  /** Disables creating and explains why — e.g. "Connect a wallet first" or the key limit. */
  createDisabledReason?: ReactNode;
  /** When set, the "API key created" dialog opens with the secret. */
  createdKey?: CreatedApiKey | null;
  onCreatedKeyDismiss?: () => void;
  onRevoke?: (item: ApiKeyItem) => void;
  /** Called after something is copied. */
  onCopy?: (text: string, kind: ApiKeyCopyKind) => void;
  onReadGuide?: () => void;
  formatDate?: (date: number | Date | string) => string;
  title?: ReactNode;
  description?: ReactNode;
  className?: string;
}

const DEFAULT_PERMISSIONS: ApiKeyPermissionOption[] = [
  { value: "read", label: "Read", description: "View balances, orders and positions.", required: true },
  { value: "trading", label: "Trading", description: "Place and cancel orders." },
];

const dateFormatter = new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short", day: "numeric" });
const defaultFormatDate = (d: number | Date | string) => (typeof d === "string" ? d : dateFormatter.format(d));

function CopyButton({ text, label, kind, onCopy, className }: { text: string; label: string; kind: ApiKeyCopyKind; onCopy?: ApiKeyManagerProps["onCopy"]; className?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      aria-label={copied ? `${label} copied` : `Copy ${label}`}
      onClick={() => {
        void navigator.clipboard?.writeText(text).catch(() => {});
        onCopy?.(text, kind);
        setCopied(true);
      }}
      onPointerLeave={() => setCopied(false)}
      onBlur={() => setCopied(false)}
      className={cn("focus-ring grid size-6 shrink-0 place-items-center rounded-md text-muted-foreground hover:bg-container-high hover:text-foreground", className)}
    >
      {copied ? <CheckIcon className="size-3 text-emerald-600 dark:text-emerald-400" /> : <CopyIcon className="size-3" />}
    </button>
  );
}

function CreateKeyDialog({
  open,
  onOpenChange,
  options,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  options: ApiKeyPermissionOption[];
  onSubmit: (values: ApiKeyCreateValues) => void;
}) {
  const id = useId();
  const required = options.filter((o) => o.required).map((o) => o.value);
  const [perms, setPerms] = useState<string[]>(required);
  const [ips, setIps] = useState("");
  const ipList = ips
    .split(/[\s,]+/)
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o);
        if (!o) {
          setPerms(required);
          setIps("");
        }
      }}
    >
      <DialogContent className="gap-5 sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create API key</DialogTitle>
          <DialogDescription>Choose what the key can do and, optionally, which IPs may use it.</DialogDescription>
        </DialogHeader>
        <fieldset className="flex flex-col gap-2">
          <legend className="mb-2 text-xs font-medium">Permissions</legend>
          {options.map((o) => {
            const checked = perms.includes(o.value);
            return (
              <div key={o.value} className="flex items-start gap-3 rounded-xl border border-border p-3">
                <Checkbox
                  id={`${id}-${o.value}`}
                  checked={checked}
                  disabled={o.required}
                  onCheckedChange={(c) => setPerms((p) => (c ? [...p, o.value] : p.filter((x) => x !== o.value)))}
                  className="mt-0.5"
                />
                <label htmlFor={`${id}-${o.value}`} className="flex flex-1 flex-col gap-0.5 text-sm">
                  <span className="font-medium">{o.label}</span>
                  {o.description && <span className="text-xs text-muted-foreground">{o.description}</span>}
                </label>
              </div>
            );
          })}
        </fieldset>
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${id}-ips`} className="text-xs font-medium">
            IP restriction <span className="font-normal text-muted-foreground">(optional)</span>
          </label>
          <textarea
            id={`${id}-ips`}
            value={ips}
            onChange={(e) => setIps(e.target.value)}
            rows={3}
            spellCheck={false}
            placeholder="Add IP addresses, separated by commas."
            className="min-h-20 w-full resize-none rounded-md border border-input bg-transparent px-3.5 py-2.5 font-mono text-xs outline-none placeholder:font-sans placeholder:text-muted-foreground/70 hover:border-foreground/30 focus-visible:border-foreground focus-visible:shadow-[0_0_0_3px_var(--outline-variant)]"
          />
          <span className="text-[11px] text-muted-foreground">{ipList.length === 0 ? "Without IPs, the key works from anywhere." : `${ipList.length} IP${ipList.length === 1 ? "" : "s"} allowed.`}</span>
        </div>
        <DialogFooter>
          <Button variant="tonal" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            disabled={perms.length === 0}
            onClick={() => {
              onSubmit({ permissions: perms, ipAllowlist: ipList });
              onOpenChange(false);
              setPerms(required);
              setIps("");
            }}
          >
            Create key
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function SecretRow({ label, value, kind, onCopy, mono = true }: { label: string; value: string; kind: ApiKeyCopyKind; onCopy?: ApiKeyManagerProps["onCopy"]; mono?: boolean }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[11px] text-muted-foreground">{label}</span>
      <div className="flex items-start gap-2 rounded-lg bg-container-high px-3 py-2">
        <span className={cn("min-w-0 flex-1 text-xs break-all", mono && "font-mono")}>{value}</span>
        <CopyButton text={value} label={label} kind={kind} onCopy={onCopy} className="-my-0.5" />
      </div>
    </div>
  );
}

/** Create, list and revoke API keys with permission badges and IP allowlists. Keys come from your backend. */
export function ApiKeyManager({
  keys,
  accountId,
  userId,
  permissionOptions = DEFAULT_PERMISSIONS,
  onCreate,
  creating,
  createDisabledReason,
  createdKey,
  onCreatedKeyDismiss,
  onRevoke,
  onCopy,
  onReadGuide,
  formatDate = defaultFormatDate,
  title = "API keys",
  description = "Create API keys to suit your trading needs. For your security, don't share your API keys with anyone.",
  className,
}: ApiKeyManagerProps) {
  const [createOpen, setCreateOpen] = useState(false);
  const [revokeTarget, setRevokeTarget] = useState<ApiKeyItem | null>(null);
  const labelOf = (v: string) => permissionOptions.find((o) => o.value === v)?.label ?? v;

  const permissionBadges = (item: ApiKeyItem) => (
    <span className="flex flex-wrap gap-1">
      {item.permissions.map((p) => (
        <Badge key={p} variant={p === "trading" ? "info" : "tonal"} className="px-2 text-[11px]">
          {labelOf(p)}
        </Badge>
      ))}
    </span>
  );
  const ipCell = (item: ApiKeyItem) =>
    item.ipAllowlist && item.ipAllowlist.length > 0 ? (
      <span className="flex items-center gap-1">
        <span className="font-mono text-xs">{item.ipAllowlist[0]}</span>
        {item.ipAllowlist.length > 1 && (
          <span className="text-[11px] text-muted-foreground" title={item.ipAllowlist.join(", ")}>
            +{item.ipAllowlist.length - 1}
          </span>
        )}
        <CopyButton text={item.ipAllowlist.join(",")} label="IP list" kind="ip" onCopy={onCopy} />
      </span>
    ) : (
      <span className="text-xs text-muted-foreground">Unrestricted</span>
    );
  const dateText = (d: ApiKeyItem["expiresAt"]) => (d == null ? "Never" : formatDate(d));
  const revokeButton = (item: ApiKeyItem) =>
    onRevoke && (
      <Button size="xs" variant="ghost" className="text-rose-600 dark:text-rose-400" onClick={() => setRevokeTarget(item)} aria-label={`Revoke key ${shortenAddress(item.key, 8, 4)}`}>
        Revoke
      </Button>
    );

  const createdInfo = createdKey
    ? [
        createdKey.accountId ?? accountId ? `Account ID: ${createdKey.accountId ?? accountId}` : null,
        `API key: ${createdKey.key}`,
        `Secret key: ${createdKey.secret}`,
        createdKey.ipAllowlist?.length ? `IP: ${createdKey.ipAllowlist.join(",")}` : null,
        createdKey.permissions?.length ? `Permissions: ${createdKey.permissions.map(labelOf).join(", ")}` : null,
      ]
        .filter(Boolean)
        .join("\n")
    : "";

  return (
    <section data-slot="api-key-manager" aria-label="API keys" className={cn("flex w-full flex-col gap-4 rounded-2xl border border-border bg-container p-4", className)}>
      <header className="flex flex-col gap-1">
        <h3 className="text-sm font-medium">{title}</h3>
        <p className="text-xs text-muted-foreground">{description}</p>
      </header>

      {(accountId || userId) && (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {accountId && (
            <div className="flex min-w-0 flex-col gap-0.5 rounded-xl bg-container-high px-3 py-2">
              <span className="text-[11px] text-muted-foreground">Account ID</span>
              <span className="flex items-center gap-1">
                <span className="truncate font-mono text-sm">{shortenAddress(accountId, 8, 6)}</span>
                <CopyButton text={accountId} label="account ID" kind="accountId" onCopy={onCopy} />
              </span>
            </div>
          )}
          {userId && (
            <div className="flex min-w-0 flex-col gap-0.5 rounded-xl bg-container-high px-3 py-2">
              <span className="text-[11px] text-muted-foreground">UID</span>
              <span className="flex items-center gap-1">
                <span className="truncate font-mono text-sm">{userId}</span>
                <CopyButton text={userId} label="UID" kind="userId" onCopy={onCopy} />
              </span>
            </div>
          )}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2">
        {onReadGuide ? (
          <Button size="xs" variant="ghost" onClick={onReadGuide} className="-ml-2 text-muted-foreground">
            <BookOpenIcon />
            Read API guide
          </Button>
        ) : (
          <span />
        )}
        {onCreate && (
          <div className="flex items-center gap-2">
            {createDisabledReason && <span className="text-[11px] text-muted-foreground">{createDisabledReason}</span>}
            <Button size="sm" disabled={!!createDisabledReason || creating} onClick={() => setCreateOpen(true)}>
              {creating ? <Spinner className="size-3.5" /> : <PlusIcon className="size-3.5" />}
              Create API key
            </Button>
          </div>
        )}
      </div>

      {keys.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border py-10 text-center text-sm text-muted-foreground">
          <KeyRoundIcon className="size-5" />
          No API keys yet.
        </div>
      ) : (
        <>
          <div className="-mx-4 hidden overflow-x-auto md:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {["API key", "Permissions", "Restricted IP", "Created", "Expires"].map((c) => (
                    <th key={c} scope="col" className="h-9 px-3 text-left text-[11px] font-normal whitespace-nowrap text-muted-foreground first:pl-4">
                      {c}
                    </th>
                  ))}
                  <th scope="col" className="h-9 pr-4 pl-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {keys.map((k) => (
                  <tr key={k.key} className="border-b border-border/60 last:border-0 hover:bg-container-high/50">
                    <th scope="row" className="h-12 pr-3 pl-4 text-left font-normal">
                      <span className="flex items-center gap-1">
                        <span className="flex flex-col">
                          {k.label && <span className="text-xs font-medium">{k.label}</span>}
                          <span className="font-mono text-xs text-muted-foreground">{shortenAddress(k.key, 10, 6)}</span>
                        </span>
                        <CopyButton text={k.key} label="API key" kind="key" onCopy={onCopy} />
                      </span>
                    </th>
                    <td className="px-3">{permissionBadges(k)}</td>
                    <td className="px-3">{ipCell(k)}</td>
                    <td className="px-3 text-xs whitespace-nowrap text-muted-foreground">{k.createdAt != null ? formatDate(k.createdAt) : "—"}</td>
                    <td className="px-3 text-xs whitespace-nowrap">{dateText(k.expiresAt)}</td>
                    <td className="pr-4 pl-3 text-right">{revokeButton(k)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ul className="flex flex-col gap-2 md:hidden">
            {keys.map((k) => (
              <li key={k.key} className="flex flex-col gap-2.5 rounded-xl border border-border p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="flex min-w-0 items-center gap-1">
                    <span className="flex min-w-0 flex-col">
                      {k.label && <span className="truncate text-xs font-medium">{k.label}</span>}
                      <span className="font-mono text-xs text-muted-foreground">{shortenAddress(k.key, 10, 6)}</span>
                    </span>
                    <CopyButton text={k.key} label="API key" kind="key" onCopy={onCopy} />
                  </span>
                  {revokeButton(k)}
                </div>
                {permissionBadges(k)}
                <dl className="grid grid-cols-2 gap-2 text-xs">
                  <div className="col-span-2 flex items-center justify-between gap-2">
                    <dt className="text-[11px] text-muted-foreground">Restricted IP</dt>
                    <dd>{ipCell(k)}</dd>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <dt className="text-[11px] text-muted-foreground">Created</dt>
                    <dd>{k.createdAt != null ? formatDate(k.createdAt) : "—"}</dd>
                  </div>
                  <div className="flex flex-col items-end gap-0.5">
                    <dt className="text-[11px] text-muted-foreground">Expires</dt>
                    <dd>{dateText(k.expiresAt)}</dd>
                  </div>
                </dl>
              </li>
            ))}
          </ul>
        </>
      )}

      {onCreate && <CreateKeyDialog open={createOpen} onOpenChange={setCreateOpen} options={permissionOptions} onSubmit={onCreate} />}

      <Dialog open={!!createdKey} onOpenChange={(o) => !o && onCreatedKeyDismiss?.()}>
        <DialogContent className="gap-4 sm:max-w-md">
          <DialogHeader>
            <DialogTitle>API key created</DialogTitle>
          </DialogHeader>
          <p className="flex items-start gap-2 rounded-xl bg-warning-container px-3 py-2 text-xs text-warning">
            <TriangleAlertIcon className="mt-px size-3.5 shrink-0" />
            Copy the secret now. Once you close this dialog it can't be shown again.
          </p>
          {createdKey && (
            <div className="flex flex-col gap-3">
              {(createdKey.accountId ?? accountId) && <SecretRow label="Account ID" value={(createdKey.accountId ?? accountId) as string} kind="accountId" onCopy={onCopy} />}
              <SecretRow label="API key" value={createdKey.key} kind="key" onCopy={onCopy} />
              <SecretRow label="Secret key" value={createdKey.secret} kind="secret" onCopy={onCopy} />
              {createdKey.ipAllowlist && createdKey.ipAllowlist.length > 0 && <SecretRow label="IP" value={createdKey.ipAllowlist.join(", ")} kind="ip" onCopy={onCopy} />}
              {createdKey.permissions && createdKey.permissions.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-muted-foreground">Permissions</span>
                  {permissionBadges({ key: createdKey.key, permissions: createdKey.permissions })}
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button
              variant="tonal"
              onClick={() => {
                void navigator.clipboard?.writeText(createdInfo).catch(() => {});
                onCopy?.(createdInfo, "info");
              }}
            >
              <CopyIcon className="size-3.5" />
              Copy API info
            </Button>
            <Button onClick={() => onCreatedKeyDismiss?.()}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!revokeTarget} onOpenChange={(o) => !o && setRevokeTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Revoke API key</AlertDialogTitle>
            <AlertDialogDescription>
              Revoke <span className="font-mono text-foreground">{revokeTarget ? shortenAddress(revokeTarget.key, 10, 6) : ""}</span>? Apps using it will stop
              working immediately.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                if (revokeTarget) onRevoke?.(revokeTarget);
                setRevokeTarget(null);
              }}
            >
              Revoke
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
