import { OrdersContent } from "@/components/supplier-orders/orders-content"
import { Suspense } from "react"

export default function OrderHistoryPage() {
  return (
    <Suspense fallback={<div className="p-4 text-sm text-muted-foreground">جاري التحميل...</div>}>
      <OrdersContent />
    </Suspense>
  )
}
