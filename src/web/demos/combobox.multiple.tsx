import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
} from "@/components/ui/combobox";

const labels = ["Bug", "Feature", "Design", "Docs", "Performance", "Accessibility", "Motion"];

export default function ComboboxMultiple() {
  return (
    <Combobox items={labels} multiple defaultValue={["Design", "Motion"]}>
      <ComboboxChips>
        <ComboboxValue>
          {(value: string[]) => (
            <>
              {value.map((v) => (
                <ComboboxChip key={v}>{v}</ComboboxChip>
              ))}
              <ComboboxChipsInput placeholder={value.length ? "" : "Add labels…"} />
            </>
          )}
        </ComboboxValue>
      </ComboboxChips>
      <ComboboxContent>
        <ComboboxEmpty>No labels found.</ComboboxEmpty>
        <ComboboxList>
          {(item: string) => (
            <ComboboxItem key={item} value={item}>
              {item}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
