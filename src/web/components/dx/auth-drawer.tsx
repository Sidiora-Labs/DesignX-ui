import * as React from "react";
import { Drawer as DrawerPrimitive } from "@base-ui/react/drawer";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRightIcon, ChevronLeftIcon, FingerprintIcon, WalletIcon, XIcon } from "lucide-react";
import useMeasure from "react-use-measure";

import { cn } from "@/lib/utils";
import { InputOTP, InputOTPSlot } from "@/components/ui/input-otp";
import { MovingBorder } from "@/components/dx/moving-border";

/**
 * AuthDrawera floating sign-in sheet. Social providers, an
 * Email / Phone / Passkey switch, one-time-code verification and a wallet
 * list, with the sheet's height morphing between steps.
 */

type AuthMethod = "email" | "phone" | "passkey";
type AuthOption = { id: string; label: string; icon: React.ReactNode; badge?: string };
type View = "signin" | "otp" | "passkey" | "wallet";

type AuthDrawerProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Element that opens the drawer. */
  trigger?: React.ReactElement;
  title?: string;
  providers?: AuthOption[];
  wallets?: AuthOption[];
  methods?: AuthMethod[];
  onProvider?: (id: string) => void;
  onWallet?: (id: string) => void;
  /** Called before the code step; throw to stay on the form. */
  onSendCode?: (payload: { method: "email" | "phone"; value: string }) => void | Promise<void>;
  /** Return false to reject the code. */
  onVerify?: (payload: { method: "email" | "phone"; value: string; code: string }) => boolean | Promise<boolean>;
  /** Return false if the passkey prompt failed. */
  onPasskey?: () => boolean | Promise<boolean>;
  /** Fired after a code or passkey succeeds; the drawer closes itself. */
  onSuccess?: (payload: { method: AuthMethod; value?: string }) => void;
  className?: string;
};

const METHOD_LABEL: Record<AuthMethod, string> = { email: "Email", phone: "Phone", passkey: "Passkey" };
const PATTERN = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
  phone: /^\+?[\d\s\-()]{10,}$/,
};

const ease = [0.25, 1, 0.5, 1] as const;

function IconButton({ className, ...props }: React.ComponentProps<"button">) {
  return (
    <button
      type="button"
      className={cn(
        "state-layer focus-ring flex size-8 shrink-0 items-center justify-center rounded-full bg-container-high text-muted-foreground transition-transform active:scale-90 [&_svg]:size-4.5",
        className,
      )}
      {...props}
    />
  );
}

function Header({ title, onBack }: { title: string; onBack?: () => void }) {
  return (
    <div className="flex items-center gap-3 px-6 py-6">
      {onBack ? (
        <IconButton aria-label="Back" onClick={onBack}>
          <ChevronLeftIcon />
        </IconButton>
      ) : null}
      <DrawerPrimitive.Title className={cn("flex-1 text-xl font-semibold tracking-tight select-none", onBack && "text-center")}>
        {title}
      </DrawerPrimitive.Title>
      {onBack && <span className="size-8" />}
    </div>
  );
}

const pill =
  "focus-ring flex h-12 w-full items-center justify-center gap-2 rounded-full text-base font-semibold transition-[transform,background-color,opacity] duration-200 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50";

function AuthDrawer({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  trigger,
  title = "Sign in",
  providers = [],
  wallets = [],
  methods = ["email", "phone", "passkey"],
  onProvider,
  onWallet,
  onSendCode,
  onVerify,
  onPasskey,
  onSuccess,
  className,
}: AuthDrawerProps) {
  const [innerOpen, setInnerOpen] = React.useState(defaultOpen);
  const open = openProp ?? innerOpen;
  const [view, setView] = React.useState<View>("signin");
  const [method, setMethod] = React.useState<AuthMethod>(methods[0] ?? "email");
  const [value, setValue] = React.useState("");
  const [code, setCode] = React.useState("");
  const [status, setStatus] = React.useState<"idle" | "busy" | "error">("idle");
  const [ref, bounds] = useMeasure();
  const pillId = React.useId();

  const setOpen = (o: boolean) => {
    if (openProp === undefined) setInnerOpen(o);
    onOpenChange?.(o);
    if (!o) {
      window.setTimeout(() => {
        setView("signin");
        setCode("");
        setStatus("idle");
      }, 300);
    }
  };

  const go = (v: View) => {
    setStatus("idle");
    setCode("");
    setView(v);
  };

  const valid = method === "passkey" || PATTERN[method].test(value.trim());

  const succeed = (m: AuthMethod, v?: string) => {
    onSuccess?.({ method: m, value: v });
    setOpen(false);
  };

  const submit = async () => {
    if (!valid || status === "busy") return;
    if (method === "passkey") {
      go("passkey");
      setStatus("busy");
      const ok = onPasskey ? await onPasskey() : true;
      if (ok) succeed("passkey");
      else setStatus("error");
      return;
    }
    setStatus("busy");
    try {
      await onSendCode?.({ method, value: value.trim() });
      go("otp");
    } catch {
      setStatus("error");
    }
  };

  const verify = async (c: string) => {
    if (method === "passkey" || c.length < 6) return;
    setStatus("busy");
    const ok = onVerify ? await onVerify({ method, value: value.trim(), code: c }) : true;
    if (ok) succeed(method, value.trim());
    else {
      setStatus("error");
      setCode("");
    }
  };

  let content: React.ReactNode;
  if (view === "signin") {
    content = (
      <div>
        <Header title={title} />
        <div className="flex flex-col gap-2 px-6">
          {providers.length > 0 && (
            <div className="flex gap-2">
              {providers.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  aria-label={p.label}
                  title={p.label}
                  onClick={() => onProvider?.(p.id)}
                  className="state-layer focus-ring flex h-12 flex-1 items-center justify-center rounded-xl bg-container-high transition-transform active:scale-95 [&_svg]:size-4.5"
                >
                  {p.icon}
                </button>
              ))}
            </div>
          )}
          {methods.length > 1 && (
            <div role="tablist" aria-label="Sign-in method" className="flex h-12 gap-1 rounded-2xl bg-container-high p-1">
              {methods.map((m) => (
                <button
                  key={m}
                  type="button"
                  role="tab"
                  aria-selected={method === m}
                  onClick={() => {
                    setMethod(m);
                    setValue("");
                    setStatus("idle");
                  }}
                  className={cn(
                    "focus-ring relative flex flex-1 items-center justify-center rounded-xl text-sm font-semibold transition-colors",
                    method === m ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {method === m && (
                    <motion.span
                      layoutId={`${pillId}-method`}
                      className="absolute inset-0 rounded-xl bg-card shadow-[0_1px_2px_rgb(0_0_0/0.06)]"
                      transition={{ type: "spring", stiffness: 500, damping: 38 }}
                    />
                  )}
                  <span className="relative">{METHOD_LABEL[m]}</span>
                </button>
              ))}
            </div>
          )}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void submit();
            }}
            className={cn(
              "flex h-12 items-center gap-3 overflow-hidden rounded-2xl bg-container-high pr-1 pl-4 ring-inset transition-shadow focus-within:ring-1 focus-within:ring-foreground/25",
              status === "error" && "ring-1 ring-destructive",
            )}
          >
            {method === "passkey" ? (
              <span className="flex flex-1 items-center gap-3 text-muted-foreground">
                <FingerprintIcon className="size-5" />
                Continue with a passkey
              </span>
            ) : (
              <input
                type={method === "email" ? "email" : "tel"}
                inputMode={method === "email" ? "email" : "tel"}
                autoComplete={method === "email" ? "email" : "tel"}
                aria-label={METHOD_LABEL[method]}
                placeholder={method === "email" ? "you@company.com" : "+1 (555) 123-4567"}
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                  if (status === "error") setStatus("idle");
                }}
                className="min-w-0 flex-1 bg-transparent text-base font-medium outline-none placeholder:text-muted-foreground/70"
              />
            )}
            <button
              type="submit"
              aria-label="Continue"
              disabled={!valid || status === "busy"}
              className="focus-ring flex h-10 w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-[transform,opacity] active:scale-95 disabled:bg-container-highest disabled:text-muted-foreground"
            >
              <ArrowRightIcon className="size-5" />
            </button>
          </form>
        </div>
        {wallets.length > 0 ? (
          <div className="flex flex-col gap-4 px-6 pb-6">
            <div className="flex h-10 items-center gap-3 text-xs font-medium text-muted-foreground uppercase">
              <span className="h-px flex-1 bg-outline-variant" />
              Or
              <span className="h-px flex-1 bg-outline-variant" />
            </div>
            <button type="button" onClick={() => go("wallet")} className={cn(pill, "bg-primary text-primary-foreground")}>
              <WalletIcon className="size-5" />
              Connect wallet
            </button>
          </div>
        ) : (
          <div className="h-6" />
        )}
      </div>
    );
  } else if (view === "otp") {
    content = (
      <div>
        <Header title={`Confirm ${METHOD_LABEL[method].toLowerCase()}`} onBack={() => go("signin")} />
        <div className="flex flex-col gap-6 px-6 pb-6 text-center">
          <div>
            <p className="text-muted-foreground">Enter the code sent to</p>
            <p className="font-medium tracking-tight">{value}</p>
          </div>
          <motion.div
            animate={status === "error" ? { x: [0, -6, 6, -4, 4, 0] } : { x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <InputOTP
              maxLength={6}
              value={code}
              onChange={(c) => {
                setCode(c);
                if (status === "error") setStatus("idle");
              }}
              onComplete={(c: string) => void verify(c)}
              aria-label="One-time code"
              containerClassName="flex justify-between gap-2"
            >
              {Array.from({ length: 6 }, (_, i) => (
                <InputOTPSlot
                  key={i}
                  index={i}
                  className={cn("h-12 flex-1 rounded-xl border-0 bg-container-high", status === "error" && "ring-1 ring-destructive")}
                />
              ))}
            </InputOTP>
          </motion.div>
          <p aria-live="polite" className={cn("-mt-3 h-4 text-sm", status === "error" ? "text-destructive" : "text-muted-foreground")}>
            {status === "error" ? "That code didn't work. Try again." : status === "busy" ? "Verifying…" : ""}
          </p>
          <button
            type="button"
            disabled={code.length < 6 || status === "busy"}
            onClick={() => void verify(code)}
            className={cn(pill, "bg-success text-white")}
          >
            Verify code
          </button>
        </div>
      </div>
    );
  } else if (view === "passkey") {
    content = (
      <div>
        <Header title="Passkey" onBack={() => go("signin")} />
        <div className="flex flex-col items-center gap-6 px-6 pb-6 text-center">
          <MovingBorder duration={1500} radius="30px" gap="6px" className="size-[92px] bg-container-high" contentClassName="bg-container">
            <FingerprintIcon className="size-8 text-muted-foreground" />
          </MovingBorder>
          <div>
            <p className="text-xl font-medium tracking-tight">{status === "error" ? "Passkey failed" : "Waiting for passkey"}</p>
            <p className="mx-auto mt-1 max-w-xs text-sm text-pretty text-muted-foreground">
              {status === "error" ? "The prompt was dismissed or timed out." : "Follow the prompts from your device to continue."}
            </p>
          </div>
          <button
            type="button"
            onClick={() => (status === "error" ? void submit() : go("signin"))}
            className={cn(pill, status === "error" ? "bg-primary text-primary-foreground" : "bg-container-high")}
          >
            {status === "error" ? "Try again" : "Cancel"}
          </button>
        </div>
      </div>
    );
  } else {
    content = (
      <div>
        <Header title="Connect wallet" onBack={() => go("signin")} />
        <ul className="flex flex-col gap-2 px-6 pb-6">
          {wallets.map((w) => (
            <li key={w.id}>
              <button
                type="button"
                onClick={() => onWallet?.(w.id)}
                className="state-layer focus-ring flex h-15 w-full items-center justify-between gap-3 rounded-2xl bg-container-high px-4 text-left"
              >
                <span className="flex items-center gap-3 text-lg font-medium tracking-tight">
                  {w.label}
                  {w.badge && (
                    <span className="rounded-full border border-outline-variant bg-card px-2 py-0.5 text-xs font-semibold text-muted-foreground">
                      {w.badge}
                    </span>
                  )}
                </span>
                <span className="flex size-9 items-center justify-center rounded-lg [&_svg]:size-6">{w.icon}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <DrawerPrimitive.Root open={open} onOpenChange={setOpen}>
      {trigger && <DrawerPrimitive.Trigger render={trigger} />}
      <DrawerPrimitive.Portal>
        <DrawerPrimitive.Backdrop className="fixed inset-0 z-50 bg-background/70 backdrop-blur-sm transition-opacity duration-300 data-ending-style:opacity-0 data-starting-style:opacity-0" />
        <DrawerPrimitive.Viewport className="fixed inset-0 z-50 flex items-end justify-center p-4">
          <DrawerPrimitive.Popup
            data-slot="auth-drawer"
            className={cn(
              "relative w-full max-w-[380px] overflow-hidden rounded-[36px] bg-card text-card-foreground shadow-float outline-none",
              "[transform:translateY(var(--drawer-swipe-movement-y))] transition-transform duration-[450ms] ease-[cubic-bezier(0.32,0.72,0,1)] data-swiping:select-none data-starting-style:[transform:translateY(calc(100%+2rem))] data-ending-style:[transform:translateY(calc(100%+2rem))]",
              className,
            )}
          >
            <DrawerPrimitive.Close
              aria-label="Close"
              className="state-layer focus-ring absolute top-6 right-6 z-10 flex size-8 items-center justify-center rounded-full bg-container-high text-muted-foreground transition-transform active:scale-90"
            >
              <XIcon className="size-4.5" />
            </DrawerPrimitive.Close>
            <motion.div animate={{ height: bounds.height || "auto" }} transition={{ duration: 0.27, ease }}>
              <div ref={ref}>
                <AnimatePresence initial={false} mode="popLayout">
                  <motion.div
                    key={view}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.27, ease: [0.26, 0.08, 0.25, 1] }}
                  >
                    {content}
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          </DrawerPrimitive.Popup>
        </DrawerPrimitive.Viewport>
      </DrawerPrimitive.Portal>
    </DrawerPrimitive.Root>
  );
}

export { AuthDrawer };
export type { AuthDrawerProps, AuthMethod, AuthOption };
