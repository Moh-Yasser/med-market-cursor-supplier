import { ProductsContent } from "@/components/supplier-products/products-content"
import { Suspense } from "react"

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="p-4 text-sm text-muted-foreground">جاري التحميل...</div>}>
      <ProductsContent />
    </Suspense>
  )
}
