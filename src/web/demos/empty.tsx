import { FolderPlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";

export default function EmptyDemo() {
  return (
    <Empty className="w-full max-w-md border border-dashed border-border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FolderPlusIcon />
        </EmptyMedia>
        <EmptyTitle>No projects yet</EmptyTitle>
        <EmptyDescription>Create your first project to start shipping. It only takes a minute.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="flex-row justify-center">
        <Button>Create project</Button>
        <Button variant="tonal">Import</Button>
      </EmptyContent>
    </Empty>
  );
}
