import Link from "next/link";
import { products } from "../../dummy-data/products";
import ProductCard from "../../components/ProductCard";

export default function Products() {
    return (
        <div>
            <h1>Products</h1>

            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}

            <Link href="/products/2">Product 2</Link>
        </div>
    );
}