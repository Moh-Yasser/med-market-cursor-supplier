"use client"

import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

type Props = {
  pagination: {
    current_page: number
    last_page: number
    total: number
    from: number
    to: number
  }
  preserveFilters?: string[]
}

export function PaginationClient({ pagination }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { current_page, last_page, total, from, to } = pagination

  const goTo = (page: number) => {
    if (page < 1 || page > last_page) return
    const params = new URLSearchParams(searchParams)
    if (page > 1) {
      params.set("page", String(page))
    } else {
      params.delete("page")
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  return (
    <div className="flex items-center justify-between text-sm">
      <div className="text-muted-foreground">
        Showing {from}-{to} of {total} items
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" disabled={current_page <= 1} onClick={() => goTo(current_page - 1)}>
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <span className="text-muted-foreground">
          Page {current_page} of {last_page}
        </span>
        <Button variant="outline" size="sm" disabled={current_page >= last_page} onClick={() => goTo(current_page + 1)}>
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
