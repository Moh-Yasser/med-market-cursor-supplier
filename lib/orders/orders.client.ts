import axios from "axios"
import { AxiosApi } from "@/lib/api/nextBff.client"
import { createQueryString } from "@/lib/api/queryString"
import type { OrdersApiResponse } from "@/types/orders_cart"
import type { SupplierOrdersFilters, OrderDetailResponse } from "@/types/supplier-orders"

const ORDERS_ROUTE = "/api/supplier/orders"

export async function fetchOrders(filters?: SupplierOrdersFilters): Promise<OrdersApiResponse> {
  try {
    const qs = createQueryString(filters)
    const url = qs ? `${ORDERS_ROUTE}?${qs}` : ORDERS_ROUTE
    const { data } = await AxiosApi.get<OrdersApiResponse>(url)
    return data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || error.response?.data?.error || error.message)
    }
    throw error
  }
}

export async function fetchOrderDetail(id: string | number): Promise<OrderDetailResponse> {
  try {
    const { data } = await AxiosApi.get<OrderDetailResponse>(`${ORDERS_ROUTE}/${id}`)
    return data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || error.response?.data?.error || error.message)
    }
    throw error
  }
}

export async function assignDriver(orderId: number, driverId: number) {
  const { data } = await AxiosApi.post(`${ORDERS_ROUTE}/${orderId}/assign-driver`, { driver_id: driverId })
  return data
}

export async function updateOrderStatus(orderId: number, status: string, notes?: string) {
  const { data } = await AxiosApi.post(`${ORDERS_ROUTE}/${orderId}/status`, { status, notes })
  return data
}

export async function cancelOrder(orderId: number, reason: string) {
  const { data } = await AxiosApi.post(`${ORDERS_ROUTE}/${orderId}/cancel`, { reason })
  return data
}

export async function fetchOrderInvoice(orderId: string | number) {
  const { data } = await AxiosApi.get(`${ORDERS_ROUTE}/${orderId}/invoice`)
  return data
}
