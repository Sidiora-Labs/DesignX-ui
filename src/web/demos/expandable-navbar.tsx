import ExpandableNavbar from "@/components/elements/expandable-navbar";

const panel = (items: string[]) => (
  <div className="grid grid-cols-2 gap-2 p-2">
    {items.map((i) => (
      <a className="rounded-xl p-3 text-sm hover:bg-muted" href={`#${i.toLowerCase()}`} key={i}>
        {i}
      </a>
    ))}
  </div>
);

export default function ExpandableNavbarDemo() {
  return (
    <ExpandableNavbar
      items={[
        { id: "product", label: "Product", panel: panel(["Components", "Blocks", "Themes", "CLI"]) },
        { id: "docs", label: "Docs", panel: panel(["Installation", "Theming", "Registry", "Changelog"]) },
        { id: "company", label: "Company", panel: panel(["About", "Careers", "Blog", "Contact"]) },
      ]}
      openOnHover
    />
  );
}
