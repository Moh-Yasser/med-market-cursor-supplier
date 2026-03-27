import { phpFetch } from "@/lib/api/php.server"
import { createQueryString } from "@/lib/api/queryString"
import type { OfferApiResponse, OffersApiResponse, SupplierOffersFilters } from "@/types/offer"

export async function getOffers(filters?: SupplierOffersFilters) {
  const qs = createQueryString(filters)
  return phpFetch<OffersApiResponse>(`/offers${qs ? `?${qs}` : ""}`)
}

export async function getOfferById(id:number) :Promise<OfferApiResponse> { 
      const data = await phpFetch<OfferApiResponse>(`/offers/${id}`)
      return data 
  }