"use client"

import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, User, Mail, Package, Loader2 } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { driversKeys } from "@/lib/drivers/drivers-keys"
import { fetchDriverDetail, fetchDriverOrders } from "@/lib/drivers/drivers.client"
import type { Order } from "@/types/orders_cart"

const statusStyles: Record<string, string> = {
  delivered: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  shipped: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  accepted: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400",
  prepared: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
}

export function DriverDetailsContent({ driverId }: { driverId: string }) {
  const { data: driverData, isLoading: driverLoading, isError: driverError } = useQuery({
    queryKey: driversKeys.detail(driverId),
    queryFn: () => fetchDriverDetail(driverId),
  })

  const { data: ordersData, isLoading: ordersLoading } = useQuery({
    queryKey: driversKeys.orders(driverId, { per_page: 100 }),
    queryFn: () => fetchDriverOrders(driverId, { per_page: 100 }),
  })

  const driver = driverData?.data
  const orders: Order[] = ordersData?.data ?? []
  const totalRevenue = orders.reduce((sum, o) => sum + Number(o.totalAmount), 0)

  if (driverLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (driverError || !driver) {
    return (
      <div className="space-y-6">
        <Link href="/drivers">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" /> العودة إلى السائقين
          </Button>
        </Link>
        <Card className="p-12">
          <div className="text-center text-muted-foreground">السائق غير موجود أو فشل في التحميل.</div>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Link href="/drivers">
        <Button variant="ghost" size="sm" className="gap-2">
          <ArrowLeft className="h-4 w-4" /> العودة إلى السائقين
        </Button>
      </Link>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">ملف السائق</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                <User className="h-10 w-10 text-primary" />
              </div>
            </div>
            <div className="text-center">
              <h2 className="text-xl font-semibold">{driver.name}</h2>
            </div>
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{driver.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Package className="h-4 w-4 text-muted-foreground" />
                <span>{orders.length} طلبات مخصصة</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="p-5">
              <p className="text-sm text-muted-foreground">إجمالي الطلبات</p>
              <p className="mt-1 text-2xl font-bold">{orders.length}</p>
            </Card>
            <Card className="p-5">
              <p className="text-sm text-muted-foreground">إجمالي الإيرادات</p>
              <p className="mt-1 text-2xl font-bold">${totalRevenue.toFixed(2)}</p>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">الطلبات المخصصة</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>رقم الطلب</TableHead>
                    <TableHead>الصيدلية</TableHead>
                    <TableHead>الوجهة</TableHead>
                    <TableHead className="text-center">التاريخ</TableHead>
                    <TableHead className="text-left">المبلغ</TableHead>
                    <TableHead className="text-center">الحالة</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ordersLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <TableRow key={i}>
                        {Array.from({ length: 6 }).map((_, j) => (
                          <TableCell key={j}><div className="h-4 w-full animate-pulse rounded bg-muted" /></TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : orders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                        لم يتم تخصيص طلبات لهذا السائق بعد.
                      </TableCell>
                    </TableRow>
                  ) : (
                    orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">#{order.orderNumber || order.id}</TableCell>
                        <TableCell>{order.buyerCompany?.name ?? "—"}</TableCell>
                        <TableCell className="text-muted-foreground max-w-[200px] truncate">
                          {order.buyerCompany?.address ?? "—"}
                        </TableCell>
                        <TableCell className="text-center text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString("ar")}
                        </TableCell>
                        <TableCell className="text-left font-medium">${Number(order.totalAmount).toFixed(2)}</TableCell>
                        <TableCell className="text-center">
                          <Badge className={statusStyles[order.status] || statusStyles.pending}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
