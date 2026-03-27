import { phpFetch } from "@/lib/api/php.server"
import { createQueryString } from "@/lib/api/queryString"
import type { OrdersApiResponse } from "@/types/orders_cart"
import type { SupplierOrdersFilters } from "@/types/supplier-orders"

export async function getOrders(filters?: SupplierOrdersFilters) {
  const qs = createQueryString(filters)
  return phpFetch<OrdersApiResponse>(`/orders${qs ? `?${qs}` : ""}`)
}
