import axios from "axios"
import { AxiosApi } from "@/lib/api/nextBff.client"
import type { createBundleOfferType, createOfferType, OffersApiResponse,OfferApiResponse, SupplierOffersFilters, } from "@/types/offer"


const OFFERS_ROUTE = "/api/supplier/offers"

export async function fetchOffers(filters?: SupplierOffersFilters): Promise<OffersApiResponse> {
  try {
 
    const { data } = await AxiosApi.get<OffersApiResponse>(OFFERS_ROUTE,{params: filters})
    return data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || error.response?.data?.error || error.message)
    }
    throw error
  }
}

export async function getOfferById (id:number): Promise<OfferApiResponse> {
  try {
    const { data } = await AxiosApi.get<OfferApiResponse>(`${OFFERS_ROUTE}/${id}`)
    return data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || error.response?.data?.error || error.message)
    }
    throw error
  }
}



export async function createOffer(payload: createOfferType | createBundleOfferType) {
  try{
  const { data } = await AxiosApi.post(OFFERS_ROUTE, payload)
  return data
} catch (error) {
  if (axios.isAxiosError(error)) {
    throw new Error(error.response?.data?.message || error.response?.data?.error || error.message)
  }
  throw error
}
}

export async function updateOffer({id,payload}:{id: number, payload: createOfferType | createBundleOfferType}) {
  try{
  const { data } = await AxiosApi.put(`${OFFERS_ROUTE}/${id}`, payload)
  return data
} catch (error) {
  if (axios.isAxiosError(error)) {
    throw new Error(error.response?.data?.message || error.response?.data?.error || error.message)
  }
  throw error
}
}

export async function deleteOffer(id: number) {
  try{
  const { data } = await AxiosApi.delete(`${OFFERS_ROUTE}/${id}`)
  return data
} catch (error) {
  if (axios.isAxiosError(error)) {
    throw new Error(error.response?.data?.message || error.response?.data?.error || error.message)
  }
  throw error
}
}
