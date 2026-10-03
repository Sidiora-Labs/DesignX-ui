import type { ApiDoc } from "./api";

/** Component API docs, N–Z. */
export const uiApi2: Record<string, ApiDoc> = {
  "navigation-menu": {
    usage: `import {
  NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"

<NavigationMenu>
  <NavigationMenuList>
    <NavigationMenuItem>
      <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
      <NavigationMenuContent>
        <NavigationMenuLink href="/docs">Introduction</NavigationMenuLink>
      </NavigationMenuContent>
    </NavigationMenuItem>
  </NavigationMenuList>
</NavigationMenu>`,
    previewHeight: 380,
  },
  "number-field": {
    usage: `import { NumberField, NumberFieldInput, NumberFieldStepper } from "@/components/ui/number-field"

<NumberField defaultValue={4} min={0} max={10}>
  <NumberFieldStepper>
    <NumberFieldInput />
  </NumberFieldStepper>
</NumberField>`,
    props: [
      {
        component: "NumberField",
        rows: [
          ["value", "number | null"],
          ["defaultValue", "number"],
          ["onValueChange", "(value: number | null) => void"],
          ["min", "number"],
          ["max", "number"],
          ["step", "number", "1"],
          ["format", "Intl.NumberFormatOptions"],
        ],
      },
      { component: "NumberFieldScrubArea", description: "Drag horizontally on a label to change the value.", rows: [["direction", '"horizontal" | "vertical"', '"horizontal"']] },
    ],
  },
  pagination: {
    usage: `import {
  Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious,
} from "@/components/ui/pagination"

<Pagination>
  <PaginationContent>
    <PaginationItem><PaginationPrevious href="#" /></PaginationItem>
    <PaginationItem><PaginationLink href="#" isActive>1</PaginationLink></PaginationItem>
    <PaginationItem><PaginationNext href="#" /></PaginationItem>
  </PaginationContent>
</Pagination>`,
    props: [{ component: "PaginationLink", rows: [["isActive", "boolean", "false"], ["size", "ButtonSize", '"icon"']] }],
  },
  popover: {
    usage: `import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

<Popover>
  <PopoverTrigger render={<Button variant="outline" />}>Open</PopoverTrigger>
  <PopoverContent>Place content here.</PopoverContent>
</Popover>`,
    props: [{ component: "PopoverContent", rows: [["side", '"top" | "right" | "bottom" | "left"', '"bottom"'], ["align", '"start" | "center" | "end"', '"center"'], ["sideOffset", "number"]] }],
  },
  progress: {
    usage: `import { Progress } from "@/components/ui/progress"

<Progress value={33} />
<Progress value={null} /> {/* indeterminate */}`,
    props: [{ component: "Progress", rows: [["value", "number | null", undefined, "null renders the indeterminate state."], ["max", "number", "100"]] }],
  },
  "radio-group": {
    usage: `import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

<RadioGroup defaultValue="comfortable">
  <RadioGroupItem value="default" id="r1" />
  <RadioGroupItem value="comfortable" id="r2" />
</RadioGroup>`,
    props: [{ component: "RadioGroup", rows: [["value", "any"], ["defaultValue", "any"], ["onValueChange", "(value) => void"], ["disabled", "boolean", "false"]] }],
  },
  resizable: {
    usage: `import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"

<ResizablePanelGroup direction="horizontal">
  <ResizablePanel defaultSize={50}>One</ResizablePanel>
  <ResizableHandle withHandle />
  <ResizablePanel defaultSize={50}>Two</ResizablePanel>
</ResizablePanelGroup>`,
    props: [
      { component: "ResizablePanelGroup", rows: [["direction", '"horizontal" | "vertical"'], ["autoSaveId", "string", undefined, "Persist layout to localStorage."]] },
      { component: "ResizablePanel", rows: [["defaultSize", "number"], ["minSize", "number"], ["maxSize", "number"], ["collapsible", "boolean", "false"]] },
      { component: "ResizableHandle", rows: [["withHandle", "boolean", "false", "Show a visible grip."]] },
    ],
  },
  "scroll-area": {
    usage: `import { ScrollArea } from "@/components/ui/scroll-area"

<ScrollArea className="h-72 w-48 rounded-lg border">…</ScrollArea>
<ScrollArea fade className="h-72">…</ScrollArea>`,
    exampleTitles: { fade: "Edge fade" },
    props: [
      {
        component: "ScrollArea",
        description: "Accepts every Base UI ScrollArea.Root prop.",
        rows: [["fade", "boolean | number", "false", "Mask the top/bottom edges while content overflows. A number sets the fade size in px (default 40)."]],
      },
    ],
  },
  select: {
    usage: `import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const items = [{ label: "Light", value: "light" }, { label: "Dark", value: "dark" }]

<Select items={items}>
  <SelectTrigger className="w-44"><SelectValue placeholder="Theme" /></SelectTrigger>
  <SelectContent>
    {items.map((i) => <SelectItem key={i.value} value={i.value}>{i.label}</SelectItem>)}
  </SelectContent>
</Select>`,
    props: [
      { component: "Select", rows: [["items", "{ label: ReactNode; value: any }[]", undefined, "Lets SelectValue render the label."], ["value", "any"], ["onValueChange", "(value) => void"], ["multiple", "boolean", "false"]] },
      { component: "SelectTrigger", rows: [["size", '"sm" | "default"', '"default"']] },
    ],
  },
  separator: {
    usage: `import { Separator } from "@/components/ui/separator"

<Separator orientation="vertical" />`,
    props: [{ component: "Separator", rows: [["orientation", '"horizontal" | "vertical"', '"horizontal"']] }],
  },
  sheet: {
    usage: `import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

<Sheet>
  <SheetTrigger render={<Button variant="outline" />}>Open</SheetTrigger>
  <SheetContent side="right">
    <SheetHeader>
      <SheetTitle>Edit profile</SheetTitle>
      <SheetDescription>Make changes to your profile.</SheetDescription>
    </SheetHeader>
  </SheetContent>
</Sheet>`,
    props: [{ component: "SheetContent", rows: [["side", '"top" | "right" | "bottom" | "left"', '"right"'], ["showCloseButton", "boolean", "true"]] }],
  },
  sidebar: {
    usage: `import { Sidebar, SidebarContent, SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

export default function Layout({ children }) {
  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarContent>…</SidebarContent>
      </Sidebar>
      <SidebarInset>
        <SidebarTrigger />
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}`,
    notes: "Toggle with ⌘B / Ctrl+B. On mobile the sidebar renders inside a Sheet. useSidebar() exposes state, open, setOpen, isMobile and toggleSidebar.",
    align: "start",
    props: [
      { component: "SidebarProvider", rows: [["defaultOpen", "boolean", "true"], ["open", "boolean"], ["onOpenChange", "(open: boolean) => void"]] },
      {
        component: "Sidebar",
        rows: [
          ["side", '"left" | "right"', '"left"'],
          ["variant", '"sidebar" | "floating" | "inset"', '"sidebar"'],
          ["collapsible", '"offcanvas" | "icon" | "none"', '"offcanvas"'],
        ],
      },
      { component: "SidebarMenuButton", rows: [["isActive", "boolean", "false"], ["tooltip", "string", undefined, "Shown when collapsed to icons."], ["size", '"sm" | "default" | "lg"', '"default"'], ["render", "ReactElement"]] },
    ],
  },
  skeleton: {
    usage: `import { Skeleton } from "@/components/ui/skeleton"

<Skeleton className="h-4 w-48" />`,
  },
  slider: {
    usage: `import { Slider } from "@/components/ui/slider"

<Slider defaultValue={50} max={100} step={1} />
<Slider defaultValue={[20, 80]} /> {/* range */}`,
    props: [
      {
        component: "Slider",
        rows: [
          ["value", "number | number[]"],
          ["defaultValue", "number | number[]"],
          ["onValueChange", "(value: number | number[]) => void"],
          ["min", "number", "0"],
          ["max", "number", "100"],
          ["step", "number", "1"],
          ["orientation", '"horizontal" | "vertical"', '"horizontal"'],
        ],
      },
    ],
  },
  sonner: {
    usage: `// app root
import { Toaster } from "@/components/ui/sonner"
<Toaster position="bottom-right" />

// anywhere
import { toast } from "@/components/ui/sonner"
toast.success("Saved", { description: "Your changes are live." })`,
    props: [
      { component: "Toaster", rows: [["position", '"top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right"', '"bottom-right"'], ["richColors", "boolean", "false"], ["expand", "boolean", "false"]] },
      { component: "toast()", rows: [["description", "ReactNode"], ["action", "{ label: string; onClick: () => void }"], ["duration", "number", "4000"]] },
    ],
  },
  spinner: {
    usage: `import { Spinner } from "@/components/ui/spinner"

<Spinner className="size-6" />`,
    notes: "Renders an <output> with an accessible label. Size with size-* and color with text-*.",
  },
  switch: {
    usage: `import { Switch } from "@/components/ui/switch"

<Switch id="airplane" />
<Label htmlFor="airplane">Airplane mode</Label>`,
    props: [{ component: "Switch", rows: [["checked", "boolean"], ["defaultChecked", "boolean", "false"], ["onCheckedChange", "(checked: boolean) => void"], ["size", '"sm" | "default"', '"default"'], ["disabled", "boolean", "false"]] }],
  },
  table: {
    usage: `import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

<Table>
  <TableHeader><TableRow><TableHead>Invoice</TableHead></TableRow></TableHeader>
  <TableBody><TableRow><TableCell>INV-001</TableCell></TableRow></TableBody>
</Table>`,
  },
  tabs: {
    usage: `import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

<Tabs defaultValue="account">
  <TabsList>
    <TabsTrigger value="account">Account</TabsTrigger>
    <TabsTrigger value="password">Password</TabsTrigger>
  </TabsList>
  <TabsContent value="account">…</TabsContent>
  <TabsContent value="password">…</TabsContent>
</Tabs>`,
    exampleTitles: { line: "Line variant" },
    props: [
      { component: "Tabs", rows: [["value", "any"], ["defaultValue", "any"], ["onValueChange", "(value) => void"], ["orientation", '"horizontal" | "vertical"', '"horizontal"']] },
      { component: "TabsList", rows: [["variant", '"default" | "line"', '"default"']] },
    ],
  },
  textarea: {
    usage: `import { Textarea } from "@/components/ui/textarea"

<Textarea placeholder="Type your message here." />`,
    notes: "Grows with its content via field-sizing: content.",
  },
  toggle: {
    usage: `import { Toggle } from "@/components/ui/toggle"

<Toggle aria-label="Toggle bold"><BoldIcon /></Toggle>`,
    props: [
      {
        component: "Toggle",
        rows: [
          ["variant", '"default" | "outline"', '"default"'],
          ["size", '"sm" | "default" | "lg"', '"default"'],
          ["pressed", "boolean"],
          ["defaultPressed", "boolean", "false"],
          ["onPressedChange", "(pressed: boolean) => void"],
        ],
      },
    ],
  },
  "toggle-group": {
    usage: `import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

<ToggleGroup defaultValue={["left"]}>
  <ToggleGroupItem value="left">Left</ToggleGroupItem>
  <ToggleGroupItem value="right">Right</ToggleGroupItem>
</ToggleGroup>`,
    props: [
      {
        component: "ToggleGroup",
        rows: [
          ["value", "any[]"],
          ["defaultValue", "any[]"],
          ["onValueChange", "(value: any[]) => void"],
          ["multiple", "boolean", "false"],
          ["variant", '"default" | "outline"', '"default"'],
          ["size", '"sm" | "default" | "lg"', '"default"'],
        ],
      },
    ],
  },
  toolbar: {
    usage: `import { Toolbar, ToolbarButton, ToolbarSeparator } from "@/components/ui/toolbar"

<Toolbar>
  <ToolbarButton aria-label="Bold"><BoldIcon /></ToolbarButton>
  <ToolbarSeparator />
  <ToolbarButton aria-label="Italic"><ItalicIcon /></ToolbarButton>
</Toolbar>`,
    props: [{ component: "Toolbar", rows: [["orientation", '"horizontal" | "vertical"', '"horizontal"'], ["loop", "boolean", "true", "Wrap roving focus at the ends."]] }],
  },
  tooltip: {
    usage: `import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

<Tooltip>
  <TooltipTrigger render={<Button variant="outline" />}>Hover</TooltipTrigger>
  <TooltipContent>Add to library</TooltipContent>
</Tooltip>`,
    notes: "Wrap your app in <TooltipProvider> to share open delays between tooltips.",
    exampleTitles: { arrow: "Outline with arrow" },
    props: [
      {
        component: "TooltipContent",
        rows: [
          ["side", '"top" | "right" | "bottom" | "left"', '"top"'],
          ["align", '"start" | "center" | "end"', '"center"'],
          ["sideOffset", "number", "6 (10 with arrow)"],
          ["variant", '"inverted" | "outline"', '"inverted"'],
          ["arrow", "boolean", "false", "Bordered pointer arrow that follows the side."],
        ],
      },
      { component: "TooltipProvider", rows: [["delay", "number", "300"]] },
    ],
  },
  typography: {
    usage: `import { Typography } from "@/components/ui/typography"

<Typography variant="h1">Build with clarity</Typography>
<Typography variant="lead">A calm, tonal component system.</Typography>`,
    align: "start",
    exampleTitles: { scale: "Type scale" },
    props: [
      {
        component: "Typography",
        rows: [
          ["variant", '"display" | "h1" | "h2" | "h3" | "h4" | "lead" | "p" | "large" | "small" | "muted" | "eyebrow" | "code" | "blockquote"', '"p"'],
          ["as", "ElementType", undefined, "Override the semantic element."],
        ],
      },
    ],
  },
};
