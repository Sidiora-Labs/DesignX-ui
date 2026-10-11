import SpringAccordion from "@/components/elements/spring-accordion";

export default function SpringAccordionDemo() {
  return (
    <SpringAccordion
      className="w-full max-w-md"
      defaultExpandedIds={[1]}
      items={[
        { id: 1, title: "Is DX UI free?", content: "Yes. Every component is open source under the MIT license." },
        { id: 2, title: "Can I use it with my design system?", content: "Map your tokens to the DX CSS variables and everything follows." },
        { id: 3, title: "Does it support reduced motion?", content: "Every animation checks the user's reduced-motion preference." },
      ]}
    />
  );
}
