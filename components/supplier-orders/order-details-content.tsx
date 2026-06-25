"use client"

import { useMemo, useState, type ComponentType } from "react"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import {
  ArrowRight,
  CalendarDays,
  ClipboardList,
  MapPin,
  RefreshCw,
  Store,
  User,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ORDERS_KEYS } from "@/lib/orders/orders-keys"
import { fetchOrderDetail } from "@/lib/orders/orders.client"
import type {  OrderDetailResponse } from "@/types/supplier-orders"
import type { CartItem, Order } from "@/types/orders_cart"

import { DataTable } from "../table/data-table"
import { createOrderProductsColumns } from "./order-details-columns"
import AcceptOrderDialog from "./accept-order"
import { OrderDetailsSkeleton } from "./order-details-skeleton"
import { Driver } from "@/types/supplier-drivers"
import { OrderDetailsErrorState } from "./order-details-Error"
import { statusStyles } from "@/lib/order-status-style"

type IconType = ComponentType<{ className?: string }>


function formatCurrency(value: unknown) {
  const number = Number(value ?? 0)

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number.isFinite(number) ? number : 0)
}

function formatOrderDate(value?: string | Date | null) {
  if (!value) return "—"

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return "—"

  return new Intl.DateTimeFormat("ar", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date)
}


function DetailTile({
  icon: Icon,
  label,
  value,
}: {
  icon: IconType
  label: string
  value: string
}) {
  return (
    <div className="rounded-2xl border bg-background/60 p-3">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Icon className="h-4 w-4 text-primary" />
        {label}
      </div>
      <p className="mt-2 line-clamp-2 text-sm font-medium leading-6">{value}</p>
    </div>
  )
}

function InvoiceLine({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  )
}


export function OrderDetailsContent({ orderId }: { orderId: string }) {
  const [open, setOpen] = useState(false)

  const columns = useMemo(() => createOrderProductsColumns(), [])

  const {
    data,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useQuery<OrderDetailResponse>({
    queryKey: ORDERS_KEYS.detail(orderId),
    queryFn: () => fetchOrderDetail(orderId),
  })

  const payload = data?.data
  const order: Order | null = payload ? (payload as Order) : null
  const driver: Driver | null = payload
    ? ((payload.driver ?? null) as Driver | null)
    : null

  const status = String(order?.status ?? "pending").toLowerCase()
  const statusInfo = statusStyles[status] ?? statusStyles.pending
  const canManageOrder = status !== "cancelled"

  if (isLoading) {
    return <OrderDetailsSkeleton />
  }

  if (isError || !order) {
    return (
      <OrderDetailsErrorState
        onRetry={() => void refetch()}
        isRetrying={isFetching}
      />
    )
  }

  const orderNumber = order.orderNumber || order.id
  const itemsCount = order.items?.length ?? 0
  const pharmacyName = order.buyerCompany?.name ?? "—"
  const pharmacyAddress = order.buyerCompany?.address ?? "—"
  const driverName = driver?.name ?? "غير معين"
  const createdAt = formatOrderDate(order.createdAt)

  return (
    <div dir="rtl" className="space-y-5">
      <Button
        asChild
        variant="ghost"
        size="sm"
        className="w-fit rounded-full px-3  hover:scale-105"
      >
        <Link href="/orders">
          <ArrowRight className="h-4 w-4" />
          العودة إلى السجل
        </Link>
      </Button>

      <section className="relative overflow-hidden rounded-4xl border bg-card p-5 shadow-sm">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.16),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(20,184,166,0.14),transparent_34%)]" />

        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border bg-background/70 px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur">
                B2B Order Control
              </span>

              <Badge
                variant="outline"
                className={`gap-2 rounded-full px-3 py-1.5 text-xs font-medium ${statusInfo.badge}`}
              >
                <span className={`h-2 w-2 rounded-full ${statusInfo.dot}`} />
                {statusInfo.label}
              </Badge>

              {isFetching && (
                <span className="inline-flex items-center gap-2 rounded-full border bg-background/70 px-3 py-1.5 text-xs text-muted-foreground shadow-sm backdrop-blur">
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  تحديث البيانات
                </span>
              )}
            </div>

            <div>
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                طلب #{orderNumber}
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                لوحة مختصرة لمتابعة بيانات الطلب، الفاتورة، السائق، ومنتجات
                السلة بدون زيادة مساحة الصفحة.
              </p>
            </div>

        
          </div>

          {canManageOrder && (
            <Button
              type="button"
              onClick={() => setOpen(true)}
              disabled={isFetching}
              className="h-11 w-fit rounded-xl cursor-pointer px-5 text-primary-foreground shadow-lg shadow-primary/15 transition-all hover:scale-[1.01] hover:opacity-95"
            >
              <ClipboardList className="h-5 w-5" />
              اجراءات الطلب
            </Button>
          )}
        </div>
      </section>


      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
        <Card className="rounded-2xl border bg-card/95 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">معلومات الطلب</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              <DetailTile
                icon={Store}
                label="الصيدلية"
                value={pharmacyName}
              />

              <DetailTile
                icon={MapPin}
                label="العنوان"
                value={pharmacyAddress}
              />

              <DetailTile
                icon={User}
                label="السائق"
                value={driverName}
              />

              <DetailTile
                icon={CalendarDays}
                label="تاريخ الإنشاء"
                value={createdAt}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden rounded-2xl border bg-card/95 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">ملخص الفاتورة</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="rounded-2xl bg-gradient-to-br from-primary/10 via-teal/10 to-background p-4">
              <p className="text-xs font-medium text-muted-foreground">
                الإجمالي المستحق
              </p>
              <p className="mt-2 text-3xl font-semibold tracking-tight">
                {formatCurrency(order.totalAmount)}
              </p>
            </div>

            <div className="space-y-3">
              <InvoiceLine
                label="المجموع الفرعي"
                value={formatCurrency(order.subtotal)}
              />

              <InvoiceLine
                label="الضريبة"
                value={formatCurrency(order.taxAmount)}
              />

              <Separator />

              <div className="flex items-center justify-between gap-4 text-base font-semibold">
                <span>الإجمالي</span>
                <span>{formatCurrency(order.totalAmount)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="overflow-hidden rounded-2xl border bg-card shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between gap-3 border-b pb-4">
          <div>
            <CardTitle className="text-base">منتجات الطلب</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              جميع عناصر السلة الخاصة بهذا الطلب
            </p>
          </div>

          <Badge
            variant="secondary"
            className="rounded-full px-3 py-1.5 text-xs font-medium"
          >
            {itemsCount} منتج
          </Badge>
        </CardHeader>

        <CardContent className="p-0">
          <DataTable<CartItem>
            columns={columns}
            data={order.items ?? []}
            activatePagination={false}
            emptyMessage="لم يتم العثور على منتجات"
          />
        </CardContent>
      </Card>

      <AcceptOrderDialog
        setOpen={setOpen}
        open={open}
        orderId={orderId}
        currentDriverId={driver ? String(driver.id) : null}
      />
    </div>
  )
}