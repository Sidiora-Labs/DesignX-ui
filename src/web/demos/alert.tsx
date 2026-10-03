import { CircleCheckIcon, InfoIcon, TriangleAlertIcon } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function AlertDemo() {
  return (
    <div className="grid w-full max-w-lg gap-3">
      <Alert>
        <InfoIcon />
        <AlertTitle>Heads up</AlertTitle>
        <AlertDescription>You can add components to your app using the CLI.</AlertDescription>
      </Alert>
      <Alert variant="success">
        <CircleCheckIcon />
        <AlertTitle>Deployment complete</AlertTitle>
        <AlertDescription>Your changes are live on production.</AlertDescription>
      </Alert>
      <Alert variant="destructive">
        <TriangleAlertIcon />
        <AlertTitle>Payment failed</AlertTitle>
        <AlertDescription>Update your billing details to keep your workspace active.</AlertDescription>
      </Alert>
    </div>
  );
}
