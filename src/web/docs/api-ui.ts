import type { ApiDoc } from "./api";

/** Component API docs, A–M. */
export const uiApi: Record<string, ApiDoc> = {
  accordion: {
    usage: `import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

<Accordion defaultValue={["item-1"]}>
  <AccordionItem value="item-1">
    <AccordionTrigger>Is it accessible?</AccordionTrigger>
    <AccordionContent>Yes. It follows the WAI-ARIA pattern.</AccordionContent>
  </AccordionItem>
</Accordion>`,
    props: [
      {
        component: "Accordion",
        rows: [
          ["value", "any[]", undefined, "Controlled open items."],
          ["defaultValue", "any[]", undefined, "Initially open items."],
          ["onValueChange", "(value: any[]) => void"],
          ["multiple", "boolean", "false", "Allow more than one item open at once."],
          ["disabled", "boolean", "false"],
        ],
      },
      { component: "AccordionItem", rows: [["value", "any", undefined, "Unique identifier."], ["disabled", "boolean", "false"]] },
    ],
  },
  alert: {
    usage: `import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

<Alert variant="info">
  <InfoIcon />
  <AlertTitle>Heads up</AlertTitle>
  <AlertDescription>You can add components using the CLI.</AlertDescription>
</Alert>`,
    exampleTitles: { variants: "All variants" },
    props: [
      {
        component: "Alert",
        rows: [["variant", '"default" | "outline" | "destructive" | "success" | "warning" | "info"', '"default"']],
      },
    ],
  },
  "alert-dialog": {
    usage: `import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

<AlertDialog>
  <AlertDialogTrigger render={<Button variant="outline" />}>Delete</AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
      <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction variant="destructive">Delete</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>`,
    props: [
      { component: "AlertDialog", rows: [["open", "boolean"], ["defaultOpen", "boolean", "false"], ["onOpenChange", "(open: boolean) => void"]] },
      { component: "AlertDialogAction", rows: [["variant", "ButtonVariant", '"default"', "Any Button variant."]] },
      { component: "AlertDialogMedia", description: "Optional icon slot shown above the title.", rows: [["className", "string"]] },
    ],
  },
  "aspect-ratio": {
    usage: `import { AspectRatio } from "@/components/ui/aspect-ratio"

<AspectRatio ratio={16 / 9}>
  <img src="..." alt="..." className="size-full rounded-lg object-cover" />
</AspectRatio>`,
    props: [{ component: "AspectRatio", rows: [["ratio", "number", "1", "Width divided by height."]] }],
  },
  avatar: {
    usage: `import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

<Avatar>
  <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
  <AvatarFallback>CN</AvatarFallback>
</Avatar>`,
    props: [
      { component: "AvatarImage", rows: [["src", "string"], ["alt", "string"]] },
      { component: "AvatarFallback", rows: [["delay", "number", undefined, "Milliseconds to wait before showing the fallback."]] },
    ],
  },
  badge: {
    usage: `import { Badge } from "@/components/ui/badge"

<Badge variant="success">Active</Badge>`,
    props: [
      {
        component: "Badge",
        rows: [
          ["variant", '"default" | "tonal" | "outline" | "destructive" | "success" | "warning" | "info"', '"default"'],
          ["render", "ReactElement", undefined, "Render as another element, e.g. a link."],
        ],
      },
    ],
  },
  breadcrumb: {
    usage: `import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem><BreadcrumbLink href="/">Home</BreadcrumbLink></BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem><BreadcrumbPage>Breadcrumb</BreadcrumbPage></BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>`,
    props: [{ component: "BreadcrumbLink", rows: [["render", "ReactElement", undefined, "Use your router's Link."]] }],
  },
  button: {
    usage: `import { Button } from "@/components/ui/button"

<Button variant="tonal">Button</Button>

// Render as a link
<Button render={<a href="/docs" />}>Docs</Button>`,
    exampleTitles: { variants: "Variants", sizes: "Sizes", loading: "Loading", protected: "Protected" },
    props: [
      {
        component: "Button",
        rows: [
          ["variant", '"default" | "tonal" | "outline" | "ghost" | "protected" | "destructive" | "link"', '"default"'],
          ["size", '"xs" | "sm" | "default" | "lg" | "icon" | "icon-xs" | "icon-sm" | "icon-lg"', '"default"'],
          ["render", "ReactElement", undefined, "Swap the rendered element while keeping styles."],
          ["disabled", "boolean", "false"],
        ],
      },
    ],
  },
  "button-group": {
    usage: `import { ButtonGroup } from "@/components/ui/button-group"

<ButtonGroup>
  <Button variant="outline">Archive</Button>
  <Button variant="outline">Report</Button>
</ButtonGroup>`,
    props: [{ component: "ButtonGroup", rows: [["orientation", '"horizontal" | "vertical"', '"horizontal"']] }],
  },
  calendar: {
    usage: `import { Calendar } from "@/components/ui/calendar"

const [date, setDate] = React.useState<Date | undefined>(new Date())

<Calendar mode="single" selected={date} onSelect={setDate} />`,
    notes: "Calendar forwards every prop to React DayPicker v9.",
    exampleTitles: { range: "Range" },
    props: [
      {
        component: "Calendar",
        rows: [
          ["mode", '"single" | "multiple" | "range"'],
          ["selected", "Date | Date[] | DateRange"],
          ["onSelect", "(value) => void"],
          ["numberOfMonths", "number", "1"],
          ["showOutsideDays", "boolean", "true"],
          ["captionLayout", '"label" | "dropdown"', '"label"'],
        ],
      },
    ],
  },
  card: {
    usage: `import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

<Card>
  <CardHeader>
    <CardTitle>Card title</CardTitle>
    <CardDescription>Card description</CardDescription>
    <CardAction>…</CardAction>
  </CardHeader>
  <CardContent>…</CardContent>
  <CardFooter>…</CardFooter>
</Card>`,
    exampleTitles: { variants: "Variants" },
    props: [{ component: "Card", rows: [["variant", '"outline" | "tonal" | "elevated"', '"outline"']] }],
  },
  carousel: {
    usage: `import { Carousel, CarouselContent, CarouselDots, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"

<Carousel>
  <CarouselContent>
    <CarouselItem>…</CarouselItem>
    <CarouselItem>…</CarouselItem>
  </CarouselContent>
  <CarouselPrevious />
  <CarouselNext />
  <CarouselDots />
</Carousel>`,
    props: [
      {
        component: "Carousel",
        rows: [
          ["opts", "EmblaOptionsType", undefined, "Embla options (loop, align…)."],
          ["plugins", "EmblaPluginType[]"],
          ["orientation", '"horizontal" | "vertical"', '"horizontal"'],
          ["setApi", "(api: CarouselApi) => void"],
        ],
      },
    ],
  },
  chart: {
    usage: `import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"

const config = {
  desktop: { label: "Desktop", color: "var(--chart-1)" },
} satisfies ChartConfig

<ChartContainer config={config} className="h-64 w-full">
  <BarChart data={data}>
    <Bar dataKey="desktop" fill="var(--color-desktop)" radius={8} />
    <ChartTooltip content={<ChartTooltipContent />} />
  </BarChart>
</ChartContainer>`,
    align: "start",
    exampleTitles: { bar: "Bar chart" },
    props: [
      { component: "ChartContainer", rows: [["config", "ChartConfig", undefined, "Maps series keys to label, icon and color."]] },
      {
        component: "ChartTooltipContent",
        rows: [
          ["indicator", '"line" | "dot" | "dashed"', '"dot"'],
          ["hideLabel", "boolean", "false"],
          ["hideIndicator", "boolean", "false"],
          ["nameKey", "string"],
          ["labelKey", "string"],
        ],
      },
      { component: "ChartLegendContent", rows: [["nameKey", "string"], ["hideIcon", "boolean", "false"]] },
    ],
  },
  checkbox: {
    usage: `import { Checkbox } from "@/components/ui/checkbox"

<Checkbox id="terms" />
<Label htmlFor="terms">Accept terms</Label>`,
    props: [
      {
        component: "Checkbox",
        rows: [
          ["checked", "boolean"],
          ["defaultChecked", "boolean", "false"],
          ["onCheckedChange", "(checked: boolean) => void"],
          ["indeterminate", "boolean", "false"],
          ["disabled", "boolean", "false"],
        ],
      },
    ],
  },
  collapsible: {
    usage: `import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

<Collapsible>
  <CollapsibleTrigger>Show more</CollapsibleTrigger>
  <CollapsibleContent>…</CollapsibleContent>
</Collapsible>`,
    props: [{ component: "Collapsible", rows: [["open", "boolean"], ["defaultOpen", "boolean", "false"], ["onOpenChange", "(open: boolean) => void"]] }],
  },
  combobox: {
    usage: `import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from "@/components/ui/combobox"

<Combobox items={frameworks}>
  <ComboboxInput placeholder="Select a framework" />
  <ComboboxContent>
    <ComboboxEmpty>No results.</ComboboxEmpty>
    <ComboboxList>
      {(item) => <ComboboxItem key={item} value={item}>{item}</ComboboxItem>}
    </ComboboxList>
  </ComboboxContent>
</Combobox>`,
    exampleTitles: { multiple: "Multiple with chips" },
    props: [
      {
        component: "Combobox",
        rows: [
          ["items", "T[]"],
          ["value", "T | T[]"],
          ["onValueChange", "(value) => void"],
          ["multiple", "boolean", "false"],
        ],
      },
      { component: "ComboboxInput", rows: [["showTrigger", "boolean", "true"], ["showClear", "boolean", "false"]] },
      { component: "ComboboxChips", description: "Chip container for multiple mode. Use with useComboboxAnchor().", rows: [["ref", "Ref<HTMLDivElement>"]] },
    ],
  },
  command: {
    usage: `import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"

<Command>
  <CommandInput placeholder="Type a command…" />
  <CommandList>
    <CommandEmpty>No results.</CommandEmpty>
    <CommandGroup heading="Suggestions">
      <CommandItem>Calendar</CommandItem>
    </CommandGroup>
  </CommandList>
</Command>`,
    exampleTitles: { dialog: "Command dialog" },
    props: [
      { component: "CommandDialog", rows: [["open", "boolean"], ["onOpenChange", "(open: boolean) => void"], ["title", "string", '"Command palette"']] },
      { component: "CommandItem", rows: [["value", "string"], ["onSelect", "(value: string) => void"], ["disabled", "boolean", "false"]] },
    ],
  },
  "context-menu": {
    usage: `import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu"

<ContextMenu>
  <ContextMenuTrigger>Right click</ContextMenuTrigger>
  <ContextMenuContent>
    <ContextMenuItem>Profile</ContextMenuItem>
  </ContextMenuContent>
</ContextMenu>`,
    props: [{ component: "ContextMenuItem", rows: [["variant", '"default" | "destructive"', '"default"'], ["inset", "boolean", "false"]] }],
  },
  "data-table": {
    usage: `import { DataTable, DataTableColumnHeader } from "@/components/ui/data-table"

const columns: ColumnDef<Payment>[] = [
  { accessorKey: "email", header: ({ column }) => <DataTableColumnHeader column={column} title="Email" /> },
]

<DataTable columns={columns} data={payments} filterColumn="email" />`,
    align: "start",
    props: [
      {
        component: "DataTable",
        rows: [
          ["columns", "ColumnDef<TData>[]"],
          ["data", "TData[]"],
          ["filterColumn", "string", undefined, "Column id the search input filters."],
          ["filterPlaceholder", "string", '"Filter…"'],
          ["pageSize", "number", "8"],
          ["toolbar", "ReactNode", undefined, "Extra controls rendered next to the filter."],
        ],
      },
      { component: "DataTableColumnHeader", rows: [["column", "Column<TData>"], ["title", "string"]] },
    ],
  },
  "date-picker": {
    usage: `import { DatePicker, DateRangePicker } from "@/components/ui/date-picker"

const [date, setDate] = React.useState<Date>()

<DatePicker value={date} onChange={setDate} />`,
    props: [
      { component: "DatePicker", rows: [["value", "Date"], ["onChange", "(date?: Date) => void"], ["placeholder", "string", '"Pick a date"']] },
      { component: "DateRangePicker", rows: [["value", "DateRange"], ["onChange", "(range?: DateRange) => void"]] },
    ],
  },
  dialog: {
    usage: `import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

<Dialog>
  <DialogTrigger render={<Button variant="outline" />}>Open</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Edit profile</DialogTitle>
      <DialogDescription>Make changes to your profile.</DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>`,
    props: [
      { component: "Dialog", rows: [["open", "boolean"], ["defaultOpen", "boolean", "false"], ["onOpenChange", "(open: boolean) => void"], ["modal", "boolean", "true"]] },
      { component: "DialogContent", rows: [["showCloseButton", "boolean", "true"]] },
    ],
  },
  drawer: {
    usage: `import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"

<Drawer>
  <DrawerTrigger render={<Button variant="outline" />}>Open</DrawerTrigger>
  <DrawerContent>
    <DrawerHeader><DrawerTitle>Move goal</DrawerTitle></DrawerHeader>
  </DrawerContent>
</Drawer>`,
    props: [{ component: "Drawer", rows: [["open", "boolean"], ["onOpenChange", "(open: boolean) => void"]] }],
  },
  "dropdown-menu": {
    usage: `import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

<DropdownMenu>
  <DropdownMenuTrigger render={<Button variant="outline" />}>Open</DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>Profile</DropdownMenuItem>
    <DropdownMenuItem variant="destructive">Log out</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>`,
    props: [
      { component: "DropdownMenuContent", rows: [["side", '"top" | "right" | "bottom" | "left"', '"bottom"'], ["align", '"start" | "center" | "end"', '"start"'], ["sideOffset", "number", "6"]] },
      { component: "DropdownMenuItem", rows: [["variant", '"default" | "destructive"', '"default"'], ["inset", "boolean", "false"]] },
    ],
  },
  empty: {
    usage: `import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"

<Empty>
  <EmptyHeader>
    <EmptyMedia variant="icon"><FolderIcon /></EmptyMedia>
    <EmptyTitle>No projects</EmptyTitle>
    <EmptyDescription>Create your first project.</EmptyDescription>
  </EmptyHeader>
  <EmptyContent><Button>New project</Button></EmptyContent>
</Empty>`,
    props: [{ component: "EmptyMedia", rows: [["variant", '"default" | "icon"', '"default"']] }],
  },
  field: {
    usage: `import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"

<Field>
  <FieldLabel>Email</FieldLabel>
  <Input type="email" />
  <FieldDescription>We'll never share it.</FieldDescription>
  <FieldError>Enter a valid email.</FieldError>
</Field>`,
    props: [{ component: "Field", rows: [["name", "string"], ["invalid", "boolean"], ["disabled", "boolean", "false"], ["validate", "(value) => string | null"]] }],
  },
  form: {
    usage: `import { Form } from "@/components/ui/form"

<Form errors={errors} onClearErrors={setErrors} onSubmit={handleSubmit}>
  <Field name="email">…</Field>
</Form>`,
    props: [{ component: "Form", rows: [["errors", "Record<string, string | string[]>"], ["onClearErrors", "(errors) => void"]] }],
  },
  "hover-card": {
    usage: `import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"

<HoverCard>
  <HoverCardTrigger href="#">@designx</HoverCardTrigger>
  <HoverCardContent>…</HoverCardContent>
</HoverCard>`,
    props: [{ component: "HoverCardTrigger", rows: [["delay", "number", "600"], ["closeDelay", "number", "300"]] }],
  },
  input: {
    usage: `import { Input } from "@/components/ui/input"

<Input type="email" placeholder="Email" />`,
    props: [{ component: "Input", rows: [["type", "string", '"text"'], ["disabled", "boolean", "false"], ["aria-invalid", "boolean", undefined, "Shows the destructive outline."]] }],
  },
  "input-group": {
    usage: `import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group"

<InputGroup>
  <InputGroupAddon><SearchIcon /></InputGroupAddon>
  <InputGroupInput placeholder="Search…" />
  <InputGroupAddon align="inline-end"><Kbd>⌘K</Kbd></InputGroupAddon>
</InputGroup>`,
    props: [{ component: "InputGroupAddon", rows: [["align", '"inline-start" | "inline-end" | "block-start" | "block-end"', '"inline-start"']] }],
  },
  "input-otp": {
    usage: `import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp"

<InputOTP maxLength={6}>
  <InputOTPGroup>
    <InputOTPSlot index={0} /><InputOTPSlot index={1} /><InputOTPSlot index={2} />
  </InputOTPGroup>
  <InputOTPSeparator />
  <InputOTPGroup>
    <InputOTPSlot index={3} /><InputOTPSlot index={4} /><InputOTPSlot index={5} />
  </InputOTPGroup>
</InputOTP>`,
    props: [{ component: "InputOTP", rows: [["maxLength", "number"], ["value", "string"], ["onChange", "(value: string) => void"], ["pattern", "string"]] }],
  },
  kbd: {
    usage: `import { Kbd, KbdGroup } from "@/components/ui/kbd"

<KbdGroup><Kbd>⌘</Kbd><Kbd>K</Kbd></KbdGroup>`,
  },
  label: {
    usage: `import { Label } from "@/components/ui/label"

<Label htmlFor="email">Email</Label>`,
  },
  menubar: {
    usage: `import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar"

<Menubar>
  <MenubarMenu>
    <MenubarTrigger>File</MenubarTrigger>
    <MenubarContent>
      <MenubarItem>New tab</MenubarItem>
    </MenubarContent>
  </MenubarMenu>
</Menubar>`,
  },
  meter: {
    usage: `import { Meter } from "@/components/ui/meter"

<Meter value={64} />`,
    props: [{ component: "Meter", rows: [["value", "number"], ["min", "number", "0"], ["max", "number", "100"], ["indicatorClassName", "string"]] }],
  },
};
