import * as React from "react";

import { Button } from "@/components/ui/button";
import { Field, FieldControl, FieldError, FieldLabel } from "@/components/ui/field";
import { Form } from "@/components/ui/form";
import { toast } from "@/components/ui/sonner";

export default function FormDemo() {
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [loading, setLoading] = React.useState(false);

  return (
    <Form
      className="w-full max-w-sm"
      errors={errors}
      onSubmit={async (e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const handle = String(data.get("handle") ?? "");
        setLoading(true);
        await new Promise((r) => setTimeout(r, 700));
        setLoading(false);
        if (["admin", "root", "designx"].includes(handle.toLowerCase())) {
          setErrors({ handle: `@${handle} is already taken.` });
          return;
        }
        setErrors({});
        toast.success(`Claimed @${handle}`);
      }}
    >
      <Field name="handle">
        <FieldLabel>Handle</FieldLabel>
        <FieldControl placeholder="designx" required pattern="[a-zA-Z0-9_]+" />
        <FieldError match="valueMissing">Choose a handle.</FieldError>
        <FieldError match="patternMismatch">Letters, numbers and underscores only.</FieldError>
        <FieldError />
      </Field>
      <Button type="submit" disabled={loading}>
        {loading ? "Checking…" : "Claim handle"}
      </Button>
    </Form>
  );
}
