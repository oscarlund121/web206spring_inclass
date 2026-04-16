"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { Product } from "../../types/product";

export function useProducts() {
    const queryClient = useQueryClient();
    const [error, setError] = useState("")
    const [liked, setLiked] = useState(false);

    // We want to store the products here in a state variable
    const baseUrl = ""; //'http://localhost:8080' // Your docker python backend in the future

    // ── WITHOUT TanStack Query ────────────────────────────────────────────────
    // Manual fetch pattern: we manage the products array, loading flag, and
    // effect ourselves.
    //
    // const [products, setProducts] = useState([] as Product[])
    // const [isLoading, setIsLoading] = useState(false);
    //
    // useCallback prevents a new function from being created on every render.
    // This is REQUIRED here because fetchProducts is used as a dependency in
    // the useEffect below. Without useCallback, every render would produce a
    // new function reference, which would trigger the effect again, causing
    // another fetch, another state update, another render — an infinite loop.
    // The empty array [] means the function is only created once (on mount).
    //
    // const fetchProducts = useCallback(async () => {
    //     setIsLoading(true);
    //     const response = await fetch(baseUrl + "/api/products", { method: "GET" });
    //     setProducts(await response.json());
    //     setIsLoading(false);
    // }, []);
    //
    // useEffect runs *after* the component mounts (appears on screen).
    // The dependency array [fetchProducts] tells React: "re-run this effect
    // whenever fetchProducts changes". Because fetchProducts is wrapped in
    // useCallback with [], it never changes — so this effect runs exactly once,
    // on mount. This is the standard pattern for fetching data when a page loads.
    //
    // useEffect(() => {
    //     fetchProducts();
    // }, [fetchProducts]);
    // ─────────────────────────────────────────────────────────────────────────

    // ── WITH TanStack Query ───────────────────────────────────────────────────
    // useQuery fetches and caches the product list automatically.
    // It replaces all of the manual code above.
    // TanStack Query handles: caching, deduplication, background refetching,
    // and loading/error states — no boilerplate needed.
    //
    // queryKey: ["products"] is the cache key. Any component that calls
    // useQuery with the same key shares the same cached result.
    const {
        data: products = [],
        isLoading,
        error: fetchError,
    } = useQuery<Product[]>({
        queryKey: ["products"],
        queryFn: () =>
            fetch(baseUrl + "/api/products").then((res) => res.json()),
    });
    // ─────────────────────────────────────────────────────────────────────────

    const voteUpLike = useCallback(async (like: boolean) => {
        setLiked(like => !like); // optimistic UI update because we dont know yet if the server-save works out.
        
        console.log("like is", like);
        const response = await fetch(baseUrl+"/api/products/like", {
            method: 'POST',
            // headers: {
            //     'Content-Type': 'application/json'
            // },
            body: JSON.stringify(!like) 
        })
        if (!response.ok) {
            setLiked(like => !like);
            alert("Something went wrong");
            return;
        }
        
    }, []);

    // CREATE
    //
    // useCallback here is optional (there is no useEffect depending on it),
    // but it is a good habit: if this function is passed as a prop to a child
    // component wrapped in React.memo (tells React to skip re-rendering a component 
    // if its props haven't changed.), a stable reference prevents that child
    // from re-rendering unnecessarily every time the parent renders.
    const createProduct = useCallback(async (data: Omit<Product, "id">) => {
        // MSW handles POST and returns the new product with an auto-generated id.
        // With a real backend this fetch call stays exactly the same —
        // just make sure the server also responds with the created product (201).
        const response = await fetch(baseUrl+"/api/products", {
            method: 'POST',
            // headers: {
            //     'Content-Type': 'application/json'
            // },
            body: JSON.stringify(data)
        })
        const product = await response.json()

        // ── WITHOUT TanStack Query ──────────────────────────────────────────
        // Manually append to the local products state:
        // setProducts(products => [...products, product])
        // ───────────────────────────────────────────────────────────────────

        // ── WITH TanStack Query ─────────────────────────────────────────────
        // Two ways to update the UI after a mutation:
        //
        // 1. setQueryData — updates the cache directly with the data we already
        //    have from the server response. No extra network request. Instant.
        //    Best when the server returns the new/updated item in its response.
        //
        // 2. invalidateQueries — marks the cache as stale and triggers a refetch
        //    of GET /api/products. Costs an extra network round-trip but guarantees
        //    the client is in sync with the server.
        //    Best when the server does NOT return the updated data, or when other
        //    side-effects on the server might have changed the list.
        //
        // Option 1 — setQueryData (active):
        queryClient.setQueryData<Product[]>(["products"], (old = []) => [...old, product])
        //
        // Option 2 — invalidateQueries (commented out):
        // queryClient.invalidateQueries({ queryKey: ["products"] })
        // ───────────────────────────────────────────────────────────────────

    }, []);

    // UPDATE — same reasoning as createProduct above
    const updateProduct = useCallback(async (id: number, data: Partial<Omit<Product, "id">>) => {
        // MSW handles PUT and merges the fields in the in-memory store.
        // Some REST APIs use PATCH instead of PUT for partial updates —
        // change method: "PUT" to method: "PATCH" if your backend requires it.
    }, []);

    // DELETE — same reasoning as createProduct above
    const deleteProduct = useCallback(async (id: number) => {
        setError("");
        // MSW handles DELETE and returns 204 No Content.
        // The real backend should also return 204 for this to work as-is.
        // If it returns 200 with a body instead, no changes are needed here
        // since we don't read the response body.
        console.log(id);
        const response = await fetch(baseUrl+"/api/products/"+id, {
            method: 'DELETE',
        })
        if (!response.ok) { // check for fejl.
            const res: any = await response.json();
            setError(res.error);
            
        }
        if (response.status === 204) {
            // ── WITHOUT TanStack Query ──────────────────────────────────────────
            // Manually remove the product from local state:
            // setProducts(products => products.filter(p => p.id !== id))
            // ───────────────────────────────────────────────────────────────────

            // ── WITH TanStack Query ─────────────────────────────────────────────
            // Two ways to update the UI after a mutation:
            //
            // 1. setQueryData — updates the cache directly without a network request.
            //    We already know which item was deleted (we have the id), so we can
            //    compute the new list immediately. Instant, no extra fetch.
            //
            // 2. invalidateQueries — marks the cache as stale and re-fetches the
            //    full list from the server. Costs a network round-trip but guarantees
            //    the client reflects any other server-side changes (e.g. cascading
            //    deletes, updated totals, etc.).
            //
            // Option 1 — setQueryData (active):
            // setQueryData takes an updater function that receives the current
            // cached array (old) and must return the new array.
            // old = [] is a default in case the cache is empty/undefined.
            // .filter() returns a new array with every product EXCEPT the one
            // whose id matches the one we just deleted.
            queryClient.setQueryData<Product[]>(["products"], (old = []) => old.filter(p => p.id !== id))
            //
            // Option 2 — invalidateQueries (commented out):
            // queryClient.invalidateQueries({ queryKey: ["products"] })
            // ───────────────────────────────────────────────────────────────────
        }


    }, []);

    return { products, createProduct, updateProduct, deleteProduct, isLoading, error: error || fetchError?.message || "", voteUpLike, liked };
}

