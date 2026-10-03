import { BellIcon } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const variants = ["default", "outline", "info", "success", "warning", "destructive"] as const;

export default function AlertVariants() {
  return (
    <div className="grid w-full max-w-2xl gap-3 sm:grid-cols-2">
      {variants.map((v) => (
        <Alert key={v} variant={v}>
          <BellIcon />
          <AlertTitle className="capitalize">{v}</AlertTitle>
          <AlertDescription>A short supporting message.</AlertDescription>
        </Alert>
      ))}
    </div>
  );
}
