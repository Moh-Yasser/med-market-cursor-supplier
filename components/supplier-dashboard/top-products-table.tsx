"use client"

import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { productsKeys } from "@/lib/products/products-keys"
import { fetchSupplierProducts } from "@/lib/products/products.client"
import type { Product } from "@/types/products"

export function TopProductsTable() {
  const { data, isLoading } = useQuery({
    queryKey: productsKeys.list({ per_page: 5 }),
    queryFn: () => fetchSupplierProducts({ per_page: 5 }),
  })

  const products: Product[] = data?.data ?? []

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">المنتجات الأخيرة</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>المنتج</TableHead>
              <TableHead>الفئة</TableHead>
              <TableHead className="text-center">المخزون</TableHead>
              <TableHead className="text-left">السعر</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 4 }).map((_, j) => (
                    <TableCell key={j}><div className="h-4 w-full animate-pulse rounded bg-muted" /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                  لا توجد منتجات بعد.
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{product.category?.name ?? "—"}</Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className={product.stockQuantity === 0 ? "text-destructive font-medium" : ""}>
                      {product.stockQuantity}
                    </span>
                  </TableCell>
                  <TableCell className="text-left font-medium">${Number(product.pharmacistPrice).toFixed(2)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
