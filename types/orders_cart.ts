import { ApiResponse } from "./api-response";
import { User } from "./auth";
import { Company, Supplier } from "./company";
import { ProductOffer } from "./offer";
import { Product } from "./products";

export type OrdersApiResponse = ApiResponse<Order>;

export type OrderStatus =
  | "prepared"
  | "pending"
  | "accepted"
  | "accepting"
  | "shipped"
  | "delivered"
  | "cancelled";

export type CartApiResponse={
  success: boolean;
  data: Cart;
  message?: string;
};

export interface Cart{
  id: number,
  itemsBySupplier: ItemBySupplier[],
  hasMultipleSuppliers: boolean,
  suppliersCount: number,
  subtotal: number,
  totalAmount: number
}



export interface Order {
  id: number;
  orderNumber: string;
  status: OrderStatus;
  buyerCompany: Company;
  supplierCompany: Company;
  items: CartItem[];
  totalQuantity:number,
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  notes: string | null;
  acceptedAt: string | null;
  preparedAt: string | null;
  shippedAt: string | null;
  deliveredAt: string | null;
  cancelledAt: string | null;
  cancellationReason: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ItemBySupplier {
  supplier: Supplier;
  items: CartItem[];
  subtotal: number;
  itemCount: number;
}

export interface CartItem {
  id:number,
  product:Product ,
  quantity: number,
  unitPrice: number,
  totalPrice: number,
  appliedOffer?:ProductOffer,
  appliedOfferId?: number,
  notes?: string
}

export interface OrdersFilters {
  supplier?: string;
  buyer?: string;
  status?: OrderStatus | "all";
  date_from?: string;
  date_to?: string;
}



