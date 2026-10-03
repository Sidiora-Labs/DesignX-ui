import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeftIcon, CheckIcon, KeyRoundIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

export default function Forgot01() {
  const [state, setState] = React.useState<"idle" | "sending" | "sent">("idle");
  const [email, setEmail] = React.useState("");

  return (
    <div className="flex min-h-svh items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <AnimatePresence mode="wait" initial={false}>
          {state !== "sent" ? (
            <motion.form
              key="form"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="grid gap-6"
              onSubmit={(e) => {
                e.preventDefault();
                setState("sending");
                setTimeout(() => setState("sent"), 1100);
              }}
            >
              <div className="grid size-12 place-items-center rounded-full bg-container-high">
                <KeyRoundIcon className="size-5" />
              </div>
              <div className="grid gap-1.5">
                <h1 className="text-[28px] font-normal tracking-[-0.02em]">Forgot password?</h1>
                <p className="text-sm text-muted-foreground">Enter your email and we'll send you a reset link.</p>
              </div>
              <Field>
                <FieldLabel>Email</FieldLabel>
                <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" />
                <FieldError match="typeMismatch">Enter a valid email address.</FieldError>
              </Field>
              <Button type="submit" size="lg" disabled={state === "sending"}>
                {state === "sending" && <Spinner />} Send reset link
              </Button>
              {/* oxlint-disable-next-line jsx-a11y/anchor-has-content, jsx-a11y/control-has-associated-label */}
              <Button variant="ghost" type="button" render={<a href="#login-01" />}>
                <ArrowLeftIcon /> Back to sign in
              </Button>
            </motion.form>
          ) : (
            <motion.div
              key="sent"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", bounce: 0, duration: 0.5 }}
              className="grid justify-items-center gap-5 text-center"
            >
              <div className="grid size-14 place-items-center rounded-full bg-success-container text-success">
                <CheckIcon className="size-6" />
              </div>
              <div className="grid gap-1.5">
                <h1 className="text-[28px] font-normal tracking-[-0.02em]">Check your inbox</h1>
                <p className="text-sm text-muted-foreground">
                  If an account exists for <span className="font-medium text-foreground">{email}</span>, you'll get a link in a minute.
                </p>
              </div>
              <Button variant="tonal" onClick={() => setState("idle")}>
                Use a different email
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
