import { AspectRatio } from "@/components/ui/aspect-ratio";

export default function AspectRatioDemo() {
  return (
    <div className="w-full max-w-md">
      <AspectRatio ratio={16 / 9} className="overflow-hidden rounded-xl bg-container-high">
        <img
          src="https://images.unsplash.com/photo-1500964757637-c85e8a162699?w=1200&q=80&auto=format&fit=crop"
          alt="Rolling hills at sunrise"
          className="size-full object-cover"
        />
      </AspectRatio>
    </div>
  );
}
