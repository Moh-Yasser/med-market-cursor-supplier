import type { Order, OrderStatus } from "./orders_cart"
import { Driver } from "./supplier-drivers"

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



export interface StatusLog {
  id: number
  status: string
  notes: string | null
  createdAt: string
  user?: import("./auth").User
}
