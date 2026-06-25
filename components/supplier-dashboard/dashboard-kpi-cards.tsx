import {
  BarChart2,
  ChartColumn,
  Clock3,
  Package,
  ReceiptText,
  TrendingDown,
  TrendingUp,
  Truck,
} from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import type { Kpis } from "@/types/dashboard"

const iconMap = {
  active_shipments: Truck,
  pending_orders:   Clock3,
  total_orders:     ReceiptText,
  total_products:   Package,
} as const

const accentMap = {
  active_shipments: "bg-blue-100 text-blue-700",
  pending_orders:   "bg-amber-100 text-amber-700",
  total_orders:     "bg-teal-100 text-teal-700",
  total_products:   "bg-purple-100 text-purple-700",
} as const

const trendToneMap = {
  positive: "text-teal-700",
  warning:  "text-amber-700",
  danger:   "text-red-700",
  neutral:  "text-amber-700",
} as const

const trendIconMap = {
  up:   TrendingUp,
  down: TrendingDown,
  flat: BarChart2,
} as const

function KpiCardSkeleton() {
  return (
    <div className="flex min-h-40 flex-col justify-between rounded-xl bg-white p-6 shadow-[0_4px_20px_rgba(26,54,93,0.07)]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-3">
          <Skeleton className="h-3 w-2/3" />
          <Skeleton className="h-8 w-1/3" />
        </div>
        <Skeleton className="h-11 w-11 shrink-0 rounded-full" />
      </div>
      <Skeleton className="mt-8 h-3 w-1/2" />
    </div>
  )
}

export function DashboardKpiCards({
  kpis,
  isLoading = false,
}: {
  kpis: Kpis
  isLoading?: boolean
}) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <KpiCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
      {kpis.map((kpi) => {
        const Icon      = iconMap[kpi.id as keyof typeof iconMap] ?? Package
        const TrendIcon = kpi.trend
          ? trendIconMap[kpi.trend.direction]
          : null

        return (
          <article
            key={kpi.id}
            className="flex min-h-40 flex-col justify-between rounded-xl bg-white p-6 shadow-[0_4px_20px_rgba(26,54,93,0.07)]"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="mb-2 text-sm font-bold text-[#43474e]">
                  {kpi.title}
                </p>
                <p className="text-3xl font-bold leading-none text-[#002045]">
                  {kpi.value}
                </p>
              </div>
              <div
                className={cn(
                  "flex h-11 w-11 shrink-0 items-center justify-center rounded-full",
                  accentMap[kpi.id as keyof typeof accentMap],
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
            </div>

            <div className="mt-8 flex items-center gap-2 text-sm text-[#43474e]">
              {kpi.trend && TrendIcon && (
                <span
                  className={cn(
                    "inline-flex items-center gap-1 font-semibold",
                    trendToneMap[kpi.trend.tone],
                  )}
                >
                  {kpi.trend.value}
                  <TrendIcon className="h-4 w-4" />
                </span>
              )}
              <span>{kpi.description}</span>
            </div>
          </article>
        )
      })}
    </div>
  )
}
