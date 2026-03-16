import Link from "next/link";
import { Product } from "@/types/product";

type ProductCardProps = {
  product: Product;

};

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="card">
      <h2>{product.name}</h2>
      <p className="card__category">Category: {product.category}</p>
      <p>{product.description}</p>
      <p className="card__price">${product.price}</p>

      <Link href={`/products/${product.id}`} className="button-link">
        View details
      </Link>
    </article>
  );
}