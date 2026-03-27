import { DriversContent } from "@/components/supplier-drivers/drivers-content"
import { Suspense } from "react"

export default function DriversPage() {
  return (
    <Suspense fallback={<div className="p-4 text-sm text-muted-foreground">جاري التحميل...</div>}>
      <DriversContent />
    </Suspense>
  )
}
