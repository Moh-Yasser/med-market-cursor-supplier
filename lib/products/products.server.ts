import { phpFetch } from "@/lib/api/php.server"
import { createQueryString } from "@/lib/api/queryString"
import type { ProductsApiResponse } from "@/types/products"
import type { SupplierProductsFilters } from "@/types/supplier-products"

export async function getSupplierProducts(filters?: SupplierProductsFilters) {
  const qs = createQueryString(filters)
  return phpFetch<ProductsApiResponse>(`/supplier/products${qs ? `?${qs}` : ""}`)
}
