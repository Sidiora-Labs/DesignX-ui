import { Field, FieldControl, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";

export default function FieldDemo() {
  return (
    <FieldSet className="w-full max-w-sm">
      <FieldLegend>Workspace</FieldLegend>
      <FieldGroup>
        <Field name="name">
          <FieldLabel>Workspace name</FieldLabel>
          <FieldControl placeholder="Acme Inc." required minLength={3} />
          <FieldDescription>Visible to everyone in your organization.</FieldDescription>
          <FieldError match="valueMissing">Please enter a name.</FieldError>
          <FieldError match="tooShort">Use at least 3 characters.</FieldError>
        </Field>
        <Field name="url">
          <FieldLabel>URL</FieldLabel>
          <FieldControl type="url" placeholder="https://acme.com" />
          <FieldError match="typeMismatch">Enter a valid URL.</FieldError>
        </Field>
        <Field orientation="horizontal" className="justify-between">
          <div className="grid gap-1">
            <FieldLabel>Public profile</FieldLabel>
            <FieldDescription>Show this workspace in search.</FieldDescription>
          </div>
          <Switch defaultChecked />
        </Field>
      </FieldGroup>
    </FieldSet>
  );
}
