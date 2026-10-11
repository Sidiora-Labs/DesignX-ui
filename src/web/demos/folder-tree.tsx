import FolderTree from "@/components/elements/folder-tree";

export default function FolderTreeDemo() {
  return (
    <FolderTree
      className="w-full max-w-xs"
      defaultExpanded={["src", "components"]}
      items={[
        {
          id: "src",
          name: "src",
          type: "folder",
          children: [
            {
              id: "components",
              name: "components",
              type: "folder",
              children: [
                { id: "button", name: "press-button.tsx", type: "file" },
                { id: "orb", name: "voice-orb.tsx", type: "file" },
              ],
            },
            { id: "lib", name: "lib", type: "folder", children: [{ id: "utils", name: "utils.ts", type: "file" }] },
            { id: "app", name: "app.tsx", type: "file" },
          ],
        },
        { id: "pkg", name: "package.json", type: "file" },
      ]}
      showLines
    />
  );
}
