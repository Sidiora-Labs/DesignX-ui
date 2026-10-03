import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  { q: "Is DX UI a dependency?", a: "No. Components are copied into your project, so you own the code and can change anything." },
  { q: "What is it built on?", a: "Base UI primitives for accessibility, Tailwind CSS 4 for styling and Motion for animation." },
  { q: "Does it support dark mode?", a: "Yes. Every token has a dark value and the DX Gradient accent works in both themes." },
];

export default function AccordionDemo() {
  return (
    <Accordion defaultValue={["item-0"]} className="w-full max-w-md">
      {faqs.map((f, i) => (
        <AccordionItem key={f.q} value={`item-${i}`}>
          <AccordionTrigger>{f.q}</AccordionTrigger>
          <AccordionContent>{f.a}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
