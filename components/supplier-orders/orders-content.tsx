"use client"

import { useEffect, useMemo, useState } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { format, parse } from "date-fns"
import { ar } from "date-fns/locale"
import { CalendarIcon, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useDebounce } from "@/hooks/use-debounce"
import { createQueryString } from "@/lib/api/queryString"
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { InvoiceDialog } from "./invoice-dialog"
import { ordersKeys } from "@/lib/orders/orders-keys"
import { fetchOrders } from "@/lib/orders/orders.client"
import type { Order, OrderStatus } from "@/types/orders_cart"
import type { SupplierOrdersFilters } from "@/types/supplier-orders"
import { DataTable } from "../table/data-table"
import { createOrderColumns } from "./orders-columns"
import { useQuery } from "@tanstack/react-query"

function parseDateParam(value: string | null): Date | undefined {
  if (!value) return undefined
  const parsed = parse(value, "M/d/yyyy", new Date())
  return Number.isNaN(parsed.getTime()) ? undefined : parsed
}

function getFiltersFromParams(params: URLSearchParams): SupplierOrdersFilters {
  return {
    status: (params.get("status") as OrderStatus | "all" | null) || "all",
    buyer_name: params.get("buyer_name") || "",
    from_date: params.get("from_date") || "",
    to_date: params.get("to_date") || "",
    page: parseInt(params.get("page") || "1", 10),
    per_page: parseInt(params.get("per_page") || "15", 10),
  }
}

export function OrdersContent() {
  const searchParams = useSearchParams()
  const { replace } = useRouter()
  const pathname = usePathname()
  const [invoiceOrderId, setInvoiceOrderId] = useState<number | null>(null)

  const [filters, setFilters] = useState<SupplierOrdersFilters>(() =>
    getFiltersFromParams(searchParams),
  )

  const fromDate = useMemo(
    () => parseDateParam(filters.from_date || null),
    [filters.from_date],
  )
  const toDate = useMemo(
    () => parseDateParam(filters.to_date || null),
    [filters.to_date],
  )

  const queryString = createQueryString<SupplierOrdersFilters>({
    ...filters,
    status: filters.status === "all" ? undefined : (filters.status as OrderStatus),
  })
  const debouncedQuery = useDebounce(queryString, 700)

  useEffect(() => {
    replace(`${pathname}${debouncedQuery ? `?${debouncedQuery}` : ""}`, {
      scroll: false,
    })
  }, [debouncedQuery, pathname, replace])

  const { data: ordersData } = useQuery({
    queryKey: ordersKeys.list(filters),
    queryFn: () => fetchOrders(filters),
  })

  const pendingOrders = ordersData?.data?.filter((order) => order.status == "pending")
  
  const queryKey = useMemo(() => ordersKeys.list(filters), [filters]);
  const queryFn = useMemo(() => () => fetchOrders(filters), [filters]);

  const columns = useMemo(
    () => createOrderColumns(setInvoiceOrderId),
    [],
  )

  const hasActiveFilters =
    (filters.status && filters.status !== "all") ||
    !!filters.buyer_name ||
    !!filters.from_date ||
    !!filters.to_date

  const onClearFilters = () => {
    setFilters((prev) => ({
      ...prev,
      status: "all",
      buyer_name: "",
      from_date: "",
      to_date: "",
      page: 1,
    }))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">سجل الطلبات</h1>
        <p className="text-sm text-muted-foreground mt-1">عرض وتصفية الطلبات السابقة</p>
      </div>

      {(pendingOrders && pendingOrders.length > 0) && <div className="w-full px-4 py-2 bg-orange-100 text-orange-700 border-2 border-orange-400 rounded-2xl dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-700">
        {pendingOrders.length}   طلب في حالة قيد الانتظار 
      </div>}

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px] max-w-md">
          <Search
            className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            type="search"
            placeholder="ابحث باسم المشتري..."
            value={filters.buyer_name || ""}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                buyer_name: e.target.value,
                page: 1,
              }))
            }
            className="pr-9"
            aria-label="البحث باسم المشتري"
          />
        </div>

        <Select
          value={(filters.status as string) || "all"}
          onValueChange={(val) =>
            setFilters((prev) => ({
              ...prev,
              status: val as OrderStatus | "all",
              page: 1,
            }))
          }
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="جميع الحالات" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الحالات</SelectItem>
            <SelectItem value="accepted">مقبول</SelectItem>
            <SelectItem value="delivered">تم التوصيل</SelectItem>
            <SelectItem value="shipped">تم الشحن</SelectItem>
            <SelectItem value="cancelled">ملغي</SelectItem>
            <SelectItem value="pending">معلق</SelectItem>
          </SelectContent>
        </Select>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "justify-start text-start font-normal w-full sm:w-[200px]",
                !fromDate && "text-muted-foreground",
              )}
              type="button"
            >
              <CalendarIcon className="h-4 w-4 opacity-60" />
              {fromDate ? format(fromDate, "PPP", { locale: ar }) : "من تاريخ"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={fromDate}
              onSelect={(date) =>
                setFilters((prev) => ({
                  ...prev,
                  from_date: date ? format(date, "M/d/yyyy") : "",
                  to_date:
                    date && prev.to_date && parseDateParam(prev.to_date)?.getTime()! < date.getTime()
                      ? ""
                      : prev.to_date,
                  page: 1,
                }))
              }
              locale={ar}
            />
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "justify-start text-start font-normal w-full sm:w-[200px]",
                !toDate && "text-muted-foreground",
              )}
              type="button"
            >
              <CalendarIcon className="h-4 w-4 opacity-60" />
              {toDate ? format(toDate, "PPP", { locale: ar }) : "إلى تاريخ"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={toDate}
              onSelect={(date) =>
                setFilters((prev) => ({
                  ...prev,
                  to_date: date ? format(date, "M/d/yyyy") : "",
                  page: 1,
                }))
              }
              locale={ar}
              disabled={(date) => (fromDate ? date < fromDate : false)}
            />
          </PopoverContent>
        </Popover>

        {hasActiveFilters && (
          <Button
            type="button"
            variant="ghost"
            onClick={onClearFilters}
            className="gap-2 text-muted-foreground hover:text-foreground"
            aria-label="مسح جميع فلاتر الطلبات"
          >
            <X className="h-4 w-4" aria-hidden="true" />
            <span>مسح</span>
          </Button>
        )}
      </div>

      <div className="rounded-lg border bg-card">
        <DataTable<Order>
          columns={columns}
          queryKey={queryKey}
          queryFn={queryFn}
          emptyMessage="لم يتم العثور على منتجات"
        />
      </div>

      <InvoiceDialog orderId={invoiceOrderId} onClose={() => setInvoiceOrderId(null)} />
    </div>
  )
}
