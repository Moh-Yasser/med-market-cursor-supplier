import type { Product } from "./products";


export interface SupplierProductsFilters {
  search?: string;
  category_id?: string;
  manufacturer_id?: string;
  supplier_company_id?: string;
  page?: number;
  per_page?: number;
}

