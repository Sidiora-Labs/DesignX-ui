import ProductCard from "@/components/elements/product-card";
import { photo } from "@/lib/demo-data";

export default function ProductCardDemo() {
  return (
    <ProductCard
      badge="New"
      className="w-72"
      image={photo(16)}
      originalPrice={12}
      price={8}
      rating={4.8}
      title="Garden Strawberries, 1 lb"
    />
  );
}
