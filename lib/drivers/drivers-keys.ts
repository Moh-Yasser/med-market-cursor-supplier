import type { SupplierDriversFilters, DriverOrdersFilters } from "@/types/supplier-drivers"

export const driversKeys = {
  all: ["supplier-drivers"] as const,
  lists: () => [...driversKeys.all, "list"] as const,
  list: (filters?: SupplierDriversFilters) => [...driversKeys.lists(), filters] as const,
  detail: (id: string | number) => [...driversKeys.all, "detail", id] as const,
  orders: (id: string | number, filters?: DriverOrdersFilters) =>
    [...driversKeys.all, "driver-orders", id, filters] as const,
}
