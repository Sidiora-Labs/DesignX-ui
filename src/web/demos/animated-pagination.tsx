import { useState } from "react";

import Pagination from "@/components/elements/animated-pagination";

export default function AnimatedPaginationDemo() {
  const [page, setPage] = useState(3);
  return <Pagination onPageChange={setPage} page={page} totalPages={12} />;
}
