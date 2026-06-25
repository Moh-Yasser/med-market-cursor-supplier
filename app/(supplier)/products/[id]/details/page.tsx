import ProductDetailsPage from "../../../../../components/supplier-products/product-details"
import { Suspense } from "react"
type Props = {
    params: Promise<{ id: string }>
  }
  
export default async function AddProductsPage({ params }: Props) {
    const { id } = await params
  return (
    <Suspense fallback={<div className="p-4 text-sm text-muted-foreground">جاري التحميل...</div>}>
      <ProductDetailsPage productId={id}/>
    </Suspense>
  )
}