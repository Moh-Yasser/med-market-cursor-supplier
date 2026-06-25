import { AxiosApi, handleAxiosError } from "@/lib/api/nextBff.client";
import axios from "axios";
import { createQueryString } from "@/lib/api/queryString";
import { ProductsFilters } from "@/types/filters";
import type { ProductsApiResponse } from "@/types/products";
import type { SupplierProductsFilters } from "@/types/supplier-products";
import { BackendErrorBody, PhpApiError } from "@/lib/error";

const MY_PRODUCTS_ROUTE = "/api/supplier/myProducts";

export async function fetchMyProducts(filters?: SupplierProductsFilters) {
  try {
    const qs = createQueryString(filters);
    const { data } = await AxiosApi.get<ProductsApiResponse>(
      `${MY_PRODUCTS_ROUTE}?${qs ? `?${qs}` : ""}`,
    );
    return data;
  } catch (error) {
  handleAxiosError(error);
  }
}

export async function createProduct(body: Record<string, unknown>) {
  try {
    const { data } = await AxiosApi.post("/api/supplier/products", body);
    return data;
  } catch (error) {
  handleAxiosError(error);
  }
}

export async function fetchProductDetail(id: number | string) {
  try {
    const { data } = await AxiosApi.get(`/api/supplier/products/${id}`);
    return data;
  } catch (error) {
  handleAxiosError(error);
  }
}

export async function updateProduct(id: number, body: Record<string, unknown>) {
  try {
    const { data } = await AxiosApi.put(`/api/supplier/products/${id}`, body);
    return data;
  } catch (error) {
  handleAxiosError(error);
  }
}

export async function deleteProduct(id: number) {
  try {
    const { data } = await AxiosApi.delete(`/api/supplier/products/${id}`);
    return data;
  } catch (error) {
  handleAxiosError(error);
  }
}

const PRODUCTS_ROUTE = "/api/supplier/products";

export async function getSupplierProducts(
  supplierId: string,
  filters?: ProductsFilters,
): Promise<ProductsApiResponse> {
  try {
    const queryString = createQueryString({
      ...filters,
      supplier_company_id: supplierId,
    });
    const url = queryString
      ? `${PRODUCTS_ROUTE}?${queryString}`
      : PRODUCTS_ROUTE;

    const response = await AxiosApi.get<ProductsApiResponse>(url);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
}
