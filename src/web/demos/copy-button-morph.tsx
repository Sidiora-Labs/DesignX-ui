import CopyButtonMorph from "@/components/elements/copy-button-morph";

export default function CopyButtonMorphDemo() {
  return <CopyButtonMorph onCopy={() => navigator.clipboard?.writeText("npx dx-ui add copy-button-morph")} />;
}
