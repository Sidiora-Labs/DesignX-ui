import { Camera, Mountain, Trees } from "lucide-react";

import Phototab from "@/components/elements/phototab";
import { photo } from "@/lib/demo-data";

export default function PhototabDemo() {
  return (
    <Phototab
      tabs={[
        { name: "Coast", icon: <Camera className="size-4" />, image: photo(1) },
        { name: "Peaks", icon: <Mountain className="size-4" />, image: photo(3) },
        { name: "Forest", icon: <Trees className="size-4" />, image: photo(5) },
      ]}
    />
  );
}
