import * as React from "react";
import { CreditCardIcon, MoreHorizontalIcon, UploadIcon } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Meter } from "@/components/ui/meter";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/sonner";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useTheme } from "@/components/theme-provider";

const save = () => toast.success("Settings saved");

export function ProfileSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>This is how others will see you.</CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <div className="flex items-center gap-4">
            <Avatar className="size-16 text-lg">
              <AvatarFallback>AL</AvatarFallback>
            </Avatar>
            <div className="grid gap-1">
              <Button variant="outline" size="sm" className="w-fit">
                <UploadIcon /> Upload photo
              </Button>
              <span className="text-xs text-muted-foreground">PNG or JPG, up to 2 MB.</span>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel>Display name</FieldLabel>
              <Input defaultValue="Ada Lovelace" />
            </Field>
            <Field>
              <FieldLabel>Username</FieldLabel>
              <Input defaultValue="ada" />
            </Field>
          </div>
          <Field>
            <FieldLabel>Bio</FieldLabel>
            <Textarea defaultValue="Writing the first algorithm. Into analytical engines and poetical science." />
            <FieldDescription>Max 160 characters.</FieldDescription>
          </Field>
        </FieldGroup>
      </CardContent>
      <CardFooter className="justify-end">
        <Button onClick={save}>Save profile</Button>
      </CardFooter>
    </Card>
  );
}

const languages = [
  { label: "English (US)", value: "en-US" },
  { label: "Deutsch", value: "de" },
  { label: "日本語", value: "ja" },
];
const timezones = [
  { label: "London (GMT+1)", value: "Europe/London" },
  { label: "New York (GMT-4)", value: "America/New_York" },
  { label: "Tokyo (GMT+9)", value: "Asia/Tokyo" },
];

export function AccountSection() {
  const { theme, setTheme } = useTheme();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account & appearance</CardTitle>
        <CardDescription>Language, region and theme.</CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel>Language</FieldLabel>
              <Select items={languages} defaultValue="en-US">
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((l) => (
                    <SelectItem key={l.value} value={l.value}>
                      {l.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel>Time zone</FieldLabel>
              <Select items={timezones} defaultValue="Europe/London">
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timezones.map((l) => (
                    <SelectItem key={l.value} value={l.value}>
                      {l.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>
          <div className="grid gap-3">
            <Label>Theme</Label>
            <RadioGroup value={theme} onValueChange={(v) => setTheme(v as "light" | "dark" | "system")} className="grid grid-cols-3 gap-3">
              {(["light", "dark", "system"] as const).map((t) => (
                <Label
                  key={t}
                  className="flex cursor-pointer flex-col items-start gap-3 rounded-lg border border-border p-3 font-normal capitalize has-data-checked:border-foreground"
                >
                  <div
                    className={
                      "h-14 w-full rounded-md border border-outline-variant " +
                      (t === "light" ? "bg-white" : t === "dark" ? "bg-[#121317]" : "bg-gradient-to-r from-white to-[#121317]")
                    }
                  />
                  <span className="flex items-center gap-2">
                    <RadioGroupItem value={t} /> {t}
                  </span>
                </Label>
              ))}
            </RadioGroup>
          </div>
        </FieldGroup>
      </CardContent>
    </Card>
  );
}

const notifications = [
  { id: "mentions", title: "Mentions", desc: "When someone @mentions you.", on: true },
  { id: "comments", title: "Comments", desc: "Replies on threads you follow.", on: true },
  { id: "digest", title: "Weekly digest", desc: "A summary of workspace activity.", on: false },
  { id: "product", title: "Product updates", desc: "New features and improvements.", on: false },
];

export function NotificationsSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>Choose what you hear about.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-0">
        {notifications.map((n, i) => (
          <React.Fragment key={n.id}>
            {i > 0 && <Separator className="my-4" />}
            <div className="flex items-center justify-between gap-6">
              <div className="grid gap-0.5">
                <Label htmlFor={`n-${n.id}`}>{n.title}</Label>
                <span className="text-[13px] text-muted-foreground">{n.desc}</span>
              </div>
              <Switch id={`n-${n.id}`} defaultChecked={n.on} onCheckedChange={(v) => toast(`${n.title} ${v ? "on" : "off"}`)} />
            </div>
          </React.Fragment>
        ))}
      </CardContent>
    </Card>
  );
}

export function BillingSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Billing <Badge variant="info">Pro</Badge>
        </CardTitle>
        <CardDescription>$48 per month, renews Nov 1, 2026.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-5">
        {[
          ["Seats", 9, 12],
          ["Storage", 41, 50],
          ["API calls", 72, 100],
        ].map(([label, used, total]) => (
          <div key={label} className="grid gap-2">
            <div className="flex justify-between text-[13px]">
              <span className="font-medium">{label}</span>
              <span className="text-muted-foreground tabular-nums">
                {used} / {total}
                {label === "Storage" ? " GB" : label === "API calls" ? "k" : ""}
              </span>
            </div>
            <Meter value={((used as number) / (total as number)) * 100} aria-label={`${label} usage`} />
          </div>
        ))}
        <div className="flex items-center gap-3 rounded-lg bg-container p-3">
          <CreditCardIcon className="size-5 text-muted-foreground" />
          <div className="flex-1 text-sm">
            Visa ending in 4242 <span className="text-muted-foreground">· Expires 08/28</span>
          </div>
          <Button variant="outline" size="sm">
            Update
          </Button>
        </div>
      </CardContent>
      <CardFooter className="justify-between">
        <Button variant="ghost">View invoices</Button>
        <Button variant="tonal">Change plan</Button>
      </CardFooter>
    </Card>
  );
}

const members = [
  { name: "Ada Lovelace", email: "ada@acme.com", role: "Owner" },
  { name: "Grace Hopper", email: "grace@acme.com", role: "Admin" },
  { name: "Alan Turing", email: "alan@acme.com", role: "Member" },
  { name: "Katherine Johnson", email: "kj@acme.com", role: "Member" },
];

export function TeamSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Team</CardTitle>
        <CardDescription>Invite and manage workspace members.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-5">
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            toast.success("Invite sent");
          }}
        >
          <Input type="email" required placeholder="teammate@acme.com" aria-label="Invite email" />
          <Button type="submit">Invite</Button>
        </form>
        <div className="grid gap-1">
          {members.map((m) => (
            <div key={m.email} className="flex items-center gap-3 rounded-lg p-2 hover:bg-container">
              <Avatar className="size-9">
                <AvatarFallback>
                  {m.name
                    .split(" ")
                    .map((p) => p[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium">{m.name}</div>
                <div className="truncate text-xs text-muted-foreground">{m.email}</div>
              </div>
              <Badge variant={m.role === "Owner" ? "default" : "tonal"}>{m.role}</Badge>
              <DropdownMenu>
                <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" aria-label={`Manage ${m.name}`} />}>
                  <MoreHorizontalIcon />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Make admin</DropdownMenuItem>
                  <DropdownMenuItem variant="destructive">Remove</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function DangerSection() {
  return (
    <Card className="border-destructive/30">
      <CardHeader>
        <CardTitle className="text-destructive">Danger zone</CardTitle>
        <CardDescription>Permanently delete this workspace and all of its data.</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button variant="destructive" onClick={() => toast.error("Deletion requires owner confirmation")}>
          Delete workspace
        </Button>
      </CardFooter>
    </Card>
  );
}
