import type { SupplierProductsFilters } from "@/types/supplier-products"

export const productsKeys = {
  all: ["supplier-products"] as const,
  list: (filters?: SupplierProductsFilters) =>
    [...productsKeys.all, "list", filters ?? {}] as const,
  detail: (id: number) => [...productsKeys.all, "detail", id] as const,
}
