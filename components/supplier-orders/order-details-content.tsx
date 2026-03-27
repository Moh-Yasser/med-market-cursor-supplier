"use client"

import { useMutation, useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ArrowRight, Store, MapPin, User, CalendarDays, Loader2 ,ClipboardList } from "lucide-react"
import { ordersKeys } from "@/lib/orders/orders-keys"
import { fetchOrderDetail } from "@/lib/orders/orders.client"
import type { Driver, OrderDetailResponse } from "@/types/supplier-orders"
import { DataTable } from "../table/data-table"
import { CartItem, Order } from "@/types/orders_cart"
import { createOrderProductsColumns } from "./order-details-columns"
import AcceptOrderDialog from "./accept-order"
import { useState } from "react"

const statusStyles: Record<string, string> = {
  delivered: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  shipped: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  accepted: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400",
  prepared: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
}

export function OrderDetailsContent({ orderId }: { orderId: string }) {
 const [open,setOpen]=useState<boolean>(false)

  const { data, isLoading, isError } = useQuery<OrderDetailResponse>({
    queryKey: ordersKeys.detail(orderId),
    queryFn: () => fetchOrderDetail(orderId),
  })

 
  const payload = data?.data
  const order: Order | null = payload
    ? (payload as Order)
    : null

  const driver: Driver | null = payload? ((payload.driver ?? null) as Driver | null) : null
  const status = order?.status ?? "pending"

 const columns= createOrderProductsColumns()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (isError || !order) {
    return (
      <div className="space-y-6">
          <Link href="/orders/history" >
        <button className="flex items-center gap-2 cursor-pointer transition-all  hover:translate-y-[-2px] ">
          <ArrowRight className="h-4 w-4" /> العودة إلى السجل
        </button>
      </Link>
        <Card className="p-12">
          <div className="text-center text-muted-foreground">الطلب غير موجود أو فشل في التحميل.</div>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Link href="/orders/history" >
        <button className="flex items-center gap-2 cursor-pointer transition-all  hover:translate-y-[-2px] ">
          <ArrowRight className="h-4 w-4" /> العودة إلى السجل
        </button>
      </Link>
<div className="flex justify-between items-center pt-6">
<div className="flex items-center gap-3 flex-wrap ">
        <h1 className="text-2xl font-semibold tracking-tight">طلب #{order.orderNumber || order.id}</h1>
        <Badge className={statusStyles[status] || statusStyles.pending}>
          {String(status).charAt(0).toUpperCase() + String(status).slice(1)}
        </Badge>
      </div>
      { order.status != "cancelled" && <Button className='cursor-pointer' onClick={()=>setOpen(true)}>
          <ClipboardList className="size-5" />
          اجراءات الطلب
        </Button>}
</div>
      

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">معلومات الطلب</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Store className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">الصيدلية:</span>
              <span className="font-medium">{order.buyerCompany?.name ?? "—"}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">العنوان:</span>
              <span className="font-medium">{order.buyerCompany?.address ?? "—"}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">السائق:</span>
              <span className="font-medium">{driver?.name ?? "غير معين"}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">التاريخ:</span>
              <span className="font-medium">{new Date(order.createdAt).toLocaleDateString("ar")}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">ملخص الفاتورة</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">المجموع الفرعي</span>
              <span>${Number(order.subtotal).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">الضريبة</span>
              <span>${Number(order.taxAmount).toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold text-base">
              <span>الإجمالي</span>
              <span>${Number(order.totalAmount).toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="rounded-lg border bg-card">
        <DataTable<CartItem>
          columns={columns}
         data={order.items ?? []}
         activatePagination={false}
          emptyMessage="لم يتم العثور على منتجات"
        />
      </div>
      <AcceptOrderDialog
        setOpen={setOpen}
        open={open}
        orderId={orderId}
        currentDriverId={driver ? String(driver.id) : null}
      />
    </div>
  )
}
