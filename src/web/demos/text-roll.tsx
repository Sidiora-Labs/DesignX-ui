import { TextRoll } from "@/components/dx/text-roll";

const items = ["Home", "Components", "Pricing", "Docs", "Account"];

export default function TextRollDemo() {
  return (
    <ul className="grid justify-items-center gap-2">
      {items.map((item) => (
        <li key={item}>
          <a href={`#${item.toLowerCase()}`} className="block text-4xl font-semibold tracking-[-0.03em] uppercase md:text-5xl">
            <TextRoll center>{item}</TextRoll>
          </a>
        </li>
      ))}
    </ul>
  );
}
