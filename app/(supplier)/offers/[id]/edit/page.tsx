import { OfferForm } from "@/components/supplier-offers/offers-form/offer-form"
import { ArrowLeft, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { getOfferById } from "@/lib/offers/offers.server"
import type { OfferFormValues } from "@/components/supplier-offers/offers-form/offer-schema"

type Props = {
  params: Promise<{ id: string }>
}

export default async function EditOfferPage({ params }:Props) {
  const {id}=await params;
  const dataFetched = await getOfferById(Number(id))
const offer=dataFetched.data;
  const initialData: OfferFormValues = {
    name: offer.name,
    description: offer.description ?? "",
    product_ids: offer.products.map((pro)=>pro.id),
    discount_value: offer.discountValue?.toString() ?? "",
    quantity_required: offer.quantityRequired?.toString() ?? "",
    quantity_free: offer.quantityFree?.toString() ?? "",
    start_date: new Date(offer.startDate),
    end_date: offer.endDate
      ? new Date(offer.endDate)
      : undefined,
    offer_type: offer.offerType,
  }

  return (
    <main className="min-h-screen bg-background">
    <div className="h-1 w-full bg-primary" />
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
    <div className="flex items-center gap-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
        <Sparkles className="h-6 w-6" aria-hidden="true" />
      </div>
      <div className="grid gap-0.5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground text-balance">
تعديل العرض
        </h1>
      </div>
    </div>
    <Button variant="outline" asChild className="gap-2 self-start">
      <Link href="/offers">
        العودة
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
      </Link>
    </Button>
  </div>
    <OfferForm
      mode="edit"
      offerId={offer.id}
      initialData={initialData}
    />
      </div>
      </div>
    </main>
  )
}