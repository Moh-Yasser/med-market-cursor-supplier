import { OffersContent } from "@/components/supplier-offers/offers-content"
import { Suspense } from "react"


export default function OffersPage() {
  return (
     <Suspense fallback={<DriversContentSkeleton />}>
       <OffersContent/>
    </Suspense>
  
  )
}
