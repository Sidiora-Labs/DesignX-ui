import { Button } from "@/components/ui/button";

const variants = ["default", "tonal", "outline", "ghost", "destructive", "link"] as const;

export default function ButtonVariants() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {variants.map((v) => (
        <Button key={v} variant={v} className="capitalize">
          {v}
        </Button>
      ))}
    </div>
  );
}
