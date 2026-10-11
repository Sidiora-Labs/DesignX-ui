import Book from "@/components/elements/book";

export default function BookDemo() {
  return (
    <div className="flex flex-wrap items-end justify-center gap-8">
      <Book title="The DX Design Handbook" variant="stripe" />
      <Book color="#1f2937" textColor="#f9fafb" title="Motion Principles" variant="simple" />
    </div>
  );
}
