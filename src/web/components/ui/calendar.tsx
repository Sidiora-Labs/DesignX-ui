import * as React from "react";
import { DayPicker, getDefaultClassNames, type DayButton } from "react-day-picker";
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  components,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  const d = getDefaultClassNames();
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      captionLayout={captionLayout}
      className={cn("group/calendar w-fit p-3 [--cell-size:2.5rem]", className)}
      classNames={{
        root: cn("w-fit", d.root),
        months: cn("relative flex flex-col gap-4 md:flex-row", d.months),
        month: cn("flex w-full flex-col gap-3", d.month),
        nav: cn("absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1", d.nav),
        button_previous: cn(buttonVariants({ variant: "ghost", size: "icon-sm" }), "size-(--cell-size) aria-disabled:opacity-40", d.button_previous),
        button_next: cn(buttonVariants({ variant: "ghost", size: "icon-sm" }), "size-(--cell-size) aria-disabled:opacity-40", d.button_next),
        month_caption: cn("flex h-(--cell-size) w-full items-center justify-center px-(--cell-size)", d.month_caption),
        dropdowns: cn("flex h-(--cell-size) items-center justify-center gap-1.5 text-sm font-medium", d.dropdowns),
        dropdown_root: cn("relative rounded-sm border border-input has-focus:border-foreground", d.dropdown_root),
        dropdown: cn("absolute inset-0 opacity-0", d.dropdown),
        caption_label: cn(
          "text-sm font-medium select-none",
          captionLayout !== "label" && "flex h-8 items-center gap-1 rounded-sm pr-1 pl-2 [&>svg]:size-3.5 [&>svg]:text-muted-foreground",
          d.caption_label,
        ),
        table: "w-full border-collapse",
        weekdays: cn("flex", d.weekdays),
        weekday: cn("flex-1 text-[11px] font-medium text-muted-foreground uppercase select-none", d.weekday),
        week: cn("mt-1 flex w-full", d.week),
        day: cn(
          "group/day relative aspect-square h-full w-full p-0 text-center select-none [&:first-child[data-selected=true]_button]:rounded-l-full [&:last-child[data-selected=true]_button]:rounded-r-full",
          d.day,
        ),
        range_start: cn("rounded-l-full bg-container-high", d.range_start),
        range_middle: cn("rounded-none", d.range_middle),
        range_end: cn("rounded-r-full bg-container-high", d.range_end),
        today: cn("[&_button]:font-semibold [&_button]:text-foreground [&_button]:underline [&_button]:decoration-2 [&_button]:underline-offset-4", d.today),
        outside: cn("text-muted-foreground/50 aria-selected:text-muted-foreground", d.outside),
        disabled: cn("text-muted-foreground opacity-40", d.disabled),
        hidden: cn("invisible", d.hidden),
        ...classNames,
      }}
      components={{
        Chevron: ({ className, orientation, ...p }) => {
          if (orientation === "left") return <ChevronLeftIcon className={cn("size-4", className)} {...p} />;
          if (orientation === "right") return <ChevronRightIcon className={cn("size-4", className)} {...p} />;
          return <ChevronDownIcon className={cn("size-4", className)} {...p} />;
        },
        DayButton: CalendarDayButton,
        ...components,
      }}
      {...props}
    />
  );
}

function CalendarDayButton({ className, day, modifiers, ...props }: React.ComponentProps<typeof DayButton>) {
  const ref = React.useRef<HTMLButtonElement>(null);
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);
  return (
    <button
      ref={ref}
      type="button"
      data-day={day.date.toLocaleDateString()}
      data-selected-single={modifiers.selected && !modifiers.range_start && !modifiers.range_end && !modifiers.range_middle}
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        "state-layer focus-ring flex aspect-square size-auto w-full min-w-(--cell-size) items-center justify-center rounded-full text-sm tabular-nums",
        "data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground",
        "data-[range-middle=true]:rounded-none data-[range-middle=true]:bg-container-high",
        "data-[range-start=true]:bg-primary data-[range-start=true]:text-primary-foreground data-[range-end=true]:bg-primary data-[range-end=true]:text-primary-foreground",
        className,
      )}
      {...props}
    />
  );
}

export { Calendar, CalendarDayButton };
