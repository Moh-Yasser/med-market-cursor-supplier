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
    <div>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            {columns.map((column) => (
              <TableHead
                key={column.key}
                className={cn("text-sm font-medium", "text-center", column.className)}
              >
                {column.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading || isFetching ? (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                {columns.map((column) => (
                  <TableCell key={column.key}>
                    <div className="h-4 w-full animate-pulse rounded bg-muted" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-32 text-center text-muted-foreground">
                <div className="flex flex-col items-center gap-2">
                  <Search className="h-8 w-8 text-muted-foreground/50" />
                  <p className="text-muted-foreground">
                    {hasActiveFilters ? "No results match the selected filters" : emptyMessage}
                  </p>
                  {hasActiveFilters && (
                    <Button variant="link" onClick={onClearFilters} className="text-primary">
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
                className={cn(onRowClick && "cursor-pointer")}
              >
                {columns.map((column) => (
                  <TableCell key={column.key} className={cn("text-sm", "text-center", column.className)}>
                    {column.render
                      ? column.render(item)
                      : (typeof column.key === "string"
                        ? (item as any)[column.key]
                        : item[column.key])
                      }
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      {activatePagination && <Pagination pagination={pagination} isLoading={isLoading || isFetching} />}
    </div>
  )
}
