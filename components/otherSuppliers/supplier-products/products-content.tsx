"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ProductSearch } from "./products-search";
import type { Product } from "@/types/products";
import type { CartApiResponse, CartItem } from "@/types/orders_cart";
import { DataTable } from "@/components/table/data-table";
import { createProductsColumns } from "./products-columns";
import { PRODUCTS_KEYS } from "@/lib/products/products-keys";
import { getSupplierProducts } from "@/lib/products/products.client";
import { getCart } from "@/lib/cart/cart.client";
import { CART_KEYS } from "@/lib/cart/cart-keys";
import { ProductsFilters } from "@/types/filters";


export function useProductsFiltersFromURL(): ProductsFilters {
  const searchParams = useSearchParams();

  return useMemo<ProductsFilters>(() => {
    return {
      search: searchParams.get("search") || undefined,
      category_id: searchParams.get("category_id") || undefined,
      manufacturer_id: searchParams.get("manufacturer_id") || undefined,
      supplier_company_id:
        searchParams.get("supplier_company_id") || undefined,
      page: parseInt(searchParams.get("page") || "1", 10),
      per_page: parseInt(searchParams.get("per_page") || "15", 10),
    };
  }, [searchParams]);
}


export function buildCartMap(cartResponse: CartApiResponse | undefined): Map<number, CartItem> {
  const map = new Map<number, CartItem>();
  if (!cartResponse?.data?.itemsBySupplier) return map;
  for (const group of cartResponse.data.itemsBySupplier) {
    for (const item of group.items) {
      map.set(item.product.id, item);
    }
  }
  return map;
}





