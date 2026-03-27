"use client"

import { useState, useCallback, useMemo } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search } from "lucide-react"
import { DataTable } from "@/components/table/data-table"
import { ProductAddDialog } from "./product-add-dialog"
import { ProductEditDialog } from "./product-edit-dialog"
import { createProductsColumns } from "./products-columns"
import { productsKeys } from "@/lib/products/products-keys"
import { fetchSupplierProducts } from "@/lib/products/products.client"
import type { Product } from "@/types/products"
import { ProductSearch } from "./products-search"
import { ProductsFilters } from "@/types/filters"
export function useProductsFiltersFromURL(): ProductsFilters {
  const searchParams = useSearchParams();

  return useMemo<ProductsFilters>(() => {
    return {
      search: searchParams.get("search") || undefined,
      category_id: searchParams.get("category_id") || undefined,
      manufacturer_id: searchParams.get("manufacturer_id") || undefined,
      is_active:searchParams.get("manufacturer_id") || undefined,
      page: parseInt(searchParams.get("page") || "1", 10),
      per_page: parseInt(searchParams.get("per_page") || "15", 10),
    };
  }, [searchParams]);
}
export function ProductsContent() {
  
  const filters = useProductsFiltersFromURL();

  const queryKey = useMemo(() => productsKeys.list(filters), [filters]);
  const queryFn = useMemo(() => () => fetchSupplierProducts(filters), [filters]);

  
  const [showAdd, setShowAdd] = useState(false)
  const [editProduct, setEditProduct] = useState<Product | null>(null)

  

  const columns = useMemo(
    () => createProductsColumns((product: Product) => setEditProduct(product)),
    [],
  )

  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">المنتجات</h1>
          <p className="text-sm text-muted-foreground mt-1">
            إضافة وتعديل وإدارة المنتجات الطبية
          </p>
        </div>
        <Button onClick={() => setShowAdd(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          إضافة منتج
        </Button>
      </div>

   <ProductSearch />

      <div className="rounded-lg border bg-card">
        <DataTable<Product>
          columns={columns}
          queryKey={queryKey}
          queryFn={queryFn}
          emptyMessage="لم يتم العثور على منتجات"
        />
      </div>

      <ProductAddDialog open={showAdd} onOpenChange={setShowAdd} />
      <ProductEditDialog product={editProduct} onClose={() => setEditProduct(null)} />
    </div>
  )
}
