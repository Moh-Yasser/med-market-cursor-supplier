import type { SupplierOffersFilters } from "@/types/offers"

export const OFFERS_KEYS = {
  all: ["supplier-offers"] as const,
  lists: () => [...OFFERS_KEYS.all, "list"] as const,
  list: (filters?: SupplierOffersFilters) => [...OFFERS_KEYS.lists(), filters] as const,
  detail: (id: string | number) => [...OFFERS_KEYS.all, "detail", id] as const,
}
