import { FlaskConical, Package, Pill, Syringe } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import type { TopProducts } from "@/types/dashboard"


function StockBadge({ qty }: { qty: number }) {
  if (qty === 0) {
    return (
      <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
        نفد المخزون
      </Badge>
    )
  }
  if (qty <= 20) {
    return (
      <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">
        {qty}
      </Badge>
    )
  }
  return (
    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
      {qty}
    </Badge>
  )
}

function TableSkeleton() {
  return (
    <div className="space-y-3 p-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-10 w-full rounded-md" />
      ))}
    </div>
  )
}

export function TopProductsTable({
  products,
  isLoading = false,
}: {
  products: TopProducts
  isLoading?: boolean
}) {
  return (
    <section className="overflow-hidden rounded-xl bg-white shadow-[0_4px_20px_rgba(26,54,93,0.07)]">
      <div className="border-b border-[#f8fafc] p-6">
        <h2 className="text-lg font-bold text-[#002045]">
          أفضل المنتجات مبيعاً
        </h2>
      </div>

      {isLoading ? (
        <TableSkeleton />
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-12 text-[#43474e]">
          <Package className="h-9 w-9 text-[#c4c6cf]" />
          <p className="text-sm">لا توجد منتجات</p>
        </div>
      ) : (
        <Table>
          <TableHeader className="bg-[#f8f9ff]">
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-right font-bold text-[#002045]">
                اسم المنتج
              </TableHead>
              <TableHead className="text-center font-bold text-[#002045]">
                المخزون
              </TableHead>
              <TableHead className="text-left font-bold text-[#002045]">
                سعر المستهلك
              </TableHead>
              <TableHead className="text-left font-bold text-[#002045]">
                سعر المفرق
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {products.map((product, index) => {

              return (
                <TableRow
                  key={product.id}
                  className={cn(
                    "border-b border-[#f8fafc] transition-colors hover:bg-[#eff4ff]",
                    index % 2 === 1 && "bg-[#f8fafc]",
                  )}
                >
                  <TableCell className="py-4">
                    <div className="flex items-center gap-3">
                      {/* Icon badge — previously defined but never rendered */}
                      <span
                        className= "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                        <Pill className="h-4 w-4" />
                      </span>
                      <span className="font-semibold text-[#0d1c2e]">
                        {product.name}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="text-center">
                    <StockBadge qty={product.stockQuantity} />
                  </TableCell>

                  <TableCell className="text-left font-mono text-[#0d1c2e]">
                    {product.customerPrice}
                  </TableCell>

                  <TableCell className="text-left font-mono text-[#0d1c2e]">
                    {product.pharmacistPrice}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      )}
    </section>
  )
}


