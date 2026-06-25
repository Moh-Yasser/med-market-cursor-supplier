"use client"

import {  useMemo } from "react"
import { useSearchParams } from "next/navigation"
import { Plus } from "lucide-react"
import { DataTable } from "@/components/table/data-table"
import {  ProductsColumns } from "./products-columns"
import { PRODUCTS_KEYS } from "@/lib/products/products-keys"
import { fetchMyProducts } from "@/lib/products/products.client"
import type { Product } from "@/types/products"
import { ProductSearch } from "./products-search"
import { ProductsFilters } from "@/types/filters"
import Link from "next/link"
import { Button } from "../ui/button"
export function useProductsFiltersFromURL(): ProductsFilters {
  const searchParams = useSearchParams();

  return useMemo<ProductsFilters>(() => {
    return {
      search: searchParams.get("search") || undefined,
      category_id: searchParams.get("category_id") || undefined,
      manufacturer_id: searchParams.get("manufacturer_id") || undefined,
      is_active: searchParams.get("manufacturer_id") || undefined,
      paginate: searchParams.get("paginate") === "true",
      page: parseInt(searchParams.get("page") || "1", 10),
      per_page: parseInt(searchParams.get("per_page") || "15", 10),
    };
  }, [searchParams]);
}
export function ProductsContent() {
  
  const filters = useProductsFiltersFromURL();

  const queryKey = useMemo(() => PRODUCTS_KEYS.list(filters), [filters]);
  const queryFn = useMemo(() => () => fetchMyProducts(filters), [filters]);

  
  const columns = ProductsColumns;

  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">المنتجات</h1>
          <p className="text-sm text-muted-foreground mt-1">
            إضافة وتعديل وإدارة المنتجات الطبية
          </p>
        </div>
        <Button>
        <Link href="/products/add" className="gap-2 flex items-center justify-center ">
          <Plus className="h-4 w-4" />
          إضافة منتج
        </Link>
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

    
    </div>
  )
}
