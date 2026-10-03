import * as React from "react";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export default function ButtonLoading() {
  const [loading, setLoading] = React.useState(false);
  return (
    <Button
      disabled={loading}
      onClick={() => {
        setLoading(true);
        setTimeout(() => setLoading(false), 1800);
      }}
    >
      {loading && <Spinner />}
      {loading ? "Saving…" : "Save changes"}
    </Button>
  );
}
