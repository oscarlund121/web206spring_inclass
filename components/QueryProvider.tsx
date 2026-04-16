"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { getQueryClient } from "../app/get-query-client";

export default function QueryProvider({ children }: { children: React.ReactNode }) {
    // getQueryClient() returns a browser singleton on the client and a fresh
    // instance on the server — see app/get-query-client.ts for details.
    const queryClient = getQueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}
