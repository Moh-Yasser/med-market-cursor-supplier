"use client"

import { useQuery } from "@tanstack/react-query"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Loader2 } from "lucide-react"
import { ordersKeys } from "@/lib/orders/orders-keys"
import { fetchOrderInvoice } from "@/lib/orders/orders.client"

type Props = {
  orderId: number | null
  onClose: () => void
}

export function InvoiceDialog({ orderId, onClose }: Props) {

  const { data, isLoading, isError } = useQuery({
    queryKey: ordersKeys.invoice(orderId ?? 0),
    queryFn: () => fetchOrderInvoice(orderId!),
    enabled: !!orderId,
  })

  const invoice = data?.data

  return (
    <Dialog open={!!orderId} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>الفاتورة {invoice?.invoiceNumber ? `— ${invoice.invoiceNumber}` : ""}</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : isError || !invoice ? (
          <p className="text-center text-sm text-muted-foreground py-8">
            تعذر تحميل بيانات الفاتورة.
          </p>
        ) : (
          <div className="space-y-4 pt-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">رقم الفاتورة</span>
              <span className="font-medium">{invoice.invoiceNumber}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">الحالة</span>
              <span className="capitalize">{invoice.status}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">الدفع</span>
              <span className="capitalize">{invoice.paymentStatus}</span>
            </div>
            <div className="flex justify-between text-sm ">
              <span className="text-muted-foreground">التاريخ</span>
              <span>{new Date(invoice.generatedAt || invoice.createdAt).toLocaleDateString("ar")}</span>
            </div>

            <Separator />

            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">المجموع الفرعي</span>
              <span>${Number(invoice.subtotal).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">الضريبة</span>
              <span>${Number(invoice.taxAmount).toFixed(2)}</span>
            </div>

            <Separator />

            <div className="flex justify-between font-semibold text-base">
              <span>الإجمالي</span>
              <span>${Number(invoice.totalAmount).toFixed(2)}</span>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
