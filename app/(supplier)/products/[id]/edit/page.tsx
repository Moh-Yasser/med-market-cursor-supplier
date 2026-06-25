import EditProductContent from "@/components/supplier-products/product-edit-content"
import { Suspense } from "react"
type Props = {
    params: Promise<{ id: string }>
  }
  
export default async function AddProductsPage({ params }: Props) {
    const { id } = await params
  return (
    <Suspense fallback={<div className="p-4 text-sm text-muted-foreground">جاري التحميل...</div>}>
      <EditProductContent productId={id}/>
    </Suspense>
  )
}