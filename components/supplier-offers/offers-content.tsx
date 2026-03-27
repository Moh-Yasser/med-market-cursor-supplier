"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, Loader2, Pencil } from "lucide-react"
import { offersKeys } from "@/lib/offers/offers-keys"
import { fetchOffers, deleteOffer, updateOffer } from "@/lib/offers/offers.client"
import type { createOfferType, createBundleOfferType, ProductOffer, OffersApiResponse } from "@/types/offer"
import SupplierOfferIntro from "./supplier-offer-intro"
import Link from "next/link"
import OfferCard from "./offer-card"



export function OffersContent() {
  const queryClient = useQueryClient()

  const { data, isLoading, isFetching } = useQuery({
    queryKey: offersKeys.list(),
    queryFn: () => fetchOffers(),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteOffer,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: offersKeys.all }),
  })

  const updateMutation = useMutation({
    mutationFn: ({
      offerId,
      payload,
    }: {
      offerId: number
      payload: createBundleOfferType | createOfferType
    }) => updateOffer({ id: offerId, payload }),
    onSuccess: (_, { offerId, payload }) => {
      queryClient.setQueryData<OffersApiResponse>(offersKeys.list(), (old) => {
        if (!old?.data) return old
        return {
          ...old,
          data: old.data.map((offer) =>
            offer.id === offerId ? { ...offer, isActive: payload.is_active } : offer
          ),
        }
      })
    },
    onError: (error) => {
      console.error("Error:", error)
    },
  })

  const offers: ProductOffer[] = data?.data ?? []
  

  const loading = isLoading || isFetching

  const handleDelete = (id: number) => {
    if (confirm("هل أنت متأكد من حذف هذا العرض؟")) {
      deleteMutation.mutate(id)
    }
  }
 
  const handleSwitch = (offer: ProductOffer, checked: boolean) => {
    const base = {
      name: offer.name,
      description: offer.description ?? undefined,
      offer_type: offer.offerType,
      discount_value: offer.discountValue,
      quantity_required: offer.quantityRequired ?? undefined,
      quantity_free: offer.quantityFree ?? undefined,
      is_active: checked,
      start_date: offer.startDate,
      end_date: offer.endDate ?? undefined,
    }
    const payload: createBundleOfferType | createOfferType =
      offer.offerType === "bundle_fixed" || offer.offerType === "bundle_percentage"
        ? {
            ...base,
            product_ids: offer.products.map((p) => p.id),
            products: offer.products.map((p) => ({ product_id: p.id, quantity: 1 })),
          }
        : { ...base, product_ids: offer.products.map((p) => p.id) }
    updateMutation.mutate({ offerId: offer.id, payload })
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">العروض</h1>
          <p className="text-sm text-muted-foreground mt-1">إدارة الخصومات والعروض الترويجية</p>
        </div>
        <Link href="offers/create" >
        <Button className="gap-2 hover:cursor-pointer">
          <Plus className="h-4 w-4" />
          إنشاء عرض
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : offers.length === 0 ? (
        <SupplierOfferIntro/>
      ) : (
        <>
          <div className="space-y-4">
            {offers.map((offer) => (
              <OfferCard
                key={offer.id}
                offer={offer}
                handleDelete={handleDelete}
                isDeletePending={deleteMutation.isPending}
                isSwitchPending={
                  updateMutation.isPending &&
                  updateMutation.variables?.offerId === offer.id
                }
                handleSwitch={handleSwitch}
              />
            ))}
          </div>
        </>
      )}

    </div>
  )
}
