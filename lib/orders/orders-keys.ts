import type { SupplierOrdersFilters } from "@/types/supplier-orders"

export const ordersKeys = {
  all: ["supplier-orders"] as const,
  lists: () => [...ordersKeys.all, "list"] as const,
  list: (filters?: SupplierOrdersFilters) => [...ordersKeys.lists(), filters] as const,
  details: () => [...ordersKeys.all, "detail"] as const,
  detail: (id: string | number) => [...ordersKeys.details(), id] as const,
  invoice: (orderId: string | number) => [...ordersKeys.all, "invoice", orderId] as const,
}
