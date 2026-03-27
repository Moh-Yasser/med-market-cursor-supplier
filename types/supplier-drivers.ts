import type { ApiResponse } from "./api-response"

export interface DriverUser {
  id: number
  name: string
  email: string
  companyId?: number
  createdAt?: string
  updatedAt?: string
}

export type DriversApiResponse = ApiResponse<DriverUser>

export interface SupplierDriversFilters {
  page?: number
  per_page?: number
}

export interface CreateDriverPayload {
  name: string
  email: string
  password: string
}

export interface DriverOrdersFilters {
  status?: string
  page?: number
  per_page?: number
}
