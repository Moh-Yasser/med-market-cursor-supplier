
'use client'

import { useQuery } from "@tanstack/react-query"
import { AlertCircle, RefreshCw } from "lucide-react"

import { DashboardKpiCards } from "./dashboard-kpi-cards"
import { SalesOverviewChart } from "./sales-overview-chart"
import { TopBuyersList } from "./top-buyers-list"
import { TopProductsTable } from "./top-products-table"
import { getDashboardData } from "@/lib/dashboard/dashboard.client"
import { DASHBOARD_KEYS } from "@/lib/dashboard/dashboard-keys"
import type { DashboardApiResponse, DashboardData } from "@/types/dashboard"

function ErrorCard({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center">
      <AlertCircle className="mx-auto mb-3 h-9 w-9 text-red-500" />
      <p className="mb-1 text-base font-bold text-red-700">تعذّر تحميل البيانات</p>
      <p className="mb-5 text-sm text-[#43474e]">
        تحقق من اتصالك بالإنترنت ثم حاول مجدداً.
      </p>
      <button
        onClick={onRetry}
        className="inline-flex items-center gap-2 rounded-lg bg-red-700 px-5 py-2 text-sm font-bold text-white transition hover:bg-red-800"
      >
        <RefreshCw className="h-4 w-4" />
        إعادة المحاولة
      </button>
    </div>
  )
}

export function DashboardContent() {
  const { data, isLoading, isError, refetch } = useQuery<DashboardApiResponse>({
    queryKey: DASHBOARD_KEYS.all,
    queryFn: getDashboardData,
  })

  const {
    kpis        = [],
    salesSeries = [],
    topProducts = [],
    topBuyers   = [],
  } = (data?.data ?? {}) as Partial<DashboardData>

  return (
    <div dir="rtl" className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-[#002045]">
          نظرة عامة على التشغيل
        </h1>
        <p className="text-sm text-[#43474e]">
          مقاييس سلسلة التوريد والتنفيذ في الوقت الفعلي.
        </p>
      </header>

      {isError ? (
        <ErrorCard onRetry={refetch} />
      ) : (
        <>
          <DashboardKpiCards kpis={kpis} isLoading={isLoading} />

          <SalesOverviewChart data={salesSeries} isLoading={isLoading} />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <TopProductsTable products={topProducts} isLoading={isLoading} />
            <TopBuyersList buyers={topBuyers} isLoading={isLoading} />
          </div>
        </>
      )}
    </div>
  )
}
