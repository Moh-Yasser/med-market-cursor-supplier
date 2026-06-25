import AddProductContent from "@/components/supplier-products/product-add-content"
import { Suspense } from "react"

export default function AddProductsPage() {
  return (
    <Suspense fallback={<div className="p-4 text-sm text-muted-foreground">جاري التحميل...</div>}>
      <AddProductContent />
    </Suspense>
  )
}