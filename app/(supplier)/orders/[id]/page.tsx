import { OrderDetailsContent } from "@/components/supplier-orders/order-details-content"

type Props = {
  params: Promise<{ id: string }>
}

export default async function OrderDetailsPage({ params }: Props) {
  const { id } = await params
  return <OrderDetailsContent orderId={id} />
}
