import { phpFetch } from "@/lib/api/php.server"
import { createQueryString } from "@/lib/api/queryString"
import { ProductsFilters } from "@/types/filters"
import type { ProductsApiResponse } from "@/types/products"
import type { SupplierProductsFilters } from "@/types/supplier-products"



export async function getMyProducts(filters?: SupplierProductsFilters) {
  const qs = createQueryString(filters)
  return phpFetch<ProductsApiResponse>(`/products${qs ? `?${qs}` : ""}`)
}


const PRODUCTS_PATH = "/products";

export async function GetSupplierProducts(
  filters?: ProductsFilters,
): Promise<ProductsApiResponse> {
  const queryString = createQueryString(filters);
  const path = queryString ? `${PRODUCTS_PATH}?${queryString}` : PRODUCTS_PATH;

  return phpFetch<ProductsApiResponse>(path, { method: "GET" });
}
