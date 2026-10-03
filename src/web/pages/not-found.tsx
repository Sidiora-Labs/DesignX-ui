import { Link } from "wouter";
import { ArrowLeftIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";

export default function NotFound() {
  return (
    <div className="flex min-h-[60svh] items-center justify-center">
      <Empty>
        <EmptyHeader>
          <div className="mb-2 font-mono text-6xl font-medium tracking-[-0.04em] text-muted-foreground/40">404</div>
          <EmptyTitle>Page not found</EmptyTitle>
          <EmptyDescription>The page you're looking for doesn't exist or has moved.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button variant="tonal" render={<Link href="/docs" />}>
            <ArrowLeftIcon /> Back to docs
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  );
}
