import { Eye, FileText } from "lucide-react";
import { Button } from "../ui/button";
import { Order } from "@/types/orders_cart";
import Link from "next/link";
interface Props{
order:Order,
showInvoiceOrder:(id:number)=>void
}
export function OrderActions({order,showInvoiceOrder}:Props) {
    return (
        <div className="flex items-center justify-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 text-muted-foreground hover:text-brand-foreground hover:bg-brand"
          onClick={() => showInvoiceOrder(order.id)}
        >
          <FileText className="h-4 w-4" />
          الفاتورة
        </Button>
        <Link href={`/orders/${order.id}`}>
          <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:bg-primary hover:text-primary-foreground">
            <Eye className="h-4 w-4" />
            التفاصيل
          </Button>
        </Link>
      </div>
    )
}