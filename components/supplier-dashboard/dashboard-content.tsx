"use client"

import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, ShoppingCart, AlertTriangle, Users, Loader2 } from "lucide-react"
import { productsKeys } from "@/lib/products/products-keys"
import { fetchSupplierProducts } from "@/lib/products/products.client"
import { ordersKeys } from "@/lib/orders/orders-keys"
import { fetchOrders } from "@/lib/orders/orders.client"
import { driversKeys } from "@/lib/drivers/drivers-keys"
import { fetchDrivers } from "@/lib/drivers/drivers.client"
import { TopProductsTable } from "./top-products-table"

export function DashboardContent() {
  const { data: productsData, isLoading: prodLoading } = useQuery({
    queryKey: productsKeys.list({ per_page: 1 }),
    queryFn: () => fetchSupplierProducts({ per_page: 1 }),
  })

  const { data: ordersData, isLoading: ordLoading } = useQuery({
    queryKey: ordersKeys.list({ per_page: 1 }),
    queryFn: () => fetchOrders({ per_page: 1 }),
  })

  const { data: driversData, isLoading: drvLoading } = useQuery({
    queryKey: driversKeys.list({ per_page: 1 }),
    queryFn: () => fetchDrivers({ per_page: 1 }),
  })

  const loading = prodLoading || ordLoading || drvLoading

  const stats = [
    {
      title: "إجمالي المنتجات",
      value: productsData?.pagination?.total ?? "—",
      icon: Package,
    },
    {
      title: "إجمالي الطلبات",
      value: ordersData?.pagination?.total ?? "—",
      icon: ShoppingCart,
    },
    {
      title: "الطلبات المعلقة",
      value: "—",
      icon: AlertTriangle,
    },
    {
      title: "السائقين النشطين",
      value: driversData?.pagination?.total ?? "—",
      icon: Users,
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">لوحة التحكم</h1>
        <p className="text-sm text-muted-foreground mt-1">
          نظرة عامة على أداء متجرك
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="h-8 w-16 animate-pulse rounded bg-muted" />
              ) : (
                <div className="text-2xl font-bold">{stat.value}</div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <TopProductsTable />
    </div>
  )
}
