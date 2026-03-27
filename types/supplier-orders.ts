import type { Order, OrderStatus } from "./orders_cart"

export interface SupplierOrdersFilters {
  status?: OrderStatus | "all"
  buyer_company_id?: string
  buyer_name?: string
  from_date?: string
  to_date?: string
  page?: number
  per_page?: number
}

export interface OrderDetailResponse {
  success: boolean;
  data: Order & {
    driver?: Driver | null;
  };
} 

export interface Driver {
  id: number
  name: string
  email: string
  companyId?: number
  createdAt?: string
  updatedAt?: string
}

export interface StatusLog {
  id: number
  status: string
  notes: string | null
  createdAt: string
  user?: import("./auth").User
}
