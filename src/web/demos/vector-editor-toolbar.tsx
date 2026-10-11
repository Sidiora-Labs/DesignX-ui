import { Circle, Hand, MousePointer2, PenTool, Square, Type } from "lucide-react";

import VectorEditorToolbar from "@/components/elements/vector-editor-toolbar";

export default function VectorEditorToolbarDemo() {
  return (
    <VectorEditorToolbar
      tools={[
        { id: "select", label: "Select", icon: MousePointer2, shortcut: "V" },
        { id: "hand", label: "Hand", icon: Hand, shortcut: "H" },
        {
          id: "shape",
          label: "Rectangle",
          icon: Square,
          shortcut: "R",
          items: [
            { id: "rect", label: "Rectangle", icon: Square, shortcut: "R" },
            { id: "ellipse", label: "Ellipse", icon: Circle, shortcut: "O" },
          ],
        },
        { id: "pen", label: "Pen", icon: PenTool, shortcut: "P" },
        { id: "text", label: "Text", icon: Type, shortcut: "T" },
      ]}
    />
  );
}
