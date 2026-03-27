"use client"

import { useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Eye, Trash2, Loader2 } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card } from "@/components/ui/card"
import { Pagination } from "@/components/table/pagination"
import { AddDriverDialog } from "./add-driver-dialog"
import { driversKeys } from "@/lib/drivers/drivers-keys"
import { fetchDrivers, deleteDriver } from "@/lib/drivers/drivers.client"
import type { DriverUser } from "@/types/supplier-drivers"
import type { PaginationType } from "@/types/api-response"

export function DriversContent() {
  const searchParams = useSearchParams()
  const queryClient = useQueryClient()
  const [showAdd, setShowAdd] = useState(false)

  const page = parseInt(searchParams.get("page") || "1", 10)
  const perPage = parseInt(searchParams.get("per_page") || "15", 10)

  const filters = useMemo(() => ({ page, per_page: perPage }), [page, perPage])

  const { data, isLoading, isFetching } = useQuery({
    queryKey: driversKeys.list(filters),
    queryFn: () => fetchDrivers(filters),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteDriver,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: driversKeys.all }),
  })

  const drivers: DriverUser[] = data?.data ?? []
  const pagination: PaginationType = data?.pagination ?? {
    current_page: 1, per_page: perPage, total: 0, last_page: 1, from: 0, to: 0,
  }

  const loading = isLoading || isFetching

  const handleDelete = (id: number) => {
    if (confirm("هل أنت متأكد من حذف هذا السائق؟")) {
      deleteMutation.mutate(id)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">السائقين</h1>
          <p className="text-sm text-muted-foreground mt-1">إدارة أسطول التوصيل</p>
        </div>
        <Button onClick={() => setShowAdd(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          إضافة سائق
        </Button>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>الاسم</TableHead>
              <TableHead>البريد الإلكتروني</TableHead>
              <TableHead className="text-center">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 3 }).map((_, j) => (
                    <TableCell key={j}><div className="h-4 w-full animate-pulse rounded bg-muted" /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : drivers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="h-32 text-center">
                  <div className="text-muted-foreground">لا يوجد سائقين. أضف أول سائق.</div>
                </TableCell>
              </TableRow>
            ) : (
              drivers.map((driver) => (
                <TableRow key={driver.id}>
                  <TableCell className="font-medium">{driver.name}</TableCell>
                  <TableCell className="text-muted-foreground">{driver.email}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Link href={`/drivers/${driver.id}`}>
                        <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-primary">
                          <Eye className="h-4 w-4" />
                          عرض
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleDelete(driver.id)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <Pagination pagination={pagination} isLoading={loading} />
      </div>

      <AddDriverDialog open={showAdd} onOpenChange={setShowAdd} />
    </div>
  )
}
