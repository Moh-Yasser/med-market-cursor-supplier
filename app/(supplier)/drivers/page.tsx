import { DriversContent } from "@/components/supplier-drivers/drivers-content"
import { DriversContentSkeleton } from "@/components/supplier-drivers/drivers-content-skeleton"
import { Suspense } from "react"

export default function DriversPage() {
  return (
     <Suspense fallback={<DriversContentSkeleton />}>
    <DriversContent />
</Suspense>
  )
}
