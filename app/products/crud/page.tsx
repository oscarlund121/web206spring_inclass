"use client";

import { MSWProvider } from "../../../components/MSWProvider";
import CrudProductList from "../../../components/CrudProductList";

export default function CrudPage() {
    return (
        <MSWProvider>
            <CrudProductList />
        </MSWProvider>
    );
}
