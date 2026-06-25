import type { DriversFilters, DriverOrdersFilters } from "@/types/supplier-drivers"

export const DRIVERS_KEYS = {
  all: ["supplier-drivers"] as const,
  lists: () => [...DRIVERS_KEYS.all, "list"] as const,
  list: (filters?: DriversFilters) => [...DRIVERS_KEYS.lists(), filters] as const,
  detail: (id: string | number) => [...DRIVERS_KEYS .all, "detail", id] as const,
  orders: (id: string | number, filters?: DriverOrdersFilters) =>
    [...DRIVERS_KEYS.all, "driver-orders", id, filters] as const,
}
