import ReviewsCarousel from "@/components/elements/reviews-carousel";
import { getTestimonials } from "@/lib/demo-data";

export default function ReviewsCarouselDemo() {
  const reviews = getTestimonials().map((t) => ({ id: t.id, author: t.name, title: t.role, body: t.quote }));
  return <ReviewsCarousel className="w-full max-w-md" reviews={reviews} />;
}
