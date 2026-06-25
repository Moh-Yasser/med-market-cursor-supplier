import { OffersContent } from "@/components/supplier-offers/offers-content"
import { Suspense } from "react"


export default function OffersPage() {
  return (
     <Suspense fallback={<div className="h-96 w-full animate-pulse rounded-lg bg-muted" />}>
       <OffersContent/>
    </Suspense>
  
  )
}
