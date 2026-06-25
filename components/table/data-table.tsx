"use client"

import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { skipToken, useQuery } from "@tanstack/react-query"
import type { ApiResponse, PaginationType } from "@/types/api-response"
import { Pagination } from "./pagination"

export interface Column<T> {
  key: string
  label: string
  sortable?: boolean
  className?: string
  render?: (item: T) => React.ReactNode
}

type BaseTableProps<T extends { id: number }> = {
  columns: Column<T>[]
  onRowClick?: (item: T) => void
  emptyMessage?: string
  filterKeys?: string[]
  onClearFilters?: () => void
  hasActiveFilters?: boolean
  activatePagination?: boolean
}

type FetchTableProps<T> = {
  queryKey: readonly unknown[]
  queryFn: () => Promise<ApiResponse<T>>
  data?: never
}

type DirectTableProps<T> = {
  data: T[]
  queryKey?: never
  queryFn?: never
}

type DataTableProps<T extends { id: number }> =
  BaseTableProps<T> & (FetchTableProps<T> | DirectTableProps<T>)

function isFetchMode<T extends { id: number }>(
  props: DataTableProps<T>
): props is BaseTableProps<T> & FetchTableProps<T> {
  return "queryKey" in props && "queryFn" in props
}

export function DataTable<T extends { id: number }>(props: DataTableProps<T>) {
  const {
    columns,
    onRowClick,
    emptyMessage = "No data found.",
    onClearFilters,
    hasActiveFilters = false,
    activatePagination = true,
  } = props

  const fetchMode = isFetchMode(props)

  const { data: fetchedData, isLoading, isFetching } = useQuery<ApiResponse<T>>({
    queryKey: fetchMode ? props.queryKey : ["dataAble", "direct"],
    queryFn: fetchMode ? props.queryFn : skipToken,
    enabled: fetchMode,
  })

  const defaultPagination: PaginationType = {
    current_page: 1,
    per_page: 15,
    total: 0,
    last_page: 1,
    from: 0,
    to: 0,
  }

  let items: T[] = []

  if (fetchMode) {
    items = fetchedData?.data ?? []
  } else {
    items = props.data
  }

  const pagination: PaginationType =
    fetchMode && activatePagination
      ? (fetchedData?.pagination ?? defaultPagination)
      : {
          current_page: 1,
          per_page: items.length,
          total: items.length,
          last_page: 1,
          from: items.length ? 1 : 0,
          to: items.length,
        }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="border-b bg-slate-100 hover:bg-slate-100">
            {columns.map((column) => (
              <TableHead
                key={column.key}
                className={cn(
                  "h-12 text-center text-[11px] font-semibold uppercase tracking-wide text-slate-700",
                  column.className
                )}
              >
                {column.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading || isFetching ? (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i} className="h-16">
                {columns.map((column) => (
                  <TableCell key={column.key}>
                    <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : items.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-40 text-center text-slate-500"
              >
                <div className="flex flex-col items-center gap-2">
                  <Search className="h-8 w-8 text-slate-400" />
                  <p>
                    {hasActiveFilters
                      ? "No results match the selected filters"
                      : emptyMessage}
                  </p>
                  {hasActiveFilters && (
                    <Button
                      variant="link"
                      onClick={onClearFilters}
                      className="text-primary"
                    >
                      Clear filters
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ) : (
            items.map((item) => (
              <TableRow
                key={item.id}
                onClick={onRowClick ? () => onRowClick(item) : undefined}
                className={cn(
                  "h-16 border-b border-slate-100 transition-colors hover:bg-slate-50",
                  onRowClick && "cursor-pointer"
                )}
              >
                {columns.map((column) => (
                  <TableCell
                    key={column.key}
                    className={cn(
                      "py-4 text-center text-sm text-slate-700",
                      column.className
                    )}
                  >
                    {column.render
                      ? column.render(item)
                      : typeof column.key === "string"
                        ? (item as any)[column.key]
                        : item[column.key]}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {activatePagination && (
        <div className=" px-4 py-3">
          <Pagination
            pagination={pagination}
            isLoading={isLoading || isFetching}
          />
        </div>
      )}
    </div>
  )
}