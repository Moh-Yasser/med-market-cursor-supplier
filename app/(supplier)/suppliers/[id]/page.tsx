import { SupplierContent } from "@/components/otherSuppliers/suppliers-details/supplier-details-content";
import { SUPPLIERS_KEYS } from "@/lib/suppliers/suppliers-keys";
import { getSupplier } from "@/lib/suppliers/suppliers.client";
import { HydrationBoundary, dehydrate, QueryClient } from "@tanstack/react-query"

export default async function SupplierDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } =await params;
    const queryClient = new QueryClient();
    
     await queryClient.prefetchQuery({
        queryKey: SUPPLIERS_KEYS.detail(id),
        queryFn: () => getSupplier(id),
    });

    return <HydrationBoundary state={dehydrate(queryClient)}    >
        <SupplierContent supplierId={id} />
    </HydrationBoundary>
}   
