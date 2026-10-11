import FaviconSearch from "@/components/elements/favicon-search";

export default function FaviconSearchDemo() {
  return (
    <FaviconSearch
      className="w-full max-w-md"
      results={[
        { id: "1", title: "DX UI Docs", url: "https://ui.designx.dev/docs", description: "Components, blocks and guides" },
        { id: "2", title: "DX UI Registry", url: "https://ui.designx.dev/r", description: "shadcn-compatible registry" },
        { id: "3", title: "DX UI on GitHub", url: "https://github.com/designx/ui", description: "Source code and issues" },
        { id: "4", title: "DesignX", url: "https://designx.dev", description: "The company behind DX UI" },
      ]}
    />
  );
}
