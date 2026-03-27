import { DriverDetailsContent } from "@/components/supplier-drivers/driver-details-content"

type Props = {
  params: Promise<{ id: string }>
}

export default async function DriverDetailsPage({ params }: Props) {
  const { id } = await params
  return <DriverDetailsContent driverId={id} />
}
