import InlineTestimonials from "@/components/elements/inline-testimonials";
import { getTestimonials } from "@/lib/demo-data";

export default function InlineTestimonialsDemo() {
  const testimonials = getTestimonials()
    .slice(0, 3)
    .map((t) => ({ id: t.id, name: t.name, role: t.role, avatar: t.avatar, quote: t.quote, rating: t.rating }));
  return (
    <InlineTestimonials
      className="max-w-xl text-2xl font-medium leading-snug"
      testimonials={testimonials}
      text="Teams love DX UI — {{t1}} shipped faster, {{t2}} dropped three libraries and {{t3}} finally matched design."
    />
  );
}
