import { useState } from "react";

import SpringToast from "@/components/elements/spring-toast";
import { Button } from "@/components/ui/button";

export default function SpringToastDemo() {
  const [visible, setVisible] = useState(false);
  return (
    <div className="flex flex-col items-center gap-4">
      <Button onClick={() => setVisible(true)} variant="outline">
        Show toast
      </Button>
      <SpringToast isVisible={visible} message="Changes saved" onClose={() => setVisible(false)} type="success" />
    </div>
  );
}
