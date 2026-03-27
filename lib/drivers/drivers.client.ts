import axios from "axios"
import { AxiosApi } from "@/lib/api/nextBff.client"
import { createQueryString } from "@/lib/api/queryString"
import type { DriversApiResponse, SupplierDriversFilters, CreateDriverPayload, DriverOrdersFilters } from "@/types/supplier-drivers"
import type { OrdersApiResponse } from "@/types/orders_cart"

const DRIVERS_ROUTE = "/api/supplier/drivers"

export async function fetchDrivers(filters?: SupplierDriversFilters): Promise<DriversApiResponse> {
  try {
    const qs = createQueryString(filters)
    const url = qs ? `${DRIVERS_ROUTE}?${qs}` : DRIVERS_ROUTE
    const { data } = await AxiosApi.get<DriversApiResponse>(url)
    return data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || error.response?.data?.error || error.message)
    }
    throw error
  }
}

export async function fetchDriverDetail(id: string | number) {
  const { data } = await AxiosApi.get(`${DRIVERS_ROUTE}/${id}`)
  return data
}

export async function fetchDriverOrders(id: string | number, filters?: DriverOrdersFilters): Promise<OrdersApiResponse> {
  const qs = createQueryString(filters)
  const url = qs ? `${DRIVERS_ROUTE}/${id}/orders?${qs}` : `${DRIVERS_ROUTE}/${id}/orders`
  const { data } = await AxiosApi.get<OrdersApiResponse>(url)
  return data
}

export async function createDriver(payload: CreateDriverPayload) {
  const { data } = await AxiosApi.post(DRIVERS_ROUTE, payload)
  return data
}

export async function updateDriver(id: number, payload: Partial<CreateDriverPayload>) {
  const { data } = await AxiosApi.put(`${DRIVERS_ROUTE}/${id}`, payload)
  return data
}

export async function deleteDriver(id: number) {
  const { data } = await AxiosApi.delete(`${DRIVERS_ROUTE}/${id}`)
  return data
}
