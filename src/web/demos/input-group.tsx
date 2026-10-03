import { ArrowUpIcon, AtSignIcon, SearchIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText, InputGroupTextarea } from "@/components/ui/input-group";
import { Kbd } from "@/components/ui/kbd";

export default function InputGroupDemo() {
  return (
    <div className="grid w-full max-w-sm gap-4">
      <InputGroup>
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
        <InputGroupInput placeholder="Search…" />
        <InputGroupAddon align="inline-end">
          <Kbd>⌘K</Kbd>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupAddon>
          <InputGroupText>https://</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput placeholder="designx.dev" className="pl-0.5" />
        <InputGroupAddon align="inline-end">
          <InputGroupText>.com</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupAddon>
          <AtSignIcon />
        </InputGroupAddon>
        <InputGroupInput placeholder="username" />
      </InputGroup>
      <InputGroup>
        <InputGroupTextarea placeholder="Ask anything…" rows={3} />
        <InputGroupAddon align="block-end" className="justify-between">
          <InputGroupText>DX Pro</InputGroupText>
          <Button size="icon-sm" aria-label="Send" className="ml-auto">
            <ArrowUpIcon />
          </Button>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}
