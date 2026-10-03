import * as React from "react";
import type { DateRange } from "react-day-picker";

import { DatePicker, DateRangePicker } from "@/components/ui/date-picker";
import { Label } from "@/components/ui/label";

export default function DatePickerDemo() {
  const [date, setDate] = React.useState<Date | undefined>();
  const [range, setRange] = React.useState<DateRange | undefined>();
  return (
    <div className="flex flex-wrap items-end justify-center gap-6">
      <div className="grid gap-2">
        <Label>Due date</Label>
        <DatePicker value={date} onChange={setDate} />
      </div>
      <div className="grid gap-2">
        <Label>Trip</Label>
        <DateRangePicker value={range} onChange={setRange} />
      </div>
    </div>
  );
}
