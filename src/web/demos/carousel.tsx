import { Carousel, CarouselContent, CarouselDots, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

const photos = [
  "photo-1506905925346-21bda4d32df4",
  "photo-1469474968028-56623f02e42e",
  "photo-1501785888041-af3ef285b470",
  "photo-1447752875215-b2761acb3c5d",
  "photo-1433086966358-54859d0ed716",
];

export default function CarouselDemo() {
  return (
    <Carousel className="w-full max-w-md" opts={{ loop: true }}>
      <CarouselContent>
        {photos.map((id, i) => (
          <CarouselItem key={id}>
            <div className="aspect-[4/3] overflow-hidden rounded-xl bg-container-high">
              <img src={`https://images.unsplash.com/${id}?w=900&q=80&auto=format&fit=crop`} alt={`Landscape ${i + 1}`} className="size-full object-cover" />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-3" />
      <CarouselNext className="right-3" />
      <CarouselDots className="mt-4" />
    </Carousel>
  );
}
