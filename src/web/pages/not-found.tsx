import { Link } from "wouter";
import { ArrowLeftIcon } from "lucide-react";

import { btn, Serif } from "@/site/ui";

export default function NotFound() {
  return (
    <div className="site flex min-h-[60svh] flex-col items-center justify-center text-center">
      <div className="font-editorial text-[clamp(5rem,20vw,8rem)] leading-none tracking-[-0.025em] text-faint italic">404</div>
      <h1 className="mt-6 text-[28px] leading-[1.14] font-bold tracking-[-0.025em] text-ink">
        Page <Serif>not found</Serif>
      </h1>
      <p className="mt-4 max-w-sm text-lg leading-[1.33] tracking-[-0.025em] text-pencil">The page you're looking for doesn't exist or has moved.</p>
      <Link href="/docs" className={btn({ variant: "ghost", className: "mt-8" })}>
        <ArrowLeftIcon /> Back to docs
      </Link>
    </div>
  );
}
