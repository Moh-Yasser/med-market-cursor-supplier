import { AxiosApi } from "@/lib/api/nextBff.client"
import { createQueryString } from "@/lib/api/queryString"
import type { ProductsApiResponse } from "@/types/products"
import type { SupplierProductsFilters } from "@/types/supplier-products"

export async function fetchSupplierProducts(filters?: SupplierProductsFilters) {
  const qs = createQueryString(filters)
  const { data } = await AxiosApi.get<ProductsApiResponse>(
    `/api/supplier/products${qs ? `?${qs}` : ""}`,
  )
  return data
}

export async function createProduct(body: Record<string, unknown>) {
  const { data } = await AxiosApi.post("/api/supplier/products", body)
  return data
}

export async function updateProduct(id: number, body: Record<string, unknown>) {
  const { data } = await AxiosApi.put(`/api/supplier/products/${id}`, body)
  return data
}

export async function deleteProduct(id: number) {
  const { data } = await AxiosApi.delete(`/api/supplier/products/${id}`)
  return data
}
