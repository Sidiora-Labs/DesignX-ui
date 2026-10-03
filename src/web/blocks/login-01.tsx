import * as React from "react";
import { FaApple, FaGithub, FaGoogle } from "react-icons/fa6";

import { GlowBorder } from "@/components/dx/glow-border";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldError, FieldGroup, FieldLabel, FieldSeparator } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { Spinner } from "@/components/ui/spinner";

export default function Login01() {
  const [loading, setLoading] = React.useState(false);
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Signed in", { description: "Welcome back, Ada." });
    }, 1200);
  };

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex items-center gap-2 font-medium">
          <div className="grid size-7 place-items-center rounded-md bg-primary text-[11px] font-semibold text-primary-foreground">DX</div>
          Acme Inc.
        </div>
        <div className="flex flex-1 items-center justify-center">
          <form onSubmit={onSubmit} className="w-full max-w-sm">
            <FieldGroup>
              <div className="grid gap-1 text-center">
                <h1 className="text-[28px] font-normal tracking-[-0.02em]">Welcome back</h1>
                <p className="text-sm text-muted-foreground">Sign in to continue to your workspace.</p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <Button variant="outline" type="button" aria-label="Continue with Google">
                  <FaGoogle />
                </Button>
                <Button variant="outline" type="button" aria-label="Continue with Apple">
                  <FaApple />
                </Button>
                <Button variant="outline" type="button" aria-label="Continue with GitHub">
                  <FaGithub />
                </Button>
              </div>
              <FieldSeparator>or continue with email</FieldSeparator>
              <Field>
                <FieldLabel>Email</FieldLabel>
                <Input type="email" placeholder="you@company.com" required autoComplete="email" />
                <FieldError match="typeMismatch">Enter a valid email address.</FieldError>
              </Field>
              <Field>
                <div className="flex items-center justify-between">
                  <FieldLabel>Password</FieldLabel>
                  <a href="#forgot-01" className="text-[13px] text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
                    Forgot password?
                  </a>
                </div>
                <Input type="password" required autoComplete="current-password" />
              </Field>
              <Label className="gap-2 font-normal">
                <Checkbox defaultChecked /> Keep me signed in
              </Label>
              <Button type="submit" size="lg" className="w-full" disabled={loading}>
                {loading && <Spinner />} Sign in
              </Button>
              <p className="text-center text-[13px] text-muted-foreground">
                Don't have an account?{" "}
                <a href="#signup-01" className="text-foreground underline underline-offset-4">
                  Sign up
                </a>
              </p>
            </FieldGroup>
          </form>
        </div>
      </div>
      <div className="relative hidden overflow-hidden bg-container lg:block">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,var(--dx-blue-2),transparent_45%),radial-gradient(circle_at_80%_70%,var(--dx-purple-2),transparent_45%),radial-gradient(circle_at_40%_90%,var(--dx-pink-2),transparent_40%)] opacity-70 dark:opacity-25" />
        <div className="relative flex h-full flex-col justify-end p-10">
          <div className="relative max-w-md rounded-[28px] bg-background/70 backdrop-blur-xl">
            <GlowBorder intensity="xl" duration={8} />
            <blockquote className="relative grid gap-4 p-6">
              <p className="text-lg leading-relaxed">
                "DX UI let us ship a consistent product across four teams in a quarter. It feels like one designer built everything."
              </p>
              <footer className="text-sm text-muted-foreground">Sofia Davis, Head of Design</footer>
            </blockquote>
          </div>
        </div>
      </div>
    </div>
  );
}
