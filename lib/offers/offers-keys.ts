import type { SupplierOffersFilters } from "@/types/supplier-offers"

export const offersKeys = {
  all: ["supplier-offers"] as const,
  lists: () => [...offersKeys.all, "list"] as const,
  list: (filters?: SupplierOffersFilters) => [...offersKeys.lists(), filters] as const,
  detail: (id: string | number) => [...offersKeys.all, "detail", id] as const,
}
