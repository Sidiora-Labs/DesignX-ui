import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue } from "@/components/ui/select";

const items = [
  { label: "Select a timezone", value: null },
  { label: "Pacific (PT)", value: "pt" },
  { label: "Eastern (ET)", value: "et" },
  { label: "London (GMT)", value: "gmt" },
  { label: "Berlin (CET)", value: "cet" },
  { label: "Tokyo (JST)", value: "jst" },
];

export default function SelectDemo() {
  return (
    <Select items={items}>
      <SelectTrigger className="w-60">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Americas</SelectLabel>
          <SelectItem value="pt">Pacific (PT)</SelectItem>
          <SelectItem value="et">Eastern (ET)</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Europe</SelectLabel>
          <SelectItem value="gmt">London (GMT)</SelectItem>
          <SelectItem value="cet">Berlin (CET)</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Asia</SelectLabel>
          <SelectItem value="jst">Tokyo (JST)</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
