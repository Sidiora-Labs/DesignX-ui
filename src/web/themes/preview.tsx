import * as React from "react";
import { ArrowUpRightIcon, BellIcon, CreditCardIcon, PlusIcon, SearchIcon, SparklesIcon, TrendingUpIcon, UsersIcon } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarGroup } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const BARS = [38, 52, 44, 68, 58, 82, 74, 96, 70, 88, 64, 92];
const SERIES = ["chart-1", "chart-2", "chart-3", "chart-4", "chart-5"];
const PEOPLE = [
  { name: "Ada Lovelace", email: "ada@acme.dev", role: "Owner", tone: "default" as const },
  { name: "Grace Hopper", email: "grace@acme.dev", role: "Admin", tone: "tonal" as const },
  { name: "Alan Turing", email: "alan@acme.dev", role: "Invited", tone: "outline" as const },
];
const initials = (n: string) =>
  n
    .split(" ")
    .map((p) => p[0])
    .join("");

function Stat({ icon: Icon, label, value, delta }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; delta: string }) {
  return (
    <Card variant="tonal" className="gap-3 py-5">
      <CardHeader>
        <CardDescription className="flex items-center gap-2">
          <Icon className="size-4" /> {label}
        </CardDescription>
        <CardTitle className="text-3xl tracking-[-0.03em] tabular-nums">{value}</CardTitle>
      </CardHeader>
      <CardContent>
        <Badge variant="success">
          <TrendingUpIcon /> {delta}
        </Badge>
      </CardContent>
    </Card>
  );
}

/** A small product surface built only from registry components, so a theme can be judged in context. */
export function ThemePreview() {
  return (
    <div className="flex flex-col gap-4 p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex items-center gap-2">
          <div className="relative hidden sm:block">
            <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search…" aria-label="Search" className="h-9 w-44 pl-9" />
          </div>
          <Button variant="ghost" size="icon-sm" aria-label="Notifications">
            <BellIcon />
          </Button>
          <Button size="sm">
            <PlusIcon /> New project
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat icon={CreditCardIcon} label="Revenue" value="$48,290" delta="12.4%" />
        <Stat icon={UsersIcon} label="Active users" value="2,841" delta="8.1%" />
        <Stat icon={SparklesIcon} label="Generations" value="19.2k" delta="23.0%" />
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Weekly volume</CardTitle>
            <CardDescription>Requests by product line, last 12 weeks.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex h-40 items-end gap-1.5" role="img" aria-label="Bar chart of weekly volume">
              {BARS.map((h, i) => (
                <div key={i} className="flex h-full flex-1 flex-col justify-end gap-0.5">
                  <div className="rounded-sm" style={{ height: `${h * 0.45}%`, background: "var(--chart-2)" }} />
                  <div className="rounded-sm" style={{ height: `${h * 0.55}%`, background: "var(--chart-1)" }} />
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              {SERIES.map((s, i) => (
                <span key={s} className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-full" style={{ background: `var(--${s})` }} /> Series {i + 1}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Workspace</CardTitle>
            <CardDescription>68.4 GB of 100 GB used</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <Progress value={68} />
            <div className="grid gap-2">
              <Label htmlFor="theme-preview-name">Project name</Label>
              <Input id="theme-preview-name" defaultValue="Launch plan" />
            </div>
            <div className="grid gap-3">
              <Label>Auto-archive after</Label>
              <Slider defaultValue={30} max={90} />
            </div>
            <Label className="justify-between">
              Weekly digest <Switch defaultChecked />
            </Label>
            <Label className="gap-2 font-normal text-muted-foreground">
              <Checkbox defaultChecked /> Notify the team on deploy
            </Label>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Team
              <AvatarGroup>
                {PEOPLE.map((p) => (
                  <Avatar key={p.name} className="size-7">
                    <AvatarFallback className="text-[10px]">{initials(p.name)}</AvatarFallback>
                  </Avatar>
                ))}
              </AvatarGroup>
            </CardTitle>
            <CardDescription>Three people have access to this workspace.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col">
            {PEOPLE.map((p) => (
              <div key={p.name} className="flex items-center gap-3 border-t border-outline-variant py-3 first:border-t-0 first:pt-0 last:pb-0">
                <Avatar className="size-9">
                  <AvatarFallback>{initials(p.name)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{p.name}</div>
                  <div className="truncate text-xs text-muted-foreground">{p.email}</div>
                </div>
                <Badge variant={p.tone}>{p.role}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex flex-col gap-4 lg:col-span-2">
          <Alert>
            <SparklesIcon />
            <AlertTitle>Draft ready</AlertTitle>
            <AlertDescription>Your launch plan was generated from 14 sources.</AlertDescription>
          </Alert>
          <Card variant="tonal" className="gap-4 py-5">
            <CardContent className="flex flex-wrap gap-2">
              <Button size="sm">Primary</Button>
              <Button size="sm" variant="tonal">
                Tonal
              </Button>
              <Button size="sm" variant="outline">
                Outline
              </Button>
              <Button size="sm" variant="ghost">
                Ghost
              </Button>
              <Button size="sm" variant="destructive">
                Delete
              </Button>
              <Button size="sm" variant="link">
                Link <ArrowUpRightIcon />
              </Button>
            </CardContent>
            <CardContent className="flex flex-wrap gap-1.5">
              <Badge>Default</Badge>
              <Badge variant="success">Live</Badge>
              <Badge variant="info">Beta</Badge>
              <Badge variant="warning">Pending</Badge>
              <Badge variant="destructive">Failed</Badge>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
