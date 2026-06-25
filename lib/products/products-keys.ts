import type { SupplierProductsFilters } from "@/types/supplier-products"

export const PRODUCTS_KEYS = {
  all: ["supplier-products"] as const,
  list: (filters?: SupplierProductsFilters) =>
    [...PRODUCTS_KEYS.all, "list", filters ?? {}] as const,
  detail: (id: string | number) => [...PRODUCTS_KEYS.all, "detail", id] as const,
}
