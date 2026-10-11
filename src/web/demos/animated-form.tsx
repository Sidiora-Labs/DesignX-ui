import { useState } from "react";

import Form, { FormControl, FormDescription, FormField, FormLabel, FormMessage } from "@/components/elements/animated-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AnimatedFormDemo() {
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  return (
    <Form
      className="flex w-full max-w-sm flex-col gap-4"
      errors={errors}
      onFormSubmit={(e) => {
        const email = new FormData(e.currentTarget).get("email")?.toString() ?? "";
        setErrors({ email: email.includes("@") ? undefined : "Enter a valid email address." });
      }}
    >
      <FormField name="email">
        <FormLabel>Email</FormLabel>
        <FormControl>
          <Input name="email" placeholder="you@designx.dev" />
        </FormControl>
        <FormDescription>We'll send release notes here.</FormDescription>
        <FormMessage />
      </FormField>
      <Button type="submit">Subscribe</Button>
    </Form>
  );
}
