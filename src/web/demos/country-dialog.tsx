import { useState } from "react";

import CountryDialog from "@/components/elements/country-dialog";

const countries = [
  { code: "US", name: "United States", flag: "🇺🇸", dialCode: "+1" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧", dialCode: "+44" },
  { code: "DE", name: "Germany", flag: "🇩🇪", dialCode: "+49" },
  { code: "FR", name: "France", flag: "🇫🇷", dialCode: "+33" },
  { code: "PT", name: "Portugal", flag: "🇵🇹", dialCode: "+351" },
  { code: "JP", name: "Japan", flag: "🇯🇵", dialCode: "+81" },
  { code: "KR", name: "South Korea", flag: "🇰🇷", dialCode: "+82" },
  { code: "IN", name: "India", flag: "🇮🇳", dialCode: "+91" },
  { code: "BR", name: "Brazil", flag: "🇧🇷", dialCode: "+55" },
  { code: "NG", name: "Nigeria", flag: "🇳🇬", dialCode: "+234" },
];

export default function CountryDialogDemo() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("PT");
  return <CountryDialog countries={countries} onOpenChange={setOpen} onValueChange={setValue} open={open} value={value} />;
}
