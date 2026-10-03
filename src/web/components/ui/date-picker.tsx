import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import type { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type DatePickerProps = {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
};

function DatePicker({ value, onChange, placeholder = "Pick a date", className }: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [internal, setInternal] = React.useState<Date | undefined>(value);
  const date = value ?? internal;
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button variant="outline" className={cn("w-60 justify-start rounded-md px-3.5 font-normal", !date && "text-muted-foreground", className)} />
        }
      >
        <CalendarIcon className="text-muted-foreground" />
        {date ? format(date, "PPP") : placeholder}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(d) => {
            setInternal(d);
            onChange?.(d);
            setOpen(false);
          }}
          captionLayout="dropdown"
        />
      </PopoverContent>
    </Popover>
  );
}

type DateRangePickerProps = {
  value?: DateRange;
  onChange?: (range: DateRange | undefined) => void;
  className?: string;
};

function DateRangePicker({ value, onChange, className }: DateRangePickerProps) {
  const [internal, setInternal] = React.useState<DateRange | undefined>(value);
  const range = value ?? internal;
  return (
    <Popover>
      <PopoverTrigger
        render={<Button variant="outline" className={cn("w-72 justify-start rounded-md px-3.5 font-normal", !range?.from && "text-muted-foreground", className)} />}
      >
        <CalendarIcon className="text-muted-foreground" />
        {range?.from ? (
          range.to ? (
            <>
              {format(range.from, "LLL d, y")} – {format(range.to, "LLL d, y")}
            </>
          ) : (
            format(range.from, "LLL d, y")
          )
        ) : (
          "Pick a date range"
        )}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          numberOfMonths={2}
          selected={range}
          defaultMonth={range?.from}
          onSelect={(r) => {
            setInternal(r);
            onChange?.(r);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}

export { DatePicker, DateRangePicker };
