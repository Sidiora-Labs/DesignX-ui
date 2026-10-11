import Breadcrumb from "@/components/elements/animated-breadcrumb";

export default function AnimatedBreadcrumbDemo() {
  return (
    <Breadcrumb
      items={[
        { label: "Home", href: "#" },
        { label: "Docs", href: "#" },
        { label: "Components", href: "#" },
        { label: "Animated Breadcrumb" },
      ]}
    />
  );
}
