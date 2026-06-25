"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  ArrowRight,
  Mail,
  Package,
  Loader2,
  TrendingUp,
  CheckCircle2,
  ReceiptText,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DRIVERS_KEYS } from "@/lib/drivers/drivers-keys";
import {
  fetchDriverDetail,
  fetchDriverOrders,
} from "@/lib/drivers/drivers.client";
import type { Order } from "@/types/orders_cart";
import { Driver, DriverStatus } from "@/types/supplier-drivers";
import { DriverDetailsError } from "./driver-details-error";
import { DriverDetailsLoader } from "./driver-details-loader";


const statusStyles: Record<string, string> = {
  delivered:
    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  shipped: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  pending:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  accepted: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400",
  prepared:
    "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
};

const DriverStatusStyles: Record<
  DriverStatus,
  { label: string; className: string; dotClassName: string }
> = {
  "On delivery": {
    label: "قيد التوصيل",
    className: "bg-[#ecfdf5] text-[#065f46] border-[#a7f3d0]",
    dotClassName: "#10b981",
  },
  available: {
    label: "متاح",
    className: "bg-warning text-warning-foreground border-warning",
    dotClassName: "#f59e0b",
  },
  Off: {
    label: "غير متصل",
    className:
      "bg-surface-container text-on-surface-variant border-outline-variant",
    dotClassName: "#9ca3af",
  },
};

export function DriverDetailsContent({ driverId }: { driverId: string }) {

  const {
  data: driverData,
  isLoading: driverLoading,
  isError: driverError,
  isFetching: driverFetching,
  refetch: refetchDriver,
} = useQuery({
  queryKey: DRIVERS_KEYS.detail(driverId),
  queryFn: () => fetchDriverDetail(driverId),
});
 

  const { data: ordersData, isLoading: ordersLoading } = useQuery({
    queryKey: DRIVERS_KEYS.orders(driverId, { per_page: 100 }),
    queryFn: () => fetchDriverOrders(driverId, { per_page: 100 }),
  });

  const driver: Driver = driverData?.data;
  const driverStatus = DriverStatusStyles[driver?.driverStatus as DriverStatus];
  const orders: Order[] = ordersData?.data ?? [];
  const totalRevenue = orders.reduce(
    (sum, o) => sum + Number(o.totalAmount),
    0,
  );

if (driverLoading) {
  return <DriverDetailsLoader />;
}

if (driverError || !driver) {
  return (
    <DriverDetailsError
      onRetry={() => void refetchDriver()}
      isRetrying={driverFetching}
    />
  );
}
  return (
    <div  className="space-y-6">
      <Link
        href="/drivers"
        className="inline-flex items-center gap-2   rounded-md "
      >
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 hover:bg-transparent cursor-pointer hover:scale-102"
        >
          <ArrowRight className="h-4 w-4" /> العودة إلى السائقين
        </Button>
      </Link>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Driver profile card */}
        <Card className="overflow-hidden lg:col-span-1">
          {/* Banner */}
          <div className="relative h-24 bg-primary">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_120%,var(--color-white),transparent_60%)]/[15]" />
          </div>

          <CardContent className="-mt-12 space-y-5 px-6 pb-6 text-center">
            <div className="flex justify-center">
              <Avatar className="h-24 w-24 border-4 border-card shadow-md">
                <AvatarFallback className="bg-primary text-2xl font-semibold text-primary-foreground">
                  {driver.name[0]}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="space-y-1.5">
              <h2 className="text-xl font-semibold text-foreground">
                {driver.name}
              </h2>
              <Badge className={`gap-1.5 ${driverStatus.className}`}>
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: driverStatus.dotClassName }}
                />
                {driverStatus.label}
              </Badge>
            </div>

            <Separator />

            <div className="space-y-3 text-right">
              <div className="flex items-center gap-3 rounded-lg bg-muted/60 p-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Mail className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">
                    البريد الإلكتروني
                  </p>
                  <p className="truncate text-sm font-medium text-foreground">
                    {driver.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-lg bg-muted/60 p-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Package className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">
                    الطلبات المخصصة
                  </p>
                  <p className="text-sm font-medium text-foreground">
                    {orders.length} طلب
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4 lg:col-span-2">
          {/* Stat cards */}
          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">إجمالي الطلبات</p>
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Package className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-3 text-2xl font-bold text-foreground">
                {driver.totalOrderCount}
              </p>
            </Card>

            <Card className="p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  الطلبات المُسلّمة اليوم
                </p>
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-3 text-2xl font-bold text-foreground">
                {driver.deliveredOrderCount}
              </p>
            </Card>

            <Card className="p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  إجمالي الإيرادات
                </p>
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <TrendingUp className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-3 text-2xl font-bold text-foreground">
                ${totalRevenue.toFixed(2)}
              </p>
            </Card>
          </div>

          {/* Orders table — left as is */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">الطلبات المخصصة</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-right">رقم الطلب</TableHead>
                    <TableHead className="text-right">الصيدلية</TableHead>
                    <TableHead className="text-center">الوجهة</TableHead>
                    <TableHead className="text-left">المبلغ</TableHead>
                    <TableHead className="text-center">الحالة</TableHead>
                    <TableHead className="text-center">التفاصيل</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ordersLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <TableRow key={i}>
                        {Array.from({ length: 6 }).map((_, j) => (
                          <TableCell key={j}>
                            <div className="h-4 w-full animate-pulse rounded bg-muted" />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : orders.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="h-24 text-center text-muted-foreground"
                      >
                        لم يتم تخصيص طلبات لهذا السائق بعد.
                      </TableCell>
                    </TableRow>
                  ) : (
                    orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">
                          #{order.orderNumber || order.id}
                        </TableCell>
                        <TableCell>{order.buyerCompany?.name ?? "—"}</TableCell>
                        <TableCell className="text-muted-foreground max-w-50 truncate">
                          {order.buyerCompany?.address ?? "—"}
                        </TableCell>
                        <TableCell className="text-left font-medium">
                          ${Number(order.totalAmount).toFixed(2)}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            className={
                              statusStyles[order.status] || statusStyles.pending
                            }
                          >
                            {order.status.charAt(0).toUpperCase() +
                              order.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-left font-medium">
                          <Link href={`/orders/${order.id}`}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="gap-1.5 text-muted-foreground  hover:bg-primary hover:text-primary-foreground"
                            >
                              <ReceiptText className="h-4 w-4" />
                              التفاصيل
                            </Button>
                          </Link>
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
  );
}
