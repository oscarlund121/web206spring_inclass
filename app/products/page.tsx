import Link from "next/link";
import { products } from "../../dummy-data/products";

export default function Products() {
    return (
        <div>
            <h1>Products</h1>
            <Link href="/products/2">Product 2</Link>
        </div>
    );
}