import type { SupplierOrdersFilters } from "@/types/supplier-orders"

export const ORDERS_KEYS = {
  all: ["supplier-orders"] as const,
  lists: () => [...ORDERS_KEYS.all, "list"] as const,
  list: (filters?: SupplierOrdersFilters) => [...ORDERS_KEYS.lists(), filters] as const,
  details: () => [...ORDERS_KEYS.all, "detail"] as const,
  detail: (id: string | number) => [...ORDERS_KEYS.details(), id] as const,
  invoice: (orderId: string | number) => [...ORDERS_KEYS.all, "invoice", orderId] as const,
}
