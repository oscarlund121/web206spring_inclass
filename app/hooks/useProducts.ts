"use client";

import { useCallback, useEffect, useState } from "react";
import { Product } from "../../types/product";

export function useProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // READ — fetch all products
    const fetchProducts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/products");
            if (!res.ok) throw new Error("Failed to fetch products");
            setProducts(await res.json());
        } catch (e) {
            setError((e as Error).message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    // CREATE
    const createProduct = useCallback(async (data: Omit<Product, "id">) => {
        const res = await fetch("/api/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Failed to create product");
        const created: Product = await res.json();
        setProducts((prev) => [...prev, created]);
        return created;
    }, []);

    // UPDATE
    const updateProduct = useCallback(async (id: number, data: Partial<Omit<Product, "id">>) => {
        const res = await fetch(`/api/products/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Failed to update product");
        const updated: Product = await res.json();
        setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
        return updated;
    }, []);

    // DELETE
    const deleteProduct = useCallback(async (id: number) => {
        const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Failed to delete product");
        setProducts((prev) => prev.filter((p) => p.id !== id));
    }, []);

    return { products, loading, error, createProduct, updateProduct, deleteProduct };
}
