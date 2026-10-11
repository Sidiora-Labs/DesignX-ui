import CursorFollow from "@/components/elements/cursor-follow";
import { photo } from "@/lib/demo-data";

export default function CursorFollowDemo() {
  return (
    <CursorFollow>
      <div className="grid grid-cols-3 gap-3">
        {["Coast", "Peaks", "Forest"].map((label, i) => (
          <div className="overflow-hidden rounded-2xl" data-cursor-text={`View ${label}`} key={label}>
            <img alt={label} className="aspect-[3/4] w-40 object-cover" src={photo(i * 3 + 1)} />
          </div>
        ))}
      </div>
    </CursorFollow>
  );
}
