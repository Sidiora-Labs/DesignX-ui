import * as React from "react";
import { Combobox as ComboboxPrimitive } from "@base-ui/react/combobox";
import { CheckIcon, ChevronsUpDownIcon, XIcon } from "lucide-react";

import { cn } from "@/lib/utils";

const Combobox = ComboboxPrimitive.Root;

function ComboboxInput({
  className,
  showTrigger = true,
  showClear = false,
  ...props
}: ComboboxPrimitive.Input.Props & { showTrigger?: boolean; showClear?: boolean }) {
  return (
    <ComboboxPrimitive.InputGroup
      data-slot="combobox-input-group"
      className={cn(
        "relative flex h-10 w-64 items-center rounded-md border border-input bg-transparent transition-[border-color,box-shadow] focus-within:border-foreground focus-within:ring-[3px] focus-within:ring-ring/15 hover:border-muted-foreground/60",
        className,
      )}
    >
      <ComboboxPrimitive.Input
        data-slot="combobox-input"
        className="h-full min-w-0 flex-1 bg-transparent px-3.5 text-sm outline-none placeholder:text-muted-foreground"
        {...props}
      />
      <div className="flex items-center pr-1.5 text-muted-foreground">
        {showClear && (
          <ComboboxPrimitive.Clear className="state-layer flex size-7 items-center justify-center rounded-full" aria-label="Clear">
            <XIcon className="size-3.5" />
          </ComboboxPrimitive.Clear>
        )}
        {showTrigger && (
          <ComboboxPrimitive.Trigger className="state-layer flex size-7 items-center justify-center rounded-full" aria-label="Open">
            <ChevronsUpDownIcon className="size-4" />
          </ComboboxPrimitive.Trigger>
        )}
      </div>
    </ComboboxPrimitive.InputGroup>
  );
}

function ComboboxContent({
  className,
  sideOffset = 6,
  align = "start",
  ...props
}: ComboboxPrimitive.Popup.Props & Pick<ComboboxPrimitive.Positioner.Props, "sideOffset" | "align">) {
  return (
    <ComboboxPrimitive.Portal>
      <ComboboxPrimitive.Positioner className="z-50 outline-none" sideOffset={sideOffset} align={align}>
        <ComboboxPrimitive.Popup
          data-slot="combobox-content"
          className={cn(
            "popup-motion max-h-[min(var(--available-height),22rem)] w-(--anchor-width) overflow-y-auto overscroll-contain rounded-lg border border-outline-variant bg-popover p-1.5 text-popover-foreground shadow-float outline-none",
            className,
          )}
          {...props}
        />
      </ComboboxPrimitive.Positioner>
    </ComboboxPrimitive.Portal>
  );
}

function ComboboxList({ className, ...props }: ComboboxPrimitive.List.Props) {
  return <ComboboxPrimitive.List data-slot="combobox-list" className={cn("outline-none data-empty:p-0", className)} {...props} />;
}

function ComboboxItem({ className, children, ...props }: ComboboxPrimitive.Item.Props) {
  return (
    <ComboboxPrimitive.Item
      data-slot="combobox-item"
      className={cn(
        "relative flex h-9 cursor-default items-center gap-2 rounded-sm pr-8 pl-2.5 text-sm outline-none select-none data-highlighted:bg-container-high data-disabled:pointer-events-none data-disabled:opacity-40",
        className,
      )}
      {...props}
    >
      {children}
      <ComboboxPrimitive.ItemIndicator className="absolute right-2.5 flex items-center">
        <CheckIcon className="size-4" />
      </ComboboxPrimitive.ItemIndicator>
    </ComboboxPrimitive.Item>
  );
}

function ComboboxEmpty({ className, ...props }: ComboboxPrimitive.Empty.Props) {
  return (
    <ComboboxPrimitive.Empty
      data-slot="combobox-empty"
      className={cn("px-2.5 py-6 text-center text-sm text-muted-foreground empty:m-0 empty:p-0", className)}
      {...props}
    />
  );
}

function ComboboxGroup(props: ComboboxPrimitive.Group.Props) {
  return <ComboboxPrimitive.Group data-slot="combobox-group" {...props} />;
}

function ComboboxGroupLabel({ className, ...props }: ComboboxPrimitive.GroupLabel.Props) {
  return <ComboboxPrimitive.GroupLabel className={cn("px-2.5 pt-2 pb-1 text-xs font-medium text-muted-foreground", className)} {...props} />;
}

function ComboboxChips({ className, ...props }: ComboboxPrimitive.Chips.Props) {
  return (
    <ComboboxPrimitive.Chips
      data-slot="combobox-chips"
      className={cn(
        "flex min-h-10 w-72 flex-wrap items-center gap-1 rounded-md border border-input px-1.5 py-1 focus-within:border-foreground focus-within:ring-[3px] focus-within:ring-ring/15",
        className,
      )}
      {...props}
    />
  );
}

function ComboboxChip({ className, children, ...props }: ComboboxPrimitive.Chip.Props) {
  return (
    <ComboboxPrimitive.Chip
      data-slot="combobox-chip"
      className={cn("flex h-7 items-center gap-1 rounded-full bg-secondary pr-1 pl-2.5 text-[13px] outline-none data-highlighted:bg-container-highest", className)}
      {...props}
    >
      {children}
      <ComboboxPrimitive.ChipRemove className="state-layer flex size-5 items-center justify-center rounded-full text-muted-foreground" aria-label="Remove">
        <XIcon className="size-3" />
      </ComboboxPrimitive.ChipRemove>
    </ComboboxPrimitive.Chip>
  );
}

function ComboboxChipsInput({ className, ...props }: ComboboxPrimitive.Input.Props) {
  return (
    <ComboboxPrimitive.Input
      data-slot="combobox-chips-input"
      className={cn("h-7 min-w-16 flex-1 bg-transparent px-1.5 text-sm outline-none placeholder:text-muted-foreground", className)}
      {...props}
    />
  );
}

const ComboboxValue = ComboboxPrimitive.Value;
const useComboboxAnchor = () => React.useRef<HTMLDivElement | null>(null);

export {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxGroupLabel,
  ComboboxChips,
  ComboboxChip,
  ComboboxChipsInput,
  ComboboxValue,
  useComboboxAnchor,
};
